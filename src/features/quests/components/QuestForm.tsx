import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Quest, QuestStep, QuestType, QuestRepeatInterval, StatReward } from "@/types/quests";
import { StatName } from "@/types/character";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Achievement } from "@/types/achievements";
import AchievementLinksField from "@/components/achievements/form-fields/AchievementLinksField";

// Import refactored components
import { QuestBasicInfoSection } from "./form-sections/QuestBasicInfoSection";
import { QuestStepsSection } from "./form-sections/QuestStepsSection";
import { BasicRewardsSection } from "./form-sections/BasicRewardsSection";
import { StatRewardsSection } from "./form-sections/StatRewardsSection";
import { QuestTagsSection } from "./form-sections/QuestTagsSection";
import { RepeatabilitySection } from "./form-sections/RepeatabilitySection";

// Define validation schema
const questFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  type: z.enum(["main", "side", "boss"] as const),
  difficulty: z.enum(["easy", "medium", "hard"] as const),
  steps: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, { message: "Step description is required" })
    })
  ),
  xpReward: z.number().int().min(0),
  coinReward: z.number().int().min(0),
  tags: z.array(z.string()).optional(),
  repeatType: z.enum(["none", "daily", "weekly", "monthly", "custom"] as const),
  customResetDays: z.array(z.number()).optional(),
  statRewards: z.object({
    strength: z.number().int().min(0).max(5).optional(),
    dexterity: z.number().int().min(0).max(5).optional(),
    constitution: z.number().int().min(0).max(5).optional(),
    intelligence: z.number().int().min(0).max(5).optional(),
    wisdom: z.number().int().min(0).max(5).optional(),
    charisma: z.number().int().min(0).max(5).optional()
  }).optional()
});

type QuestFormValues = z.infer<typeof questFormSchema>;

type QuestFormProps = { 
  onSubmit: (quest: Omit<Quest, "id" | "status">) => void;
  initialData?: Partial<Quest> | null;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  achievements: Achievement[];
};

export const QuestForm = ({ 
  onSubmit, 
  initialData = null,
  onCancel,
  isSubmitting = false,
  submitButtonText = "Submit",
  achievements
}: QuestFormProps) => {
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const isProcessing = isSubmitting || isSubmittingInternal;
  
  // Create initial values for the form
  const defaultValues: QuestFormValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "side",
    difficulty: initialData?.difficulty || "medium",
    steps: initialData?.steps?.map(step => ({ 
      id: step.id, 
      description: step.description 
    })) || [],
    xpReward: initialData?.xpReward || 20,
    coinReward: initialData?.coinReward || 10,
    tags: initialData?.tags || [],
    repeatType: initialData?.repeatType || "none",
    customResetDays: initialData?.customResetDays || [],
    statRewards: {
      strength: initialData?.statRewards?.find(sr => sr.stat === "strength")?.value || 0,
      dexterity: initialData?.statRewards?.find(sr => sr.stat === "dexterity")?.value || 0,
      constitution: initialData?.statRewards?.find(sr => sr.stat === "constitution")?.value || 0,
      intelligence: initialData?.statRewards?.find(sr => sr.stat === "intelligence")?.value || 0,
      wisdom: initialData?.statRewards?.find(sr => sr.stat === "wisdom")?.value || 0,
      charisma: initialData?.statRewards?.find(sr => sr.stat === "charisma")?.value || 0
    },
    linkedAchievementIds: initialData?.linkedAchievementIds || []
  };

  // Setup form with validation
  const methods = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues,
    mode: "onChange"
  });

  // Define all available stat names
  const statNames: StatName[] = [
    "strength", "dexterity", "constitution", 
    "intelligence", "wisdom", "charisma"
  ];

  const [selectedAchievementIds, setSelectedAchievementIds] = useState<string[]>(
    defaultValues.linkedAchievementIds
  );

  const handleFormSubmit = async (data: QuestFormValues) => {
    try {
      setIsSubmittingInternal(true);
      
      // Transform the form data to match the expected Quest format
      const questData: Omit<Quest, "id" | "status"> = {
        title: data.title,
        description: data.description || "",
        type: data.type,
        difficulty: data.difficulty,
        steps: data.steps.map(step => ({ 
          id: step.id || Date.now().toString(), // Ensure id is always present
          description: step.description,
          completed: false 
        })),
        xpReward: data.xpReward,
        coinReward: data.coinReward,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
        repeatType: data.repeatType,
        customResetDays: data.repeatType === "custom" ? data.customResetDays : undefined,
        // Transform the statRewards object to array of StatReward
        statRewards: Object.entries(data.statRewards || {})
          .filter(([_, value]) => value && value > 0)
          .map(([stat, value]) => ({
            stat: stat as StatName,
            value: value as number
          })),
        linkedAchievementIds: data.linkedAchievementIds
      };

      // Submit the quest data
      onSubmit(questData);
      
      // Add a small delay to ensure UI is responsive
      setTimeout(() => {
        setIsSubmittingInternal(false);
      }, 100);
    } catch (error) {
      console.error("Error submitting quest:", error);
      toast.error("Failed to save quest. Please try again.");
      setIsSubmittingInternal(false);
    }
  };

  const handleAchievementToggle = (achievementId: string) => {
    setSelectedAchievementIds(prev => {
      const newIds = prev.includes(achievementId)
        ? prev.filter(id => id !== achievementId)
        : [...prev, achievementId];
      methods.setValue("linkedAchievementIds", newIds);
      return newIds;
    });
  };

  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-4 p-1">
          <QuestBasicInfoSection />

          <QuestTagsSection />

          <QuestStepsSection />

          <RepeatabilitySection />

          <BasicRewardsSection />

          <StatRewardsSection statNames={statNames} />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Linked Achievements</h3>
            <AchievementLinksField
              achievements={achievements}
              selectedAchievementIds={selectedAchievementIds}
              onAchievementToggle={handleAchievementToggle}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              type="button" 
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing}
            >
              {isProcessing 
                ? initialData ? 'Updating...' : 'Creating...' 
                : submitButtonText
              }
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </ScrollArea>
  );
};
