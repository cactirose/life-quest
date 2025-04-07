interface DailyBonus {
  xpBonus: number;
  coinBonus: number;
}

/**
 * Calculates the daily login bonus based on the current streak
 * @param streak Current login streak
 * @returns Object containing XP and coin bonuses
 */
export const calculateDailyBonus = (streak: number): DailyBonus => {
  // Base rewards
  let xpBonus = 50;
  let coinBonus = 25;

  // Bonus multiplier based on streak
  const multiplier = Math.min(3, 1 + (streak * 0.1)); // Cap at 3x bonus

  // Apply multiplier and round to nearest integer
  xpBonus = Math.round(xpBonus * multiplier);
  coinBonus = Math.round(coinBonus * multiplier);

  // Extra bonus for milestone streaks (7, 14, 21, etc.)
  if (streak % 7 === 0) {
    xpBonus *= 2;
    coinBonus *= 2;
  }

  return {
    xpBonus,
    coinBonus
  };
}; 