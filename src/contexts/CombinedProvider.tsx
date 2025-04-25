
import { ReactNode } from "react";
import { QuestContext } from "./QuestContext";
import { InventoryContext } from "./InventoryContext";
import { SkillTreeContext } from "./SkillTreeContext";
import { HabitContext } from "./HabitContext";
import { MoodContext } from "./MoodContext";
import { AchievementContext } from "./AchievementContext";
import { DataContext, DataContextType } from "./DataContext";

interface CombinedProviderProps {
  children: ReactNode;
  contextValue: DataContextType;
  questContextValue: any;
  inventoryContextValue: any;
  skillTreeContextValue: any;
  habitContextValue: any;
  moodContextValue: any;
  achievementContextValue: any;
}

export const CombinedProvider = ({
  children,
  contextValue,
  questContextValue,
  inventoryContextValue,
  skillTreeContextValue,
  habitContextValue,
  moodContextValue,
  achievementContextValue
}: CombinedProviderProps) => {
  return (
    <DataContext.Provider value={contextValue}>
      <QuestContext.Provider value={questContextValue}>
        <InventoryContext.Provider value={inventoryContextValue}>
          <SkillTreeContext.Provider value={skillTreeContextValue}>
            <HabitContext.Provider value={habitContextValue}>
              <MoodContext.Provider value={moodContextValue}>
                <AchievementContext.Provider value={achievementContextValue}>
                  {children}
                </AchievementContext.Provider>
              </MoodContext.Provider>
            </HabitContext.Provider>
          </SkillTreeContext.Provider>
        </InventoryContext.Provider>
      </QuestContext.Provider>
    </DataContext.Provider>
  );
};
