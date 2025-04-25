
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { JournalFormData } from "./JournalFormSchema";

export function JournalFormOptions() {
  const { register, setValue, watch } = useFormContext<JournalFormData>();
  const isFavorite = watch("isFavorite");
  const isPrivate = watch("isPrivate");

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="favorite-switch"
          checked={!!isFavorite}
          onCheckedChange={(checked) => {
            setValue("isFavorite", checked);
          }}
        />
        <Label htmlFor="favorite-switch">Mark as favorite</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="private-switch"
          checked={!!isPrivate}
          onCheckedChange={(checked) => {
            setValue("isPrivate", checked);
          }}
        />
        <Label htmlFor="private-switch">Make private</Label>
      </div>
    </div>
  );
}
