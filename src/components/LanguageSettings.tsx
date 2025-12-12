import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, Lock, Loader2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { SUPPORTED_LANGUAGES, getTierFromProductId, LanguageCode } from "@/lib/subscription-tiers";

interface LanguageSettingsProps {
  restaurantId: string;
  enabledLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

const LanguageSettings = ({ restaurantId, enabledLanguages, onLanguagesChange }: LanguageSettingsProps) => {
  const { toast } = useToast();
  const [hasPro, setHasPro] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      const tier = getTierFromProductId(data.product_id);
      // Pro and Ordering tiers both have multi-language support
      setHasPro(tier === "pro" || tier === "ordering");
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const toggleLanguage = async (langCode: string) => {
    if (!hasPro) return;
    
    const newLanguages = enabledLanguages.includes(langCode)
      ? enabledLanguages.filter(l => l !== langCode)
      : [...enabledLanguages, langCode];
    
    setSaving(true);
    const { error } = await supabase
      .from("restaurants")
      .update({ enabled_languages: newLanguages })
      .eq("id", restaurantId);

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      onLanguagesChange(newLanguages);
      toast({ title: "Talen bijgewerkt" });
    }
    setSaving(false);
  };

  if (checkingSubscription) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle className="font-serif">Meertalige menu's</CardTitle>
          {!hasPro && (
            <Badge variant="secondary" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
        <CardDescription>
          {hasPro 
            ? "Selecteer welke talen je wilt aanbieden. Nederlands is altijd de standaardtaal."
            : "Upgrade naar Pro om je menu in meerdere talen aan te bieden."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPro ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isNL = lang.code === "nl";
                const isEnabled = isNL || enabledLanguages.includes(lang.code);
                
                return (
                  <button
                    key={lang.code}
                    onClick={() => !isNL && toggleLanguage(lang.code)}
                    disabled={isNL || saving}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isEnabled 
                        ? "bg-primary/10 border-primary" 
                        : "bg-muted/50 border-border hover:border-primary/50"
                    } ${isNL ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    {isEnabled && <Check className="h-4 w-4 text-primary" />}
                    {isNL && <Badge variant="outline" className="text-xs">Standaard</Badge>}
                  </button>
                );
              })}
            </div>
            {enabledLanguages.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Ga naar Menu beheren om vertalingen toe te voegen voor de geselecteerde talen.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 opacity-50">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
              ))}
            </div>
            <Link to="/pricing">
              <Button className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Upgrade naar Pro - €14,95/maand
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
