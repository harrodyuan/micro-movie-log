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
    description: "Love it in Dolby Cinema, the color is so nice."
  },
  {
    rank: 2,
    title: "Hamnet",
    year: "2025",
    posterUrl: "/top10/2_Hamnet.png",
    description: "Chloé Zhao is a genius."
  },
  {
    rank: 3,
    title: "One Battle After Another",
    year: "2025",
    posterUrl: "/top10/3_OneBattleAfterAnother.png",
    description: "Watched in IMAX 70mm, can't forget Leo's face in Lincoln Center big-ass IMAX 70mm screen."
  },
  {
    rank: 4,
    title: "Back to the Future (40th Anniversary)",
    year: "1985/2025",
    posterUrl: "/top10/4_BackToTheFuture.png",
    description: "I watched it twice."
  },
  {
    rank: 5,
    title: "Roofman",
    year: "2025",
    posterUrl: "/top10/5_Roofman.png",
    description: "I watched it twice. Very soft, very touchy, very cute, a decently profound story but every story is profound if you really think about them."
  },
  {
    rank: 6,
    title: "Apollo 13: 30th Anniversary",
    year: "1995/2025",
    posterUrl: "/top10/6_Apollo13.png",
    description: "Happy to watch in IMAX again in theater. Good movie for a big IMAX screen."
  },
  {
    rank: 7,
    title: "Brokeback Mountain: 20th Anniversary",
    year: "2005/2025",
    posterUrl: "/top10/7_BrokebackMountain.png",
    description: "I do not know why I did not find a chance to watch it all the time but I am glad that I did, and on big screen as well. I love it a lot. It is a great story. Great acting. Great camera. I really want to talk to Ang Lee one day about sex. He seems to have such diverse knowledge about sex and all kinds."
  },
  {
    rank: 8,
    title: "Sinners",
    year: "2025",
    posterUrl: "/top10/8_Sinners.png",
    description: "IMAX 70MM again in Lincoln Center. There were some switch between 70mm and normal ratio from time to time. Great work out, Michael B Jordan!"
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
