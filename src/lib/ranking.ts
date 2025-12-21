export interface RankedItem {
  id: string;
  elo: number; // The "score" (e.g., 1200)
  matches: number; // How many battles it has fought
}

// K-Factor determines how much a rating changes after one match.
// 32 is standard for chess. 
// We might want higher (e.g., 40) to make the movie list feel more dynamic initially.
const K_FACTOR = 40;

/**
 * Calculates the expected probability of player A winning against player B.
 * Returns a number between 0 and 1.
 */
function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Updates the ratings of two movies after a "battle".
 * @param winner The movie object that won
 * @param loser The movie object that lost
 * @returns [updatedWinner, updatedLoser]
 */
export function calculateNewRatings(
  winner: RankedItem,
  loser: RankedItem
): [RankedItem, RankedItem] {
  const expectedWinner = getExpectedScore(winner.elo, loser.elo);
  const expectedLoser = getExpectedScore(loser.elo, winner.elo);

  // Elo Formula: R_new = R_old + K * (Actual - Expected)
  // Actual score is 1 for winner, 0 for loser.
  
  const newWinnerElo = winner.elo + K_FACTOR * (1 - expectedWinner);
  const newLoserElo = loser.elo + K_FACTOR * (0 - expectedLoser);

  return [
    { ...winner, elo: Math.round(newWinnerElo), matches: winner.matches + 1 },
    { ...loser, elo: Math.round(newLoserElo), matches: loser.matches + 1 },
  ];
}

/**
 * Initializes a movie with a default rating if it doesn't have one.
 * 1200 is the standard starting ELO.
 */
export function initializeRating(id: string): RankedItem {
  return {
    id,
    elo: 1200,
    matches: 0,
  };
}
