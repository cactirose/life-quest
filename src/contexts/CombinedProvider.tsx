import { ReactNode } from "react";
import { CharacterContext } from "./CharacterContext";
import { QuestContext } from "./QuestContext";
import { InventoryContext } from "./InventoryContext";
import { HabitContext } from "./HabitContext";
import { MoodContext } from "./MoodContext";
import { AchievementContext } from "./AchievementContext";
import { DataContext, GameData } from "./DataContext";

interface CombinedProviderProps {
  children: ReactNode;
  contextValue: GameData;
  characterContextValue: any;
  questContextValue: any;
  inventoryContextValue: any;
  habitContextValue: any;
  moodContextValue: any;
  achievementContextValue: any;
}

export const CombinedProvider = ({
  children,
  contextValue,
  characterContextValue,
  questContextValue,
  inventoryContextValue,
  habitContextValue,
  moodContextValue,
  achievementContextValue
}: CombinedProviderProps) => {
  return (
    <DataContext.Provider value={contextValue}>
      <CharacterContext.Provider value={characterContextValue}>
        <QuestContext.Provider value={questContextValue}>
          <InventoryContext.Provider value={inventoryContextValue}>
            <HabitContext.Provider value={habitContextValue}>
              <MoodContext.Provider value={moodContextValue}>
                <AchievementContext.Provider value={achievementContextValue}>
                  {children}
                </AchievementContext.Provider>
              </MoodContext.Provider>
            </HabitContext.Provider>
          </InventoryContext.Provider>
        </QuestContext.Provider>
      </CharacterContext.Provider>
    </DataContext.Provider>
  );
};
