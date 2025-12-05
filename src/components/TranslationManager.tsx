import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Globe, Loader2, Save } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>(enabledLanguages[0] || "en");

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

  const availableLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== "nl" && enabledLanguages.includes(lang.code)
  );

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
        <CardContent className="py-8 text-center text-muted-foreground">
          <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Geen extra talen ingeschakeld.</p>
          <p className="text-sm">Ga naar restaurantinstellingen om talen toe te voegen.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Vertalingen: {entityName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {availableLanguages.map(lang => (
              <TabsTrigger key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableLanguages.map(lang => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-4">
              {fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={`${lang.code}-${field.name}`}>
                    {field.label}
                    <span className="text-xs text-muted-foreground ml-2">
                      (NL: {field.originalValue || "-"})
                    </span>
                  </Label>
                  {field.multiline ? (
                    <Textarea
                      id={`${lang.code}-${field.name}`}
                      value={translations[lang.code]?.[field.name] || ""}
                      onChange={(e) => updateTranslation(lang.code, field.name, e.target.value)}
                      placeholder={`${field.label} in ${lang.name}`}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={`${lang.code}-${field.name}`}
                      value={translations[lang.code]?.[field.name] || ""}
                      onChange={(e) => updateTranslation(lang.code, field.name, e.target.value)}
                      placeholder={`${field.label} in ${lang.name}`}
                    />
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Annuleren
            </Button>
          )}
          <Button onClick={saveTranslations} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Opslaan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationManager;
