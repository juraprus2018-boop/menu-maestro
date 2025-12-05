import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

// EU 14 main allergens
const EU_ALLERGENS = [
  { id: "gluten", label: "Gluten", emoji: "🌾" },
  { id: "schaaldieren", label: "Schaaldieren", emoji: "🦐" },
  { id: "eieren", label: "Eieren", emoji: "🥚" },
  { id: "vis", label: "Vis", emoji: "🐟" },
  { id: "pinda", label: "Pinda's", emoji: "🥜" },
  { id: "soja", label: "Soja", emoji: "🫘" },
  { id: "melk", label: "Melk", emoji: "🥛" },
  { id: "noten", label: "Noten", emoji: "🌰" },
  { id: "selderij", label: "Selderij", emoji: "🥬" },
  { id: "mosterd", label: "Mosterd", emoji: "🟡" },
  { id: "sesam", label: "Sesamzaad", emoji: "🔸" },
  { id: "sulfiet", label: "Sulfiet", emoji: "🍷" },
  { id: "lupine", label: "Lupine", emoji: "🌸" },
  { id: "weekdieren", label: "Weekdieren", emoji: "🦪" },
];

interface AllergenSelectorProps {
  selectedAllergens: string[];
  onChange: (allergens: string[]) => void;
}

export const AllergenSelector = ({ selectedAllergens, onChange }: AllergenSelectorProps) => {
  const [customAllergen, setCustomAllergen] = useState("");

  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      onChange(selectedAllergens.filter((a) => a !== allergen));
    } else {
      onChange([...selectedAllergens, allergen]);
    }
  };

  const addCustomAllergen = () => {
    const trimmed = customAllergen.trim();
    if (trimmed && !selectedAllergens.includes(trimmed)) {
      onChange([...selectedAllergens, trimmed]);
      setCustomAllergen("");
    }
  };

  const removeAllergen = (allergen: string) => {
    onChange(selectedAllergens.filter((a) => a !== allergen));
  };

  // Find custom allergens (not in EU list)
  const customAllergens = selectedAllergens.filter(
    (a) => !EU_ALLERGENS.find((eu) => eu.id === a || eu.label === a)
  );

  return (
    <div className="space-y-3">
      <Label>Allergenen</Label>
      
      {/* EU Allergens Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {EU_ALLERGENS.map((allergen) => {
          const isSelected = selectedAllergens.includes(allergen.id) || selectedAllergens.includes(allergen.label);
          return (
            <button
              key={allergen.id}
              type="button"
              onClick={() => toggleAllergen(allergen.id)}
              className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              <span>{allergen.emoji}</span>
              <span className="truncate">{allergen.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom allergens */}
      {customAllergens.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {customAllergens.map((allergen) => (
            <Badge key={allergen} variant="secondary" className="gap-1">
              {allergen}
              <button
                type="button"
                onClick={() => removeAllergen(allergen)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add custom allergen */}
      <div className="flex gap-2">
        <Input
          value={customAllergen}
          onChange={(e) => setCustomAllergen(e.target.value)}
          placeholder="Eigen allergeen toevoegen..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomAllergen();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addCustomAllergen}
          disabled={!customAllergen.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Helper to get allergen display info
export const getAllergenInfo = (allergenId: string) => {
  const found = EU_ALLERGENS.find((a) => a.id === allergenId || a.label === allergenId);
  return found || { id: allergenId, label: allergenId, emoji: "⚠️" };
};

export { EU_ALLERGENS };
