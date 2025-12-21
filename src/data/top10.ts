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
    posterUrl: "/posters/Zootopia_2.jpg",
    description: "A massive Disney sequel that just hit theaters. The visual storytelling and expansion of the world make it a standout animation achievement."
  },
  {
    rank: 2,
    title: "Hamnet",
    year: "2025",
    posterUrl: "/posters/Hamnet.jpg",
    description: "Chloé Zhao's historical drama starring Paul Mescal. A top Oscar contender with breathtaking cinematography."
  },
  {
    rank: 3,
    title: "One Battle After Another",
    year: "2025",
    posterUrl: "/posters/One_Battle_After_Another.jpg",
    description: "The new Paul Thomas Anderson film starring Leonardo DiCaprio. A visual masterpiece that demands to be seen on 70mm."
  },
  {
    rank: 4,
    title: "Back to the Future (40th Anniversary)",
    year: "1985/2025",
    posterUrl: "/posters/Back_to_the_Future_–_40th_Anniversary.jpg",
    description: "Seeing this classic on the big screen for its 40th anniversary proved why it remains the perfect blockbuster screenplay."
  },
  {
    rank: 5,
    title: "Roofman",
    year: "2025",
    posterUrl: "/posters/Roofman.jpg",
    description: "Channing Tatum's true-crime drama from director Derek Cianfrance. A gritty, grounded performance."
  },
  {
    rank: 6,
    title: "Apollo 13: 30th Anniversary",
    year: "1995/2025",
    posterUrl: "/posters/Apollo_13_30th_Anniversary.jpg",
    description: "The tension holds up incredibly well 30 years later. A masterclass in procedural space drama."
  },
  {
    rank: 7,
    title: "Brokeback Mountain: 20th Anniversary",
    year: "2005/2025",
    posterUrl: "/posters/Brokeback_Mountain_20th_Anniversary.jpg",
    description: "Ang Lee's masterpiece returns to theaters. A devastatingly beautiful look at love and longing that remains essential viewing."
  },
  {
    rank: 8,
    title: "Sinners",
    year: "2025",
    posterUrl: "/posters/Sinners.jpg",
    description: "Ryan Coogler’s vampire horror hit. The theater energy was unmatched for this one."
  },
  {
    rank: 9,
    title: "I'm Still Here",
    year: "2024",
    posterUrl: "/posters/Im_Still_Here.jpg",
    description: "Brazil’s powerhouse political thriller. A festival favorite that delivers an emotional punch."
  },
  {
    rank: 10,
    title: "Weapons",
    year: "2025",
    posterUrl: "/posters/Weapons.jpg",
    description: "Zach Cregger’s highly anticipated horror follow-up to Barbarian. Unpredictable and intense."
  }
];
