
import { GameData } from '../types/gameData';
import { generateId } from './idGenerator';
import { QuestStatus, QuestType } from '../types/quests';
import { ChallengeFrequency, ChallengeStatus } from '../types/challenges';

export const DEFAULT_GAME_DATA: GameData = {
  character: {
    id: generateId(),
    name: 'New Hero',
    xp: 0,
    level: 1,
    coins: 0,
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    loginStreak: 0,
    lastLoginDate: '',
  },
  quests: [
    {
      id: generateId(),
      title: 'Start Your Journey',
      description: 'Complete this quest to start your adventure!',
      type: QuestType.MAIN,
      status: QuestStatus.ACTIVE,
      difficulty: 1,
      xpReward: 50,
      coinReward: 10,
      statRewards: {},
      steps: [
        {
          id: '1',
          description: 'Create your first habit',
          completed: false
        },
        {
          id: '2',
          description: 'Complete your first habit',
          completed: false
        }
      ],
      dateCreated: new Date().toISOString(),
      dateCompleted: null,
      tags: ['tutorial'],
    },
  ],
  habits: [],
  inventory: [],
  achievements: [
    {
      id: generateId(),
      title: 'First Steps',
      description: 'Begin your life improvement journey',
      icon: 'footprints',
      linkType: 'none',
      linkId: null,
      goal: 1,
      progress: 0,
      unlocked: false,
      dateCreated: new Date().toISOString(),
      dateUnlocked: null,
      coinReward: 5,
      xpReward: 10,
      statRewards: {},
      specialReward: null,
    }
  ],
  moods: [],
  skillTrees: [],
  challenges: [
    {
      id: generateId(),
      title: 'Daily Login',
      description: 'Log in 7 days in a row',
      frequency: ChallengeFrequency.WEEKLY,
      status: ChallengeStatus.ACTIVE,
      currentCount: 0,
      requiredCount: 7,
      xpReward: 100,
      coinReward: 50,
      statRewards: {},
      specialReward: null,
      resetDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    }
  ]
};
