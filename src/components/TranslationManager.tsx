import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, Loader2, Save, Check, AlertCircle } from "lucide-react";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/subscription-tiers";

interface Translation {
  id?: string;
  entity_type: string;
  entity_id: string;
  field_name: string;
  language_code: string;
  translation_text: string;
}

interface TranslationManagerProps {
  entityType: "restaurant" | "menu" | "category" | "item";
  entityId: string;
  entityName: string;
  fields: { name: string; label: string; multiline?: boolean; originalValue: string }[];
  enabledLanguages: string[];
  onClose?: () => void;
}

const TranslationManager = ({
  entityType,
  entityId,
  entityName,
  fields,
  enabledLanguages,
  onClose,
}: TranslationManagerProps) => {
  const { toast } = useToast();
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get languages excluding Dutch (base language)
  const availableLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== "nl" && enabledLanguages.includes(lang.code)
  );

  useEffect(() => {
    fetchTranslations();
  }, [entityId]);

  const fetchTranslations = async () => {
    const { data, error } = await supabase
      .from("translations")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);

    if (error) {
      console.error("Error fetching translations:", error);
    } else {
      const translationMap: Record<string, Record<string, string>> = {};
      data?.forEach((t: Translation) => {
        if (!translationMap[t.language_code]) {
          translationMap[t.language_code] = {};
        }
        translationMap[t.language_code][t.field_name] = t.translation_text;
      });
      setTranslations(translationMap);
    }
    setLoading(false);
  };

  const updateTranslation = (langCode: string, fieldName: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [langCode]: {
        ...(prev[langCode] || {}),
        [fieldName]: value,
      },
    }));
  };

  const saveTranslations = async () => {
    setSaving(true);
    
    // Delete existing translations for this entity
    await supabase
      .from("translations")
      .delete()
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);

    // Insert new translations
    const inserts: Translation[] = [];
    Object.entries(translations).forEach(([langCode, fieldTranslations]) => {
      Object.entries(fieldTranslations).forEach(([fieldName, text]) => {
        if (text.trim()) {
          inserts.push({
            entity_type: entityType,
            entity_id: entityId,
            field_name: fieldName,
            language_code: langCode,
            translation_text: text,
          });
        }
      });
    });

    if (inserts.length > 0) {
      const { error } = await supabase.from("translations").insert(inserts);
      if (error) {
        toast({ title: "Fout", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    toast({ title: "Vertalingen opgeslagen" });
    setSaving(false);
    onClose?.();
  };

  // Calculate translation progress
  const getTranslationProgress = (langCode: string) => {
    const langTranslations = translations[langCode] || {};
    const filledFields = fields.filter(f => langTranslations[f.name]?.trim()).length;
    return { filled: filledFields, total: fields.length };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (availableLanguages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Geen extra talen ingeschakeld</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Om vertalingen toe te voegen moet u eerst extra talen inschakelen 
            in de restaurantinstellingen.
          </p>
          <p className="text-xs text-muted-foreground">
            Ga naar Restaurant bewerken → Meertalige menu's
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with info */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <Globe className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium text-sm">Vertalingen voor: {entityName}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Nederlands is de standaardtaal. Voeg hier vertalingen toe voor de andere ingeschakelde talen.
          </p>
        </div>
      </div>

      {/* Language sections */}
      <div className="space-y-6">
        {availableLanguages.map(lang => {
          const progress = getTranslationProgress(lang.code);
          const isComplete = progress.filled === progress.total;

          return (
            <Card key={lang.code} className={isComplete ? "border-primary/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <CardTitle className="text-base">{lang.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {progress.filled} van {progress.total} velden ingevuld
                      </CardDescription>
                    </div>
                  </div>
                  {isComplete ? (
                    <Badge variant="default" className="bg-primary/10 text-primary border-0">
                      <Check className="h-3 w-3 mr-1" />
                      Compleet
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {Math.round((progress.filled / progress.total) * 100)}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map(field => (
                  <div key={field.name} className="space-y-2">
                    <Label 
                      htmlFor={`${lang.code}-${field.name}`}
                      className="text-sm font-medium"
                    >
                      {field.label}
                    </Label>
                    <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md mb-2">
                      <span className="font-medium">NL:</span> {field.originalValue || "(leeg)"}
                    </div>
                    {field.multiline ? (
                      <Textarea
                        id={`${lang.code}-${field.name}`}
                        value={translations[lang.code]?.[field.name] || ""}
                        onChange={(e) => updateTranslation(lang.code, field.name, e.target.value)}
                        placeholder={`${field.label} in het ${lang.name}`}
                        rows={3}
                        className="resize-none"
                      />
                    ) : (
                      <Input
                        id={`${lang.code}-${field.name}`}
                        value={translations[lang.code]?.[field.name] || ""}
                        onChange={(e) => updateTranslation(lang.code, field.name, e.target.value)}
                        placeholder={`${field.label} in het ${lang.name}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        )}
        <Button onClick={saveTranslations} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Vertalingen opslaan
        </Button>
      </div>
    </div>
  );
};

export default TranslationManager;
