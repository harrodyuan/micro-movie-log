export interface TopMovie {
  rank: number;
  title: string;
  posterUrl: string;
  description: string;
  year: string;
}

export const top10Movies: TopMovie[] = [
  {
    rank: 1,
    title: "Zootopia 2",
    year: "2025",
    posterUrl: "/top10/1_Zootopia2.jpg",
    description: "A massive Disney sequel that just hit theaters. The visual storytelling and expansion of the world make it a standout animation achievement."
  },
  {
    rank: 2,
    title: "Hamnet",
    year: "2025",
    posterUrl: "/top10/2_Hamnet.png",
    description: "Chloé Zhao's historical drama starring Paul Mescal. A top Oscar contender with breathtaking cinematography."
  },
  {
    rank: 3,
    title: "One Battle After Another",
    year: "2025",
    posterUrl: "/top10/3_OneBattleAfterAnother.png",
    description: "The new Paul Thomas Anderson film starring Leonardo DiCaprio. A visual masterpiece that demands to be seen on 70mm."
  },
  {
    rank: 4,
    title: "Back to the Future (40th Anniversary)",
    year: "1985/2025",
    posterUrl: "/top10/4_BackToTheFuture.png",
    description: "Seeing this classic on the big screen for its 40th anniversary proved why it remains the perfect blockbuster screenplay."
  },
  {
    rank: 5,
    title: "Roofman",
    year: "2025",
    posterUrl: "/top10/5_Roofman.png",
    description: "Channing Tatum's true-crime drama from director Derek Cianfrance. A gritty, grounded performance."
  },
  {
    rank: 6,
    title: "Apollo 13: 30th Anniversary",
    year: "1995/2025",
    posterUrl: "/top10/6_Apollo13.png",
    description: "The tension holds up incredible well 30 years later. A masterclass in procedural space drama."
  },
  {
    rank: 7,
    title: "Brokeback Mountain: 20th Anniversary",
    year: "2005/2025",
    posterUrl: "/top10/7_BrokebackMountain.png",
    description: "Returning to theaters, this heartbreaking romance remains a landmark film. Ledger and Gyllenhaal's performances are timeless."
  },
  {
    rank: 8,
    title: "Sinners",
    year: "2025",
    posterUrl: "/top10/8_Sinners.png",
    description: "Ryan Coogler’s vampire horror hit. The theater energy was unmatched for this one."
  },
  {
    rank: 9,
    title: "I'm Still Here",
    year: "2024",
    posterUrl: "/top10/9_ImStillHere.png",
    description: "Brazil’s powerhouse political thriller. A festival favorite that delivers an emotional punch."
  },
  {
    rank: 10,
    title: "Weapons",
    year: "2025",
    posterUrl: "/top10/10_Weapons.png",
    description: "Zach Cregger’s highly anticipated horror follow-up to Barbarian. Unpredictable and intense."
  }
];
