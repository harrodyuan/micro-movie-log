const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Douban Top 250 movies - curated list
const DOUBAN_TOP_250 = [
  { title: "肖申克的救赎", englishTitle: "The Shawshank Redemption", year: 1994 },
  { title: "霸王别姬", englishTitle: "Farewell My Concubine", year: 1993 },
  { title: "阿甘正传", englishTitle: "Forrest Gump", year: 1994 },
  { title: "泰坦尼克号", englishTitle: "Titanic", year: 1997 },
  { title: "这个杀手不太冷", englishTitle: "Leon: The Professional", year: 1994 },
  { title: "千与千寻", englishTitle: "Spirited Away", year: 2001 },
  { title: "美丽人生", englishTitle: "Life Is Beautiful", year: 1997 },
  { title: "辛德勒的名单", englishTitle: "Schindler's List", year: 1993 },
  { title: "盗梦空间", englishTitle: "Inception", year: 2010 },
  { title: "忠犬八公的故事", englishTitle: "Hachi: A Dog's Tale", year: 2009 },
  { title: "星际穿越", englishTitle: "Interstellar", year: 2014 },
  { title: "楚门的世界", englishTitle: "The Truman Show", year: 1998 },
  { title: "海上钢琴师", englishTitle: "The Legend of 1900", year: 1998 },
  { title: "三傻大闹宝莱坞", englishTitle: "3 Idiots", year: 2009 },
  { title: "机器人总动员", englishTitle: "WALL·E", year: 2008 },
  { title: "放牛班的春天", englishTitle: "The Chorus", year: 2004 },
  { title: "大话西游之大圣娶亲", englishTitle: "A Chinese Odyssey Part Two: Cinderella", year: 1995 },
  { title: "无间道", englishTitle: "Infernal Affairs", year: 2002 },
  { title: "疯狂动物城", englishTitle: "Zootopia", year: 2016 },
  { title: "龙猫", englishTitle: "My Neighbor Totoro", year: 1988 },
  { title: "教父", englishTitle: "The Godfather", year: 1972 },
  { title: "当幸福来敲门", englishTitle: "The Pursuit of Happyness", year: 2006 },
  { title: "怦然心动", englishTitle: "Flipped", year: 2010 },
  { title: "触不可及", englishTitle: "The Intouchables", year: 2011 },
  { title: "蝙蝠侠：黑暗骑士", englishTitle: "The Dark Knight", year: 2008 },
  { title: "控方证人", englishTitle: "Witness for the Prosecution", year: 1957 },
  { title: "活着", englishTitle: "To Live", year: 1994 },
  { title: "指环王3：王者无敌", englishTitle: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "末代皇帝", englishTitle: "The Last Emperor", year: 1987 },
  { title: "寻梦环游记", englishTitle: "Coco", year: 2017 },
  { title: "何以为家", englishTitle: "Capernaum", year: 2018 },
  { title: "飞屋环游记", englishTitle: "Up", year: 2009 },
  { title: "熔炉", englishTitle: "Silenced", year: 2011 },
  { title: "摔跤吧！爸爸", englishTitle: "Dangal", year: 2016 },
  { title: "十二怒汉", englishTitle: "12 Angry Men", year: 1957 },
  { title: "天空之城", englishTitle: "Castle in the Sky", year: 1986 },
  { title: "少年派的奇幻漂流", englishTitle: "Life of Pi", year: 2012 },
  { title: "鬼子来了", englishTitle: "Devils on the Doorstep", year: 2000 },
  { title: "大话西游之月光宝盒", englishTitle: "A Chinese Odyssey Part One: Pandora's Box", year: 1995 },
  { title: "素媛", englishTitle: "Hope", year: 2013 },
  { title: "指环王2：双塔奇兵", englishTitle: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "指环王1：魔戒再现", englishTitle: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "哈尔的移动城堡", englishTitle: "Howl's Moving Castle", year: 2004 },
  { title: "天堂电影院", englishTitle: "Cinema Paradiso", year: 1988 },
  { title: "罗马假日", englishTitle: "Roman Holiday", year: 1953 },
  { title: "闻香识女人", englishTitle: "Scent of a Woman", year: 1992 },
  { title: "辩护人", englishTitle: "The Attorney", year: 2013 },
  { title: "搏击俱乐部", englishTitle: "Fight Club", year: 1999 },
  { title: "死亡诗社", englishTitle: "Dead Poets Society", year: 1989 },
  { title: "窃听风暴", englishTitle: "The Lives of Others", year: 2006 },
  { title: "教父2", englishTitle: "The Godfather Part II", year: 1974 },
  { title: "杀人回忆", englishTitle: "Memories of Murder", year: 2003 },
  { title: "狮子王", englishTitle: "The Lion King", year: 1994 },
  { title: "被嫌弃的松子的一生", englishTitle: "Memories of Matsuko", year: 2006 },
  { title: "V字仇杀队", englishTitle: "V for Vendetta", year: 2005 },
  { title: "两杆大烟枪", englishTitle: "Lock, Stock and Two Smoking Barrels", year: 1998 },
  { title: "美丽心灵", englishTitle: "A Beautiful Mind", year: 2001 },
  { title: "饮食男女", englishTitle: "Eat Drink Man Woman", year: 1994 },
  { title: "钢琴家", englishTitle: "The Pianist", year: 2002 },
  { title: "本杰明·巴顿奇事", englishTitle: "The Curious Case of Benjamin Button", year: 2008 },
  { title: "看不见的客人", englishTitle: "The Invisible Guest", year: 2016 },
  { title: "让子弹飞", englishTitle: "Let the Bullets Fly", year: 2010 },
  { title: "黑客帝国", englishTitle: "The Matrix", year: 1999 },
  { title: "穿条纹睡衣的男孩", englishTitle: "The Boy in the Striped Pajamas", year: 2008 },
  { title: "西西里的美丽传说", englishTitle: "Malèna", year: 2000 },
  { title: "音乐之声", englishTitle: "The Sound of Music", year: 1965 },
  { title: "拯救大兵瑞恩", englishTitle: "Saving Private Ryan", year: 1998 },
  { title: "情书", englishTitle: "Love Letter", year: 1995 },
  { title: "心灵捕手", englishTitle: "Good Will Hunting", year: 1997 },
  { title: "海蒂和爷爷", englishTitle: "Heidi", year: 2015 },
  { title: "剪刀手爱德华", englishTitle: "Edward Scissorhands", year: 1990 },
  { title: "低俗小说", englishTitle: "Pulp Fiction", year: 1994 },
  { title: "沉默的羔羊", englishTitle: "The Silence of the Lambs", year: 1991 },
  { title: "禁闭岛", englishTitle: "Shutter Island", year: 2010 },
  { title: "布达佩斯大饭店", englishTitle: "The Grand Budapest Hotel", year: 2014 },
  { title: "蝴蝶效应", englishTitle: "The Butterfly Effect", year: 2004 },
  { title: "春光乍泄", englishTitle: "Happy Together", year: 1997 },
  { title: "绿皮书", englishTitle: "Green Book", year: 2018 },
  { title: "穿越时空的少女", englishTitle: "The Girl Who Leapt Through Time", year: 2006 },
  { title: "第六感", englishTitle: "The Sixth Sense", year: 1999 },
  { title: "红辣椒", englishTitle: "Paprika", year: 2006 },
  { title: "致命魔术", englishTitle: "The Prestige", year: 2006 },
  { title: "心迷宫", englishTitle: "The Coffin in the Mountain", year: 2014 },
  { title: "玛丽和马克思", englishTitle: "Mary and Max", year: 2009 },
  { title: "阿凡达", englishTitle: "Avatar", year: 2009 },
  { title: "一一", englishTitle: "Yi Yi", year: 2000 },
  { title: "超脱", englishTitle: "Detachment", year: 2011 },
  { title: "摩登时代", englishTitle: "Modern Times", year: 1936 },
  { title: "爱在黎明破晓前", englishTitle: "Before Sunrise", year: 1995 },
  { title: "喜剧之王", englishTitle: "King of Comedy", year: 1999 },
  { title: "加勒比海盗", englishTitle: "Pirates of the Caribbean: The Curse of the Black Pearl", year: 2003 },
  { title: "阳光灿烂的日子", englishTitle: "In the Heat of the Sun", year: 1994 },
  { title: "入殓师", englishTitle: "Departures", year: 2008 },
  { title: "重庆森林", englishTitle: "Chungking Express", year: 1994 },
  { title: "消失的爱人", englishTitle: "Gone Girl", year: 2014 },
  { title: "玩具总动员3", englishTitle: "Toy Story 3", year: 2010 },
  { title: "告白", englishTitle: "Confessions", year: 2010 },
  { title: "甜蜜蜜", englishTitle: "Comrades: Almost a Love Story", year: 1996 },
  { title: "驴得水", englishTitle: "Mr. Donkey", year: 2016 },
  { title: "七宗罪", englishTitle: "Se7en", year: 1995 },
  { title: "爱在日落黄昏时", englishTitle: "Before Sunset", year: 2004 },
  { title: "大鱼", englishTitle: "Big Fish", year: 2003 },
  { title: "杀人犯回忆录", englishTitle: "Memoir of a Murderer", year: 2017 },
  { title: "幽灵公主", englishTitle: "Princess Mononoke", year: 1997 },
  { title: "完美的世界", englishTitle: "A Perfect World", year: 1993 },
  { title: "菊次郎的夏天", englishTitle: "Kikujiro", year: 1999 },
  { title: "燃情岁月", englishTitle: "Legends of the Fall", year: 1994 },
  { title: "超能陆战队", englishTitle: "Big Hero 6", year: 2014 },
  { title: "神偷奶爸", englishTitle: "Despicable Me", year: 2010 },
  { title: "哪吒之魔童降世", englishTitle: "Ne Zha", year: 2019 },
  { title: "怪兽电力公司", englishTitle: "Monsters, Inc.", year: 2001 },
  { title: "血战钢锯岭", englishTitle: "Hacksaw Ridge", year: 2016 },
  { title: "风之谷", englishTitle: "Nausicaä of the Valley of the Wind", year: 1984 },
  { title: "荒蛮故事", englishTitle: "Wild Tales", year: 2014 },
  { title: "爆裂鼓手", englishTitle: "Whiplash", year: 2014 },
  { title: "恐怖直播", englishTitle: "The Terror Live", year: 2013 },
  { title: "金刚狼3：殊死一战", englishTitle: "Logan", year: 2017 },
  { title: "天使爱美丽", englishTitle: "Amélie", year: 2001 },
  { title: "疯狂的石头", englishTitle: "Crazy Stone", year: 2006 },
  { title: "断背山", englishTitle: "Brokeback Mountain", year: 2005 },
  { title: "功夫", englishTitle: "Kung Fu Hustle", year: 2004 },
  { title: "荒野生存", englishTitle: "Into the Wild", year: 2007 },
  { title: "杀死比尔", englishTitle: "Kill Bill: Vol. 1", year: 2003 },
  { title: "你的名字", englishTitle: "Your Name", year: 2016 },
  { title: "谍影重重", englishTitle: "The Bourne Identity", year: 2002 },
  { title: "无人知晓", englishTitle: "Nobody Knows", year: 2004 },
  { title: "海边的曼彻斯特", englishTitle: "Manchester by the Sea", year: 2016 },
  { title: "疯狂原始人", englishTitle: "The Croods", year: 2013 },
  { title: "头号玩家", englishTitle: "Ready Player One", year: 2018 },
  { title: "我是山姆", englishTitle: "I Am Sam", year: 2001 },
  { title: "房间", englishTitle: "Room", year: 2015 },
  { title: "蝙蝠侠：黑暗骑士崛起", englishTitle: "The Dark Knight Rises", year: 2012 },
  { title: "恋恋笔记本", englishTitle: "The Notebook", year: 2004 },
  { title: "冰川时代", englishTitle: "Ice Age", year: 2002 },
  { title: "变脸", englishTitle: "Face/Off", year: 1997 },
  { title: "七武士", englishTitle: "Seven Samurai", year: 1954 },
  { title: "小森林 夏秋篇", englishTitle: "Little Forest: Summer/Autumn", year: 2014 },
  { title: "雨人", englishTitle: "Rain Man", year: 1988 },
  { title: "夏洛特烦恼", englishTitle: "Goodbye Mr. Loser", year: 2015 },
  { title: "人工智能", englishTitle: "A.I. Artificial Intelligence", year: 2001 },
  { title: "头脑特工队", englishTitle: "Inside Out", year: 2015 },
  { title: "花样年华", englishTitle: "In the Mood for Love", year: 2000 },
  { title: "小鞋子", englishTitle: "Children of Heaven", year: 1997 },
  { title: "恐怖游轮", englishTitle: "Triangle", year: 2009 },
  { title: "傲慢与偏见", englishTitle: "Pride & Prejudice", year: 2005 },
  { title: "冰雪奇缘", englishTitle: "Frozen", year: 2013 },
  { title: "雨中曲", englishTitle: "Singin' in the Rain", year: 1952 },
  { title: "我不是药神", englishTitle: "Dying to Survive", year: 2018 },
  { title: "秒速5厘米", englishTitle: "5 Centimeters per Second", year: 2007 },
  { title: "借东西的小人阿莉埃蒂", englishTitle: "The Secret World of Arrietty", year: 2010 },
  { title: "无敌破坏王", englishTitle: "Wreck-It Ralph", year: 2012 },
  { title: "心灵奇旅", englishTitle: "Soul", year: 2020 },
  { title: "达拉斯买家俱乐部", englishTitle: "Dallas Buyers Club", year: 2013 },
  { title: "小萝莉的猴神大叔", englishTitle: "Bajrangi Bhaijaan", year: 2015 },
  { title: "一个叫欧维的男人决定去死", englishTitle: "A Man Called Ove", year: 2015 },
  { title: "非常嫌疑犯", englishTitle: "The Usual Suspects", year: 1995 },
  { title: "超级陆战队", englishTitle: "Big Hero 6", year: 2014 },
  { title: "卢旺达饭店", englishTitle: "Hotel Rwanda", year: 2004 },
  { title: "一次别离", englishTitle: "A Separation", year: 2011 },
  { title: "勇敢的心", englishTitle: "Braveheart", year: 1995 },
  { title: "永恒和一日", englishTitle: "Eternity and a Day", year: 1998 },
  { title: "牯岭街少年杀人事件", englishTitle: "A Brighter Summer Day", year: 1991 },
  { title: "模仿游戏", englishTitle: "The Imitation Game", year: 2014 },
  { title: "侧耳倾听", englishTitle: "Whisper of the Heart", year: 1995 },
  { title: "小偷家族", englishTitle: "Shoplifters", year: 2018 },
  { title: "黑天鹅", englishTitle: "Black Swan", year: 2010 },
  { title: "惊魂记", englishTitle: "Psycho", year: 1960 },
  { title: "玩具总动员", englishTitle: "Toy Story", year: 1995 },
  { title: "岁月神偷", englishTitle: "Echoes of the Rainbow", year: 2010 },
  { title: "阳光姐妹淘", englishTitle: "Sunny", year: 2011 },
  { title: "萤火之森", englishTitle: "Into the Forest of Fireflies' Light", year: 2011 },
  { title: "色戒", englishTitle: "Lust, Caution", year: 2007 },
  { title: "喜宴", englishTitle: "The Wedding Banquet", year: 1993 },
  { title: "三块广告牌", englishTitle: "Three Billboards Outside Ebbing, Missouri", year: 2017 },
  { title: "无耻混蛋", englishTitle: "Inglourious Basterds", year: 2009 },
  { title: "逃离德黑兰", englishTitle: "Argo", year: 2012 },
  { title: "被解救的姜戈", englishTitle: "Django Unchained", year: 2012 },
  { title: "背靠背，脸对脸", englishTitle: "Back to Back, Face to Face", year: 1994 },
  { title: "钢铁侠", englishTitle: "Iron Man", year: 2008 },
  { title: "青蛇", englishTitle: "Green Snake", year: 1993 },
  { title: "寄生虫", englishTitle: "Parasite", year: 2019 },
  { title: "小妇人", englishTitle: "Little Women", year: 2019 },
  { title: "速度与激情5", englishTitle: "Fast Five", year: 2011 },
  { title: "奇迹男孩", englishTitle: "Wonder", year: 2017 },
  { title: "罗生门", englishTitle: "Rashomon", year: 1950 },
  { title: "浪潮", englishTitle: "The Wave", year: 2008 },
  { title: "海洋", englishTitle: "Oceans", year: 2009 },
  { title: "东邪西毒", englishTitle: "Ashes of Time", year: 1994 },
  { title: "唐伯虎点秋香", englishTitle: "Flirting Scholar", year: 1993 },
  { title: "2001太空漫游", englishTitle: "2001: A Space Odyssey", year: 1968 },
  { title: "地球上的星星", englishTitle: "Taare Zameen Par", year: 2007 },
  { title: "终结者2：审判日", englishTitle: "Terminator 2: Judgment Day", year: 1991 },
  { title: "枪火", englishTitle: "The Mission", year: 1999 },
  { title: "电锯惊魂", englishTitle: "Saw", year: 2004 },
  { title: "天书奇谭", englishTitle: "Erta of Heaven", year: 1983 },
  { title: "侏罗纪公园", englishTitle: "Jurassic Park", year: 1993 },
  { title: "迁徙的鸟", englishTitle: "Winged Migration", year: 2001 },
  { title: "玩具总动员4", englishTitle: "Toy Story 4", year: 2019 },
  { title: "射雕英雄传之东成西就", englishTitle: "The Eagle Shooting Heroes", year: 1993 },
  { title: "小王子", englishTitle: "The Little Prince", year: 2015 },
  { title: "爱乐之城", englishTitle: "La La Land", year: 2016 },
  { title: "釜山行", englishTitle: "Train to Busan", year: 2016 },
  { title: "至暗时刻", englishTitle: "Darkest Hour", year: 2017 },
  { title: "大佛普拉斯", englishTitle: "The Great Buddha+", year: 2017 },
  { title: "追随", englishTitle: "Following", year: 1998 },
  { title: "源代码", englishTitle: "Source Code", year: 2011 },
  { title: "奥本海默", englishTitle: "Oppenheimer", year: 2023 },
  { title: "芭比", englishTitle: "Barbie", year: 2023 },
];

async function searchTMDB(title, year) {
  if (!TMDB_API_KEY) return null;
  
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      year: year.toString(),
    });
    
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;
    }
  } catch (e) {
    console.error(`TMDB search failed for ${title}:`, e.message);
  }
  return null;
}

async function main() {
  console.log('Adding Douban Top 250 movies...\n');
  
  // Create or get the douban_top250 user
  let user = await prisma.user.findUnique({
    where: { username: 'douban_top250' }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'douban_top250',
        bio: '豆瓣电影Top250 - Douban Movie Top 250'
      }
    });
    console.log('Created user: douban_top250\n');
  }
  
  let added = 0;
  let skipped = 0;
  
  for (const movie of DOUBAN_TOP_250) {
    // Check if movie already exists for this user
    const existing = await prisma.movie.findFirst({
      where: {
        userId: user.id,
        title: movie.title
      }
    });
    
    if (existing) {
      skipped++;
      continue;
    }
    
    // Search TMDB for poster (use English title for better results)
    const posterUrl = await searchTMDB(movie.englishTitle, movie.year);
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await prisma.movie.create({
      data: {
        title: movie.title,
        date: `${movie.year}-01-01`,
        rating: 5,
        posterUrl,
        userId: user.id,
        review: movie.englishTitle // Store English title in review for reference
      }
    });
    
    console.log(`✓ Added: ${movie.title} (${movie.englishTitle}, ${movie.year})`);
    added++;
  }
  
  console.log(`\n========================================`);
  console.log(`Done! Added: ${added}, Skipped: ${skipped}`);
  console.log(`========================================`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
