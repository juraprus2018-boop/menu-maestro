import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/subscription-tiers";

interface LanguageSelectorProps {
  currentLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (lang: string) => void;
  className?: string;
}

const LanguageSelector = ({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  className = "",
}: LanguageSelectorProps) => {
  // Always include NL as default
  const allLanguages = ["nl", ...availableLanguages.filter(l => l !== "nl")];
  
  const languages = SUPPORTED_LANGUAGES.filter(lang => 
    allLanguages.includes(lang.code)
  );

  if (languages.length <= 1) return null;

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Globe className="h-4 w-4 mr-2" />
          {currentLang?.flag} {currentLang?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {currentLanguage === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
