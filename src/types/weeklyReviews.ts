
export interface StatProgress {
  stat: string;
  previous: number;
  current: number;
  change: number;
}

export interface TopSkill {
  name: string;
  count: number;
}

export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  quests_completed: number;
  main_quests_completed: number;
  side_quests_completed: number;
  xp_gained: number;
  coins_earned: number;
  journal_entry_count: number;
  habit_completion_rate: number;
  stat_progress: StatProgress[];
  top_skills: TopSkill[];
  gear_changes: number;
  motivational_quote: string;
  created_at: string;
}
