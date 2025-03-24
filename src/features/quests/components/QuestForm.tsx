
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Quest, QuestStep, QuestType, QuestRepeatType } from "@/types/quests";
import { StatName } from "@/types/character";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import our components
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
};

export const QuestForm = ({ 
  onSubmit, 
  initialData = null,
  onCancel
}: QuestFormProps) => {
  // Create initial values for the form
  const defaultValues: QuestFormValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "side",
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
      strength: initialData?.statRewards?.strength || 0,
      dexterity: initialData?.statRewards?.dexterity || 0,
      constitution: initialData?.statRewards?.constitution || 0,
      intelligence: initialData?.statRewards?.intelligence || 0,
      wisdom: initialData?.statRewards?.wisdom || 0,
      charisma: initialData?.statRewards?.charisma || 0
    }
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

  const handleFormSubmit = (data: QuestFormValues) => {
    // Transform the form data to match the expected Quest format
    const questData: Omit<Quest, "id" | "status"> = {
      title: data.title,
      description: data.description || "",
      type: data.type,
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
      // Filter out zero-value stat rewards
      statRewards: Object.fromEntries(
        Object.entries(data.statRewards || {}).filter(([_, value]) => value > 0)
      )
    };

    onSubmit(questData);
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

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Quest' : 'Create Quest'}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </ScrollArea>
  );
};
