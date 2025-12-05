import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddToCartButtonProps {
  onAdd: () => void;
  price: number | null;
}

export function AddToCartButton({ onAdd, price }: AddToCartButtonProps) {
  if (price === null) return null;
  
  return (
    <Button
      size="icon"
      variant="outline"
      className="h-8 w-8 shrink-0"
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
