export interface Movie {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  rating: number; // 1-5
  review: string; // Max 280 characters
  location?: string;
  posterUrl?: string;
}

export const movies: Movie[] = [
  {
    id: '1',
    date: '2025-12-18',
    title: 'Avatar: Fire and Ash',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Avatar_Fire_and_Ash.jpg'
  },
  {
    id: '2',
    date: '2025-12-16',
    title: 'The Shining 45th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/The_Shining_45th_Anniversary.jpg'
  },
  {
    id: '3',
    date: '2025-12-12',
    title: 'Ella McCay',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Ella_McCay.jpg'
  },
  {
    id: '4',
    date: '2025-12-06',
    title: 'Eternity',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Eternity.jpg'
  },
  {
    id: '5',
    date: '2025-12-02',
    title: 'Zootopia 2',
    rating: 0,
    review: '',
    location: 'AMC 34th Street 14',
    posterUrl: '/posters/Zootopia_2.jpg'
  },
  {
    id: '6',
    date: '2025-11-27',
    title: 'Hamnet',
    rating: 0,
    review: '',
    location: 'AMC Boston Common 19',
    posterUrl: '/posters/Hamnet.jpg'
  },
  {
    id: '7',
    date: '2025-11-25',
    title: 'Zootopia 2',
    rating: 0,
    review: '',
    location: 'AMC 34th Street 14',
    posterUrl: '/posters/Zootopia_2.jpg'
  },
  {
    id: '8',
    date: '2025-11-22',
    title: 'Rental Family',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Rental_Family.jpg'
  },
  {
    id: '9',
    date: '2025-11-18',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/One_Battle_After_Another.jpg'
  },
  {
    id: '10',
    date: '2025-11-17',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '11',
    date: '2025-11-16',
    title: 'Sentimental Value',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13'
  },
  {
    id: '12',
    date: '2025-11-15',
    title: 'The Running Man',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/The_Running_Man.jpg'
  },
  {
    id: '13',
    date: '2025-11-10',
    title: 'Die My Love',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/Die_My_Love.jpg'
  },
  {
    id: '14',
    date: '2025-11-08',
    title: 'Nuremberg',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Nuremberg.jpg'
  },
  {
    id: '15',
    date: '2025-11-02',
    title: 'Back to the Future – 40th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Back_to_the_Future_–_40th_Anniversary.jpg'
  },
  {
    id: '16',
    date: '2025-11-01',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6'
  },
  {
    id: '17',
    date: '2025-10-30',
    title: 'Back to the Future – 40th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '18',
    date: '2025-10-26',
    title: 'Blue Moon',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Blue_Moon.jpg'
  },
  {
    id: '19',
    date: '2025-10-25',
    title: 'Bugonia',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13'
  },
  {
    id: '20',
    date: '2025-10-18',
    title: 'Annie Hall (FF25)',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Annie_Hall_(FF25).jpg'
  },
  {
    id: '21',
    date: '2025-10-17',
    title: "Something's Gotta Give (FF25)",
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Something.jpg'
  },
  {
    id: '22',
    date: '2025-10-16',
    title: 'Good Fortune',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Good_Fortune.jpg'
  },
  {
    id: '23',
    date: '2025-10-14',
    title: 'Roofman',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Roofman.jpg'
  },
  {
    id: '24',
    date: '2025-10-12',
    title: 'Roofman',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '25',
    date: '2025-10-09',
    title: 'Tron: Ares',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Tron_Ares.jpg'
  },
  {
    id: '26',
    date: '2025-10-06',
    title: 'The Smashing Machine',
    rating: 0,
    review: '',
    location: 'AMC Majestic 6',
    posterUrl: '/posters/The_Smashing_Machine.jpg'
  },
  {
    id: '27',
    date: '2025-10-04',
    title: 'After the Hunt - Early Access Screening',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/After_the_Hunt_-_Early_Access_Screening.jpg'
  },
  {
    id: '28',
    date: '2025-10-02',
    title: 'The Smashing Machine',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '29',
    date: '2025-10-01',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC 34th Street 14'
  },
  {
    id: '30',
    date: '2025-09-27',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '31',
    date: '2025-09-26',
    title: "Gabby's Dollhouse: The Movie",
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Gabby.jpg'
  },
  {
    id: '32',
    date: '2025-09-25',
    title: 'One Battle After Another',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13'
  },
  {
    id: '33',
    date: '2025-09-24',
    title: 'Him',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Him.jpg'
  },
  {
    id: '34',
    date: '2025-09-20',
    title: 'Apollo 13: 30th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Apollo_13_30th_Anniversary.jpg'
  },
  {
    id: '35',
    date: '2025-09-17',
    title: 'Demon Slayer: Kimetsu No Yaiba Infinity Castle',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/Demon_Slayer_Kimetsu_No_Yaiba_Infinity_Castle.jpg'
  },
  {
    id: '36',
    date: '2025-09-15',
    title: 'Downton Abbey: The Grand Finale',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/Downton_Abbey_The_Grand_Finale.jpg'
  },
  {
    id: '37',
    date: '2025-09-13',
    title: 'Toy Story: 30th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Toy_Story_30th_Anniversary.jpg'
  },
  {
    id: '38',
    date: '2025-09-12',
    title: 'The Long Walk',
    rating: 0,
    review: '',
    location: 'AMC 34th Street 14'
  },
  {
    id: '39',
    date: '2025-09-09',
    title: 'Hamilton',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/Hamilton.jpg'
  },
  {
    id: '40',
    date: '2025-09-07',
    title: 'The Baltimorons',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/The_Baltimorons.jpg'
  },
  {
    id: '41',
    date: '2025-09-06',
    title: 'Splitsville',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Splitsville.jpg'
  },
  {
    id: '42',
    date: '2025-09-05',
    title: 'Twinless',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Twinless.jpg'
  },
  {
    id: '43',
    date: '2025-09-01',
    title: 'Jaws: 50th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/Jaws_50th_Anniversary.jpg'
  },
  {
    id: '44',
    date: '2025-08-31',
    title: 'Caught Stealing',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '45',
    date: '2025-08-30',
    title: 'Weapons',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Weapons.jpg'
  },
  {
    id: '46',
    date: '2025-08-29',
    title: "The Shadow's Edge",
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/The_Shadow.jpg'
  },
  {
    id: '47',
    date: '2025-08-28',
    title: 'The Roses',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '48',
    date: '2025-08-27',
    title: 'The 40 Year-Old Virgin: 20th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '49',
    date: '2025-08-05',
    title: 'The Bad Guys 2',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '50',
    date: '2025-08-04',
    title: 'Sunset Boulevard 75th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Sunset_Boulevard_75th_Anniversary.jpg'
  },
  {
    id: '51',
    date: '2025-08-01',
    title: 'The Naked Gun',
    rating: 0,
    review: '',
    location: 'AMC 34th Street 14'
  },
  {
    id: '52',
    date: '2025-07-31',
    title: 'The Naked Gun',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '53',
    date: '2025-07-29',
    title: 'Sorry, Baby',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Sorry,_Baby.jpg'
  },
  {
    id: '54',
    date: '2025-07-27',
    title: 'The Fantastic Four: First Steps',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/The_Fantastic_Four_First_Steps.jpg'
  },
  {
    id: '55',
    date: '2025-07-26',
    title: 'The Lychee Road / The Litchi Road',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/The_Lychee_Road_-_The_Litchi_Road.jpg'
  },
  {
    id: '56',
    date: '2025-07-21',
    title: 'AMC Scream Unseen: July 21',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/AMC_Scream_Unseen_July_21.jpg'
  },
  {
    id: '57',
    date: '2025-07-19',
    title: 'Eddington',
    rating: 0,
    review: '',
    location: 'AMC Newport Centre 11',
    posterUrl: '/posters/Eddington.jpg'
  },
  {
    id: '58',
    date: '2025-07-18',
    title: 'I Know What You Did Last Summer',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '59',
    date: '2025-07-10',
    title: 'Superman',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '60',
    date: '2025-07-05',
    title: 'Mission: Impossible – The Final Reckoning',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/Mission_Impossible_–_The_Final_Reckoning.jpg'
  },
  {
    id: '61',
    date: '2025-07-03',
    title: 'M3GAN 2.0',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '62',
    date: '2025-07-02',
    title: 'Jurassic World Rebirth',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Jurassic_World_Rebirth.jpg'
  },
  {
    id: '63',
    date: '2025-06-29',
    title: '28 Years Later',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/28_Years_Later.jpg'
  },
  {
    id: '64',
    date: '2025-06-23',
    title: 'F1 The Movie Fan First Premiere Exclusively in IMAX',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/F1_The_Movie_Fan_First_Premiere_Exclusively_in_IMAX.jpg'
  },
  {
    id: '65',
    date: '2025-06-22',
    title: '28 Years Later',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '66',
    date: '2025-06-20',
    title: 'Brokeback Mountain: 20th Anniversary',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Brokeback_Mountain_20th_Anniversary.jpg'
  },
  {
    id: '67',
    date: '2025-06-14',
    title: 'Materialists',
    rating: 0,
    review: '',
    location: 'AMC Orpheum 7'
  },
  {
    id: '68',
    date: '2025-06-14',
    title: 'How to Train Your Dragon',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '69',
    date: '2025-06-08',
    title: 'The Phoenician Scheme',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '70',
    date: '2025-06-07',
    title: 'Lilo & Stitch',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Lilo_&_Stitch.jpg'
  },
  {
    id: '71',
    date: '2025-06-07',
    title: 'Ballerina',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '72',
    date: '2025-06-04',
    title: 'Final Destination Bloodlines',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Final_Destination_Bloodlines.jpg'
  },
  {
    id: '73',
    date: '2025-06-03',
    title: 'Final Destination Bloodlines',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Final_Destination_Bloodlines.jpg'
  },
  {
    id: '74',
    date: '2025-06-02',
    title: 'AMC Screen Unseen: June 2',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/AMC_Screen_Unseen_June_2.jpg'
  },
  {
    id: '75',
    date: '2025-05-31',
    title: 'Karate Kid: Legends',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '76',
    date: '2025-05-28',
    title: 'Mission: Impossible – The Final Reckoning',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '77',
    date: '2025-05-08',
    title: 'Shadow Force',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Shadow_Force.jpg'
  },
  {
    id: '78',
    date: '2025-05-07',
    title: 'Annabelle: Halfway to Halloween',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Annabelle_Halfway_to_Halloween.jpg'
  },
  {
    id: '79',
    date: '2025-05-02',
    title: 'The Accountant 2',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/The_Accountant_2.jpg'
  },
  {
    id: '80',
    date: '2025-05-01',
    title: 'Thunderbolts*',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Thunderbolts.jpg'
  },
  {
    id: '81',
    date: '2025-04-25',
    title: 'Star Wars: Episode III - Revenge of the Sith 20th Anniversary Re-Release (2025)',
    rating: 0,
    review: '',
    location: 'AMC Empire 25',
    posterUrl: '/posters/Star_Wars_Episode_III_-_Revenge_of_the_Sith_20th_Anniversary_Re-Release_(2025).jpg'
  },
  {
    id: '82',
    date: '2025-04-24',
    title: 'The Accountant 2',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/The_Accountant_2.jpg'
  },
  {
    id: '83',
    date: '2025-04-18',
    title: 'Warfare',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15'
  },
  {
    id: '84',
    date: '2025-04-17',
    title: 'Sinners',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13'
  },
  {
    id: '85',
    date: '2025-04-11',
    title: 'The Amateur',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/The_Amateur.jpg'
  },
  {
    id: '86',
    date: '2025-04-09',
    title: 'A Minecraft Movie',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '87',
    date: '2025-04-05',
    title: 'The Friend',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/The_Friend.jpg'
  },
  {
    id: '88',
    date: '2025-04-04',
    title: 'Death of a Unicorn',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '89',
    date: '2025-03-18',
    title: 'Mickey 17',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '90',
    date: '2025-02-19',
    title: 'Parthenope',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/Parthenope.jpg'
  },
  {
    id: '91',
    date: '2025-02-14',
    title: 'Captain America: Brave New World',
    rating: 0,
    review: '',
    location: 'AMC Village 7'
  },
  {
    id: '92',
    date: '2025-02-12',
    title: 'Ne Zha 2',
    rating: 0,
    review: '',
    location: 'AMC Empire 25'
  },
  {
    id: '93',
    date: '2025-02-08',
    title: 'Parasite: IMAX Exclusive',
    rating: 0,
    review: '',
    location: 'AMC Kips Bay 15',
    posterUrl: '/posters/Parasite_IMAX_Exclusive.jpg'
  },
  {
    id: '94',
    date: '2025-02-03',
    title: 'Companion',
    rating: 0,
    review: '',
    location: 'AMC DINE-IN Holly Springs 9'
  },
  {
    id: '95',
    date: '2025-02-01',
    title: 'Detective Chinatown 1900',
    rating: 0,
    review: '',
    location: 'AMC Southpoint 17',
    posterUrl: '/posters/Detective_Chinatown_1900.jpg'
  },
  {
    id: '96',
    date: '2025-01-31',
    title: 'Creation of the Gods II: Demon Force',
    rating: 0,
    review: '',
    location: 'AMC Southpoint 17',
    posterUrl: '/posters/Creation_of_the_Gods_II_Demon_Force.jpg'
  },
  {
    id: '97',
    date: '2025-01-28',
    title: "I'm Still Here",
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/I.jpg'
  },
  {
    id: '98',
    date: '2025-01-25',
    title: 'The Brutalist',
    rating: 0,
    review: '',
    location: 'AMC Lincoln Square 13',
    posterUrl: '/posters/The_Brutalist.jpg'
  },
  {
    id: '99',
    date: '2025-01-24',
    title: 'Flight Risk',
    rating: 0,
    review: '',
    location: 'AMC Village 7',
    posterUrl: '/posters/Flight_Risk.jpg'
  },
  {
    id: '100',
    date: '2025-01-18',
    title: 'A Complete Unknown',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/A_Complete_Unknown.jpg'
  },
  {
    id: '101',
    date: '2025-01-17',
    title: 'Babygirl',
    rating: 0,
    review: '',
    location: 'AMC 19th St. East 6',
    posterUrl: '/posters/Babygirl.jpg'
  }
];
