import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

const defaultDayHours: DayHours = { open: "11:00", close: "22:00", closed: false };

export const defaultOpeningHours: OpeningHours = {
  monday: { ...defaultDayHours },
  tuesday: { ...defaultDayHours },
  wednesday: { ...defaultDayHours },
  thursday: { ...defaultDayHours },
  friday: { ...defaultDayHours },
  saturday: { ...defaultDayHours },
  sunday: { open: "12:00", close: "21:00", closed: false },
};

const dayLabels: Record<keyof OpeningHours, string> = {
  monday: "Maandag",
  tuesday: "Dinsdag",
  wednesday: "Woensdag",
  thursday: "Donderdag",
  friday: "Vrijdag",
  saturday: "Zaterdag",
  sunday: "Zondag",
};

interface OpeningHoursEditorProps {
  value: OpeningHours;
  onChange: (hours: OpeningHours) => void;
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const days = Object.keys(dayLabels) as (keyof OpeningHours)[];

  const updateDay = (day: keyof OpeningHours, updates: Partial<DayHours>) => {
    onChange({
      ...value,
      [day]: { ...value[day], ...updates },
    });
  };

  return (
    <div className="space-y-3">
      {days.map((day) => (
        <div key={day} className="flex items-center gap-4">
          <div className="w-24 shrink-0">
            <Label className="text-sm font-medium">{dayLabels[day]}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!value[day].closed}
              onCheckedChange={(checked) => updateDay(day, { closed: !checked })}
            />
            <span className="text-sm text-muted-foreground w-12">
              {value[day].closed ? "Gesloten" : "Open"}
            </span>
          </div>
          {!value[day].closed && (
            <>
              <Input
                type="time"
                className="w-28"
                value={value[day].open}
                onChange={(e) => updateDay(day, { open: e.target.value })}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="time"
                className="w-28"
                value={value[day].close}
                onChange={(e) => updateDay(day, { close: e.target.value })}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function isRestaurantOpen(openingHours: OpeningHours | null | Record<string, any>): { isOpen: boolean; message: string } {
  if (!openingHours || Object.keys(openingHours).length === 0) {
    return { isOpen: true, message: "" };
  }

  const now = new Date();
  const dayNames: (keyof OpeningHours)[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
  ];
  const currentDay = dayNames[now.getDay()];
  const todayHours = (openingHours as OpeningHours)[currentDay];

  if (!todayHours) {
    return { isOpen: true, message: "" };
  }

  if (todayHours.closed) {
    return { isOpen: false, message: "Het restaurant is vandaag gesloten" };
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(":").map(Number);
  const [closeHour, closeMin] = todayHours.close.split(":").map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  if (currentTime < openTime) {
    return { isOpen: false, message: `Het restaurant opent om ${todayHours.open}` };
  }

  if (currentTime >= closeTime) {
    return { isOpen: false, message: `Het restaurant is gesloten (sloot om ${todayHours.close})` };
  }

  return { isOpen: true, message: "" };
}
