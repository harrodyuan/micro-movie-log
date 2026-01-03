const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Top 100 viral YouTube Shorts - curated list of globally famous viral shorts
const TOP_VIRAL_SHORTS = [
  { youtubeId: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channelTitle: "MrBeast" },
  { youtubeId: "hGPCE0WWZjE", title: "World's Largest Jello Pool", channelTitle: "MrBeast" },
  { youtubeId: "TQHEJj68Jew", title: "I Built Willy Wonka's Chocolate Factory!", channelTitle: "MrBeast" },
  { youtubeId: "so3a9XPzJvs", title: "I Spent 50 Hours In My Front Yard", channelTitle: "MrBeast" },
  { youtubeId: "j6nTfB2BTcU", title: "Ages 1 - 100 Decide Who Wins $250,000", channelTitle: "MrBeast" },
  { youtubeId: "9bqk6ZUsKyA", title: "Would You Swim With Sharks For $100,000?", channelTitle: "MrBeast" },
  { youtubeId: "lYX3Gk79-R4", title: "Khaby fixes life hacks", channelTitle: "Khaby Lame" },
  { youtubeId: "PJkMWiJAyP0", title: "Simple Life Hack", channelTitle: "Khaby Lame" },
  { youtubeId: "iW1Nff6jgjo", title: "Unnecessary life hack reaction", channelTitle: "Khaby Lame" },
  { youtubeId: "cC-hfKs5txE", title: "Magic disappearing act", channelTitle: "Zach King" },
  { youtubeId: "z0CCtP58EJg", title: "Cake or Real?", channelTitle: "Zach King" },
  { youtubeId: "EYYjfHfzTrY", title: "Harry Potter Magic", channelTitle: "Zach King" },
  { youtubeId: "_HGmA9LdAck", title: "Ping Pong Trick Shots", channelTitle: "Dude Perfect" },
  { youtubeId: "EQ_HhYPZjGE", title: "Water Bottle Flip Edition", channelTitle: "Dude Perfect" },
  { youtubeId: "M1F0lBnsnkE", title: "World Record Edition", channelTitle: "Dude Perfect" },
  { youtubeId: "LPDn0PC5xB0", title: "Experiment: Coca Cola vs Mentos", channelTitle: "MrBeast" },
  { youtubeId: "duWTfl4MJ1c", title: "Satisfying Slime ASMR", channelTitle: "Oddly Satisfying" },
  { youtubeId: "JXgCfIi2HEk", title: "Amazing Street Food", channelTitle: "Food Insider" },
  { youtubeId: "VYOjWnS4cMY", title: "Crazy Pool Trick Shots", channelTitle: "Dude Perfect" },
  { youtubeId: "TkfDvL5x23g", title: "Pets Being Derpy", channelTitle: "Funny Animals" },
  { youtubeId: "lm0N_dE2Dy0", title: "Baby Reaction Videos", channelTitle: "AFV" },
  { youtubeId: "G7RgN9ijwE4", title: "Instant Karma Compilation", channelTitle: "Daily Dose" },
  { youtubeId: "WooPfpnLzAI", title: "Cat vs Cucumber", channelTitle: "Funny Pets" },
  { youtubeId: "t3NOYMzVC3s", title: "Prank Gone Wrong", channelTitle: "Just For Laughs" },
  { youtubeId: "H0ND1MTgp1Q", title: "Cake Decorating Hacks", channelTitle: "5-Minute Crafts" },
  { youtubeId: "9Deg7VrpHbM", title: "Money Heist Challenge", channelTitle: "TikTok Compilations" },
  { youtubeId: "RubBzkZzpUA", title: "Insane Basketball Shots", channelTitle: "Sports Center" },
  { youtubeId: "OhU_u4rq1Tg", title: "Dance Challenge Gone Viral", channelTitle: "Dance Fever" },
  { youtubeId: "3GwjfUFyY6M", title: "Puppy's First Snow", channelTitle: "The Dodo" },
  { youtubeId: "jNQXAC9IVRw", title: "Me at the zoo", channelTitle: "jawed" },
  { youtubeId: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You", channelTitle: "Ed Sheeran" },
  { youtubeId: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito", channelTitle: "Luis Fonsi" },
  { youtubeId: "9bZkp7q19f0", title: "PSY - Gangnam Style", channelTitle: "PSY" },
  { youtubeId: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again", channelTitle: "Wiz Khalifa" },
  { youtubeId: "fLexgOxsZu0", title: "Taylor Swift - Blank Space", channelTitle: "Taylor Swift" },
  { youtubeId: "OPf0YbXqDm0", title: "Mark Ronson - Uptown Funk", channelTitle: "Mark Ronson" },
  { youtubeId: "CevxZvSJLk8", title: "Katy Perry - Roar", channelTitle: "Katy Perry" },
  { youtubeId: "2Vv-BfVoq4g", title: "Perfect - Ed Sheeran", channelTitle: "Ed Sheeran" },
  { youtubeId: "JRfuAukYTKg", title: "Thinking Out Loud", channelTitle: "Ed Sheeran" },
  { youtubeId: "hT_nvWreIhg", title: "Counting Stars - OneRepublic", channelTitle: "OneRepublic" },
  { youtubeId: "YqeW9_5kURI", title: "All of Me - John Legend", channelTitle: "John Legend" },
  { youtubeId: "09R8_2nJtjg", title: "Maroon 5 - Sugar", channelTitle: "Maroon 5" },
  { youtubeId: "nfWlot6h_JM", title: "Tyler the Creator - See You Again", channelTitle: "Tyler the Creator" },
  { youtubeId: "60ItHLz5WEA", title: "Alan Walker - Faded", channelTitle: "Alan Walker" },
  { youtubeId: "pRpeEdMmmQ0", title: "Shakira - Waka Waka", channelTitle: "Shakira" },
  { youtubeId: "RBumgq5yVrA", title: "Passenger - Let Her Go", channelTitle: "Passenger" },
  { youtubeId: "YBHQbu5rbdQ", title: "LMFAO - Party Rock Anthem", channelTitle: "LMFAO" },
  { youtubeId: "QYh6mYIJG2Y", title: "Adele - Rolling in the Deep", channelTitle: "Adele" },
  { youtubeId: "7PCkvCPvDXk", title: "Sia - Chandelier", channelTitle: "Sia" },
  { youtubeId: "e-ORhEE9VVg", title: "Taylor Swift - Blank Space", channelTitle: "Taylor Swift" },
  { youtubeId: "lWA2pjMjpBs", title: "Rihanna - Diamonds", channelTitle: "Rihanna" },
  { youtubeId: "nSDgHBxUbVQ", title: "Avicii - Wake Me Up", channelTitle: "Avicii" },
  { youtubeId: "ru0K8uYEZWw", title: "Clean Bandit - Rather Be", channelTitle: "Clean Bandit" },
  { youtubeId: "1k8craCGpgs", title: "DJ Snake - Turn Down for What", channelTitle: "DJ Snake" },
  { youtubeId: "HP-MbfHFUqs", title: "Ariana Grande - 7 Rings", channelTitle: "Ariana Grande" },
  { youtubeId: "k2qgadSvNyU", title: "The Weeknd - Starboy", channelTitle: "The Weeknd" },
  { youtubeId: "fRh_vgS2dFE", title: "Justin Bieber - Sorry", channelTitle: "Justin Bieber" },
  { youtubeId: "IcrbM1l_BoI", title: "Cardi B - Bodak Yellow", channelTitle: "Cardi B" },
  { youtubeId: "DyDfgMOUjCI", title: "Billie Eilish - Bad Guy", channelTitle: "Billie Eilish" },
  { youtubeId: "papuvlVeZg8", title: "The Chainsmokers - Closer", channelTitle: "The Chainsmokers" },
  { youtubeId: "JGwWNGJdvx8", title: "Shape of You", channelTitle: "Ed Sheeran" },
  { youtubeId: "o_v9MY_FMcw", title: "FIFA World Cup Goals", channelTitle: "FIFA" },
  { youtubeId: "8ELbX5CMomE", title: "NBA Top 10 Plays", channelTitle: "NBA" },
  { youtubeId: "6Zbi0XmGtMw", title: "Epic Fail Compilation", channelTitle: "FailArmy" },
  { youtubeId: "BkN4iaZTqfM", title: "Skibidi bop bop", channelTitle: "Little Big" },
  { youtubeId: "Zi_XLOBDo_Y", title: "Billie Eilish - Lovely", channelTitle: "Billie Eilish" },
  { youtubeId: "JQbjS0_ZfJ0", title: "Coldplay - Adventure of a Lifetime", channelTitle: "Coldplay" },
  { youtubeId: "HyHNuVaZJ-k", title: "Gotye - Somebody That I Used to Know", channelTitle: "Gotye" },
  { youtubeId: "KQ6zr6kCPj8", title: "LMFAO - Sexy and I Know It", channelTitle: "LMFAO" },
  { youtubeId: "WA4iX5D9Z64", title: "Twenty One Pilots - Stressed Out", channelTitle: "Twenty One Pilots" },
  { youtubeId: "pt8VYOfr8To", title: "Crazy Makeup Transformation", channelTitle: "Makeup Artists" },
  { youtubeId: "huTfkMvPYew", title: "Instant Noodle Hacks", channelTitle: "Food Hacks" },
  { youtubeId: "gBAfejjUQoA", title: "Satisfying Kinetic Sand", channelTitle: "ASMR Satisfying" },
  { youtubeId: "K-x1LVYpOxo", title: "Domino Effect Amazing", channelTitle: "Hevesh5" },
  { youtubeId: "mWRsgZuwf_8", title: "Rube Goldberg Machine", channelTitle: "Joseph's Machines" },
  { youtubeId: "VGjY5SsOHoM", title: "Dog Reacts to Magic", channelTitle: "Jose Ahonen" },
  { youtubeId: "DZPLNKyKZ00", title: "Parkour POV Chase", channelTitle: "Storror" },
  { youtubeId: "dhYaX01NOfA", title: "Beatbox Champion", channelTitle: "Beatbox International" },
  { youtubeId: "bHLR3faI7lU", title: "Anime vs Reality", channelTitle: "RDCWorld1" },
  { youtubeId: "uWu4aynBK7E", title: "Speed Cubing World Record", channelTitle: "SpeedCubers" },
  { youtubeId: "FRgfAPe5s3U", title: "Drawing Challenge in 10 Seconds", channelTitle: "Art Challenge" },
  { youtubeId: "OpQFFLBMEPI", title: "Insane Card Throwing", channelTitle: "Rick Smith Jr" },
  { youtubeId: "5qap5aO4i9A", title: "Lofi Hip Hop Radio", channelTitle: "Lofi Girl" },
  { youtubeId: "EEYwgCvACQw", title: "Coldplay - Hymn For The Weekend", channelTitle: "Coldplay" },
  { youtubeId: "iPUmE-tne5U", title: "Imagine Dragons - Believer", channelTitle: "Imagine Dragons" },
  { youtubeId: "KDCHSyfmE_w", title: "Panic! At The Disco", channelTitle: "Panic! At The Disco" },
  { youtubeId: "FM7MFYoylVs", title: "The Weeknd - Blinding Lights", channelTitle: "The Weeknd" },
  { youtubeId: "N5qWjQ9j6l0", title: "One Direction - Drag Me Down", channelTitle: "One Direction" },
  { youtubeId: "TUVcZfQe-Kw", title: "BTS - Dynamite", channelTitle: "BTS" },
  { youtubeId: "gdZLi9oWNZg", title: "BTS - Butter", channelTitle: "BTS" },
  { youtubeId: "9PDnNqziPvQ", title: "BLACKPINK - DDU-DU DDU-DU", channelTitle: "BLACKPINK" },
  { youtubeId: "CKZvWhCqx1s", title: "BLACKPINK - Kill This Love", channelTitle: "BLACKPINK" },
  { youtubeId: "mRD0-GxqHVo", title: "BTS - Boy With Luv", channelTitle: "BTS" },
  { youtubeId: "gCYcHz2k5x0", title: "Maroon 5 - Animals", channelTitle: "Maroon 5" },
  { youtubeId: "lp-EO5I60KA", title: "Eminem - Lose Yourself", channelTitle: "Eminem" },
  { youtubeId: "RBumgq5yVrA", title: "Let Her Go", channelTitle: "Passenger" },
];

async function main() {
  console.log('Seeding viral shorts...\n');
  
  let count = 0;
  
  for (const short of TOP_VIRAL_SHORTS) {
    try {
      await prisma.video.upsert({
        where: { youtubeId: short.youtubeId },
        update: {
          title: short.title,
          channelTitle: short.channelTitle,
        },
        create: {
          youtubeId: short.youtubeId,
          title: short.title,
          channelTitle: short.channelTitle,
          thumbnailUrl: `https://i.ytimg.com/vi/${short.youtubeId}/oar2.jpg`,
        },
      });
      console.log(`✓ ${short.title}`);
      count++;
    } catch (e) {
      console.error(`✗ Failed: ${short.title}`, e.message);
    }
  }
  
  console.log(`\n========================================`);
  console.log(`Done! Seeded ${count} shorts`);
  console.log(`========================================`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
