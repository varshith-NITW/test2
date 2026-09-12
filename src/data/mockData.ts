import { TouristSpot, Hotel, Guide, Restaurant } from '../types';

export const INITIAL_TOURIST_SPOTS: TouristSpot[] = [
  {
    id: 'spot-charminar',
    name: 'Charminar & Old City Bazaars',
    city: 'Hyderabad',
    location: { lat: 17.3616, lng: 78.4747 },
    description: 'Iconic 16th-century 4-pillar grand monument surrounded by bustling Laad Bazaar pearl and spice lanes.',
    tags: ['Heritage', 'Architecture', 'Shopping', 'Street Food'],
    openingHours: '09:00 AM - 08:30 PM',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJj70E4eWbyzsR3eI19u3P3x4',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Charminar+Hyderabad',
    monthlyCheckins: 245000,
    checkinTrend: 'surging',
    bestTimeToVisit: 'Early morning (08:30 AM) or illuminated twilight (06:30 PM)',
    catchyLine: '400 years of royal Nizami history & steaming cardamom Irani chai whisper through historic alleys.',
    bestPic: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'Hello / Greetings', translation: 'Namaskaram (నమస్కారం) / Adab (آداب)', pronunciation: 'Nah-mas-kahr-am', context: 'Universal polite greeting' },
      { phrase: 'How much is this?', translation: 'Idhi entha? (ఇది ఎంత?) / Yeh kitne ka hai?', pronunciation: 'Ee-dhee en-thah?', context: 'Essential for bazaar bargaining' },
      { phrase: 'Can you reduce the price?', translation: 'Koncham thagginchandi (కొంచెం తగ్గించండి)', pronunciation: 'Kone-chum thug-gin-chun-dee', context: 'Polite bargaining phrase' },
      { phrase: 'Where is authentic Biryani?', translation: 'Manchi Biryani ekkada? (మంచి బిర్యానీ ఎక్కడ?)', pronunciation: 'Mun-chee bir-yah-nee ek-kuh-dah?', context: 'Food navigation' },
      { phrase: 'Thank you very much!', translation: 'Chala Dhanyavadhalu (చాలా ధన్యవాదాలు)', pronunciation: 'Chah-lah dhun-yah-vah-dha-loo', context: 'Expressing warm gratitude' }
    ],
    foodMustEats: [
      { name: 'Irani Chai & Osmania Biscuits', spot: 'Nimrah Cafe & Bakery (50m from Charminar)', tip: 'Dip the fresh warm salted butter biscuit into the rich clotted milk tea.' },
      { name: 'Kacche Gosht ki Hyderabadi Dum Biryani', spot: 'Hotel Shadab (Ghansi Bazaar)', tip: 'Cooked over wood fire coals with saffron rice and fragrant mutton.' },
      { name: 'Zafrani Mutton Haleem', spot: 'Pista House Charminar Outpost', tip: 'Garnished with pure cow ghee, fried crisp onions and fresh mint.' }
    ],
    culturalTips: [
      'Remove footwear at monument mosque steps and dress modestly covering shoulders and knees.',
      'Bargaining is expected in Laad Bazaar; politely quote 60-70% of initial price for handmade bangles.',
      'Best photography light is 08:30 AM or 06:45 PM when monument golden spotlights activate.'
    ],
    commuteTips: {
      autoFare: '₹60-100 within Old City; ₹200 from Secunderabad Railway Station; ₹750 from Airport.',
      metroAvailable: true,
      localAdvice: 'Take the Green Line Metro to MGBS station, then hop on a share electric rickshaw for ₹30.'
    }
  },
  {
    id: 'spot-golconda',
    name: 'Golconda Fort & Acoustic Vaults',
    city: 'Hyderabad',
    location: { lat: 17.3833, lng: 78.4011 },
    description: 'A colossal 12th-century granite fortress citadel famed for acoustic clapping porticos, diamond vaults, and 360-degree sunset panoramas.',
    tags: ['Heritage', 'Citadel', 'Acoustics', 'Sunset View'],
    openingHours: '09:00 AM - 05:30 PM',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJ49K4vT6XyzsR3d001q_abc',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golconda+Fort+Hyderabad',
    monthlyCheckins: 168000,
    checkinTrend: 'high',
    bestTimeToVisit: '03:30 PM to catch golden hour and sunset atop the Baradari pavilion',
    catchyLine: 'A single hand clap at the Fateh Darwaza reverberates 1 kilometer up to the hilltop royal palace.',
    bestPic: 'https://images.unsplash.com/photo-1606298855672-3efb620b7537?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'How far is the top?', translation: 'Paiki entha dhooram? (పైకి ఎంత దూరం?)', pronunciation: 'Pie-kee en-thah dhoo-rum?', context: 'Asking about the 360-step climb' },
      { phrase: 'Do you have drinking water?', translation: 'Manchi neellu unnaaya? (మంచి నీళ్లు ఉన్నాయా?)', pronunciation: 'Mun-chee neel-loo oon-nah-yah?', context: 'Hydration during fort hike' },
      { phrase: 'Wait here for 1 hour', translation: 'Oka ganta ikkade undandi (ఒక గంట ఇక్కడే ఉండండి)', pronunciation: 'Oh-kah gun-tah ik-kuh-day oon-dun-dee', context: 'Telling auto driver to wait' }
    ],
    foodMustEats: [
      { name: 'Khubani ka Meetha (Apricot dessert)', spot: 'Fort Gate Terrace Cafe', tip: 'Topped with thick malai clotted cream.' }
    ],
    culturalTips: [
      'Wear sturdy sneakers for the 360 ancient stone stairs to the Baradari pavilion.',
      'The acoustic clapping portico at Fateh Darwaza was used as an early warning telegraph system.'
    ],
    commuteTips: {
      autoFare: '₹120-150 from Banjara Hills; ₹180 from Hitech City.',
      metroAvailable: false,
      localAdvice: 'Book an app cab or hire a pre-arranged return auto as return taxis can be scarce after sunset.'
    }
  },
  {
    id: 'spot-chowmahalla',
    name: 'Chowmahalla Palace',
    city: 'Hyderabad',
    location: { lat: 17.3578, lng: 78.4717 },
    description: 'The opulent seat of the Asaf Jahi Nizams, boasting 19 crystal chandeliers from Belgium, royal courtyards, and antique Rolls Royce carriage galleries.',
    tags: ['Palace', 'Royalty', 'Museum', 'Photography'],
    openingHours: '10:00 AM - 05:00 PM (Closed Fridays)',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJF0M6ZOmbyzsR88b02z_xyz',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chowmahalla+Palace+Hyderabad',
    monthlyCheckins: 94000,
    checkinTrend: 'steady',
    bestTimeToVisit: '10:30 AM for warm sunlight dancing through grand stained-glass windows',
    catchyLine: 'Walk the mirrored royal corridors of the Nizams, once celebrated as the wealthiest dynasty on earth.',
    bestPic: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'Where is the Vintage Car Gallery?', translation: 'Vintage car exhibition ekkada? (వింటేజ్ కార్ ఎగ్జిబిషన్ ఎక్కడ?)', pronunciation: 'Vin-tij kahr ek-zee-bi-shun ek-kuh-dah?', context: 'Navigating palace courtyards' },
      { phrase: 'Is photography allowed inside?', translation: 'Lopala photos theeyocha? (లోపల ఫోటోలు తీయొచ్చా?)', pronunciation: 'Loh-puh-lah foh-tohs thee-yoh-chah?', context: 'Camera permissions' }
    ],
    foodMustEats: [
      { name: 'Double Ka Meetha (Royal Bread Pudding)', spot: 'Subhan Bakery & Sweets nearby', tip: 'Infused with pure saffron and toasted cashew nuts.' }
    ],
    culturalTips: [
      'Videography requires nominal permit at entrance gate.',
      'Check out the 1912 40/50 HP Silver Ghost Rolls-Royce in the rear courtyard.'
    ],
    commuteTips: {
      autoFare: '₹40-50 from Charminar (just 800m away).',
      metroAvailable: true,
      localAdvice: 'Easily walked from Charminar through Khilwat road within 10 minutes.'
    }
  },
  {
    id: 'spot-warangal-temple',
    name: 'Thousand Pillar & Ramappa Temples',
    city: 'Warangal',
    location: { lat: 17.9784, lng: 79.5941 },
    description: 'UNESCO World Heritage 12th-century Kakatiya marvel built with floating bricks and polished carved black basalt pillars.',
    tags: ['UNESCO', 'Spiritual', 'Sculptures', 'Architecture'],
    openingHours: '06:00 AM - 08:00 PM',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJ592_warangal_kakatiya',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Thousand+Pillar+Temple+Warangal',
    monthlyCheckins: 132000,
    checkinTrend: 'surging',
    bestTimeToVisit: '06:30 AM morning prayer aarti or 05:00 PM sunset breeze',
    catchyLine: 'Stunning floating bricks & mirror-polished black basalt stones that chime musical notes when tapped.',
    bestPic: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'Where is the Temple entrance?', translation: 'Gudi pravesham ekkada? (గుడి ప్రవేశం ఎక్కడ?)', pronunciation: 'Goo-dee pruh-vay-shum ek-kuh-dah?', context: 'Temple entry' },
      { phrase: 'Can you show me the musical pillar?', translation: 'Sangeetha sthambham chupisthara? (సంగీత స్తంభం చూపిస్తారా?)', pronunciation: 'Sun-gee-thuh sthum-bhum choo-pis-thah-rah?', context: 'Guide question' }
    ],
    foodMustEats: [
      { name: 'Sarva Pindi (Crispy rice pancake with peanuts)', spot: 'Kakatiya Rural Kitchens', tip: 'Eaten hot with fresh churned butter and spicy tomato chutney.' }
    ],
    culturalTips: [
      'Strictly vegetarian temple premises.',
      'Do not touch delicate intricate sculptures with oily hands.'
    ],
    commuteTips: {
      autoFare: '₹50 from Hanamkonda Bus Station; ₹80 from Warangal Junction.',
      metroAvailable: false,
      localAdvice: 'Take TSRTC city bus or auto directly from Kazipet or Warangal station.'
    }
  },
  {
    id: 'spot-jaipur-hawa-mahal',
    name: 'Hawa Mahal & Amer Fortress',
    city: 'Jaipur',
    location: { lat: 26.9239, lng: 75.8267 },
    description: 'The iconic Pink City honeycomb palace with 953 jharokha lattice windows designed for royal breezes, coupled with Amer hilltop fort.',
    tags: ['Heritage', 'Fort', 'Pink City', 'Royal'],
    openingHours: '09:00 AM - 05:00 PM',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJhawa_mahal_jaipur_pink',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hawa+Mahal+Jaipur',
    monthlyCheckins: 310000,
    checkinTrend: 'surging',
    bestTimeToVisit: 'Early morning 07:30 AM sunrise from the cafe opposite the palace',
    catchyLine: '953 pink sandstone casements whispering regal secrets above lively spice and block-print bazaars.',
    bestPic: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'How much for this puppet / dupatta?', translation: 'Yeh kitne ka hai bhai? (यह कितने का है भाई?)', pronunciation: 'Yeh kit-nay kah hai bhy?', context: 'Bazaar shopping' },
      { phrase: 'Where can I get pure Ghevar?', translation: 'Shuddh Ghevar kahan milega? (शुद्ध घेवर कहाँ मिलेगा?)', pronunciation: 'Shoodh ghay-vuhr kah-hahn mi-lay-gah?', context: 'Sweet shopping' }
    ],
    foodMustEats: [
      { name: 'Pyaaz Kachori & Malpua', spot: 'Rawat Mishtan Bhandar', tip: 'Golden crisp pastry stuffed with spiced caramelized onions.' },
      { name: 'Dal Baati Churma', spot: 'Chokhi Dhani Heritage Village', tip: 'Drenched in pure desi ghee.' }
    ],
    culturalTips: [
      'Best facade photos are taken from the rooftop cafes directly across the road.',
      'Wear slip-resistant shoes when exploring the steep cobblestone ramps of Amer.'
    ],
    commuteTips: {
      autoFare: '₹80-120 within walled Pink City; ₹300 return to Amer Fort.',
      metroAvailable: true,
      localAdvice: 'Use Jaipur Metro Pink Line up to Badi Chaupar station, just 150m from Hawa Mahal.'
    }
  },
  {
    id: 'spot-lucknow-bara-imambara',
    name: 'Bara Imambara & Bhool Bhulaiya',
    city: 'Lucknow',
    location: { lat: 26.8690, lng: 80.9128 },
    description: 'Monumental 18th-century Awadhi architectural marvel featuring a gravity-defying central arched hall and the intricate 489-passage Bhool Bhulaiya labyrinth maze.',
    tags: ['Heritage', 'Labyrinth', 'Awadhi Architecture', 'Monument'],
    openingHours: '06:00 AM - 06:30 PM',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJ_lucknow_bara_imambara',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bara+Imambara+Lucknow',
    monthlyCheckins: 185000,
    checkinTrend: 'surging',
    bestTimeToVisit: '08:30 AM before tour bus arrivals, or 04:30 PM for sunset golden hour',
    catchyLine: 'A gravity-defying 50-meter unsupported roof and a 489-door labyrinth whispered by centuries of Nawabi lore.',
    bestPic: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85',
    survivalPhrases: [
      { phrase: 'Awadhi Polite Greeting', translation: 'Adab / Namaste (آداب / नमस्ते)', pronunciation: 'Ah-daab', context: 'Universal polite greeting with right hand raised' },
      { phrase: 'Where is the labyrinth maze?', translation: 'Bhool Bhulaiya kidhar hai? (भूल भुलैया किधर है?)', pronunciation: 'Bhool bhoo-lye-yah kidh-uhr high?', context: 'Asking guide or guard' },
      { phrase: 'Where are authentic Galouti Kebabs?', translation: 'Asli Tunday Kebab kahan milenge? (असली टुंडे कबाब कहाँ मिलेंगे?)', pronunciation: 'Us-lee Toon-day kay-bahb kah-hahn mi-layn-gay?', context: 'Food navigation in Chowk' }
    ],
    foodMustEats: [
      { name: 'Tunday Galouti Kebabs with Ulte Tawe ka Paratha', spot: 'Tunday Kababi (Chowk Old Shop, 800m from Imambara)', tip: 'Melt-in-mouth minced meat infused with 160 secret herbs and spices.' },
      { name: 'Royal Awadhi Sheermal', spot: 'Old Nazirabad Bakeries', tip: 'Saffron-infused sweet flatbread baked in traditional clay tandoors.' },
      { name: 'Makhan Malai / Nimish', spot: 'Chowk Morning Vendors (Winter delicacy)', tip: 'Airy whipped dew-chilled milk foam topped with saffron and silver vark.' }
    ],
    culturalTips: [
      'Remove footwear at monument steps; shoe deposit counters are available at the main gate.',
      'Always enter Bhool Bhulaiya with a certified local guide to avoid getting disoriented inside the 489 passages.',
      'Photography is permitted; drone videography requires prior district administration clearance.'
    ],
    commuteTips: {
      autoFare: '₹60-90 from Charbagh Railway Station; ₹250 from Chaudhary Charan Singh Airport.',
      metroAvailable: true,
      localAdvice: 'Take Lucknow Metro Red Line to Durgapuri or Charbagh, then hop on an electric rickshaw (E-rickshaw) for ₹30.'
    }
  },
  {
    id: 'spot-lucknow-rumi-darwaza',
    name: 'Rumi Darwaza & Chowk Heritage Bazaar',
    city: 'Lucknow',
    location: { lat: 26.8715, lng: 80.9120 },
    description: 'The iconic 60-foot Turkish Gate standing as the majestic gateway to Lucknow Old City, adjacent to the historic Chikan embroidery artisan bazaars.',
    tags: ['Gate', 'Heritage', 'Chikan Embroidery', 'Old City'],
    openingHours: 'Open 24 Hours (Evening illumination: 06:30 PM - 10:30 PM)',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJ_lucknow_rumi_darwaza',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rumi+Darwaza+Lucknow',
    monthlyCheckins: 145000,
    checkinTrend: 'high',
    bestTimeToVisit: '06:00 PM when spotlights illuminate the grand arch against the twilight sky',
    catchyLine: 'The 60-foot Turkish Gate that welcomed Nawabs and travelers into the Paris of the East.',
    bestPic: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=85'
  },
  {
    id: 'spot-delhi-qutub',
    name: 'Qutub Minar & Mehrauli Heritage',
    city: 'Delhi',
    location: { lat: 28.5244, lng: 77.1855 },
    description: '73-meter soaring fluted red sandstone minaret and ancient 4th-century rust-resistant iron pillar surrounded by Delhi Sultanate ruins.',
    tags: ['UNESCO', 'Heritage', 'Architecture', 'Monuments'],
    openingHours: '07:00 AM - 08:00 PM',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    googlePlaceId: 'ChIJ_delhi_qutub_minar',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Qutub+Minar+Delhi',
    monthlyCheckins: 210000,
    checkinTrend: 'surging',
    bestTimeToVisit: '08:30 AM morning light on the red sandstone carvings',
    catchyLine: '73 meters of carved red sandstone and marble charting centuries of Delhi dynasties.'
  }
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-taj-falaknuma',
    name: 'Taj Falaknuma Palace (Mirror in the Sky)',
    city: 'Hyderabad',
    address: 'Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad, Telangana 500053',
    location: { lat: 17.3314, lng: 78.4678 },
    tier: 'Heritage Luxury',
    pricePerNight: 28500,
    commissionRate: 0.15,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Horse-drawn carriage entry', 'Nizami heritage walk', 'Champagne high-tea', 'Royal palace library access'],
    amenities: ['Free High-Speed Wi-Fi', 'Heritage Outdoor Pool', 'Nizami Spa & Wellness', 'Fine Dining Adaa', '24h Concierge'],
    checkinCount: 38400,
    weeklyCheckins: 920,
    footfallRank: 1,
    googlePlaceId: 'ChIJf_falaknuma_hyderabad',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Falaknuma+Palace+Hyderabad',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN36AAACT0912K1Z8',
    partnershipModel: 'hybrid',
    guideReferralKickbackPercent: 7.5,
    roomTypes: [
      {
        id: 'tf-palace-room',
        name: 'Historic Palace Room',
        pricePerNight: 28500,
        capacity: 2,
        description: 'Original Victorian wood furniture, high ceilings, marble bathroom and serene palace courtyard views.',
        perks: ['Breakfast included', 'Welcome high-tea', 'Royal carriage arrival']
      },
      {
        id: 'tf-royal-suite',
        name: 'Grand Royal Nizami Suite',
        pricePerNight: 45000,
        capacity: 3,
        description: 'Colossal suite with Nizam era portraits, private balcony overlooking the Old City lights, and butler service.',
        perks: ['24h Butler Service', 'All meals included', 'Private acoustic heritage tour']
      }
    ]
  },
  {
    id: 'hotel-marigold-bazaar',
    name: 'The Charminar Heritage Haveli Stay',
    city: 'Hyderabad',
    address: 'Opposite Chowmahalla Courtyard, Khilwat, Hyderabad, Telangana 500002',
    location: { lat: 17.3592, lng: 78.4725 },
    tier: 'Boutique Stay',
    pricePerNight: 4200,
    commissionRate: 0.12,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Rooftop Charminar minaret view', 'Complimentary Irani Chai tasting', 'Bazaar shopping escort'],
    amenities: ['High-Speed Wi-Fi', 'Rooftop Terrace Lounge', 'Heritage Courtyard', 'Laundry Service'],
    checkinCount: 22800,
    weeklyCheckins: 610,
    footfallRank: 2,
    googlePlaceId: 'ChIJcharminar_haveli_stay',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Heritage+Haveli+Stay+Hyderabad',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN36BBBCD1023P2Q4',
    partnershipModel: 'community_pool',
    guideReferralKickbackPercent: 8.0,
    roomTypes: [
      {
        id: 'chh-deluxe',
        name: 'Jharokha Courtyard Deluxe',
        pricePerNight: 4200,
        capacity: 2,
        description: 'Carved teakwood four-poster bed, handcrafted tile flooring, and direct balcony viewing Charminar.',
        perks: ['Breakfast included', 'Sunset rooftop tea', 'Free cancellation']
      },
      {
        id: 'chh-family',
        name: 'Royal Heritage Family Suite',
        pricePerNight: 6800,
        capacity: 4,
        description: 'Two interconnected bedroom chambers with antique mirror archways and seating divans.',
        perks: ['Breakfast included', 'Complimentary bazaar escort', 'Late check-out']
      }
    ]
  },
  {
    id: 'hotel-golconda-resort',
    name: 'Golconda Fort View Eco-Resort',
    city: 'Hyderabad',
    address: 'Gandipet Boulevard, Adjacent to Golconda Foothills, Hyderabad 500075',
    location: { lat: 17.3875, lng: 78.3980 },
    tier: 'Cultural Retreat',
    pricePerNight: 5800,
    commissionRate: 0.14,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Direct fort rampart view', 'Lush botanical gardens', 'Bicycle rental to fort gate', 'Organic Andhra breakfast'],
    amenities: ['Swimming Pool', 'Spa', 'Free Parking', 'Children Play Zone', 'Restaurant'],
    checkinCount: 17400,
    weeklyCheckins: 480,
    footfallRank: 3,
    googlePlaceId: 'ChIJgolconda_eco_resort',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golconda+Resort+Hyderabad',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN36CCCCE9876R3S1',
    partnershipModel: 'in_house_guides',
    guideReferralKickbackPercent: 6.0,
    roomTypes: [
      {
        id: 'gfr-villa',
        name: 'Hilltop Fortview Villa',
        pricePerNight: 5800,
        capacity: 2,
        description: 'Private cottage facing the ancient granite fortress with sit-out veranda and outdoor shower.',
        perks: ['Breakfast included', 'Morning bird-walk', 'Fort shuttle']
      }
    ]
  },
  {
    id: 'hotel-warangal-regency',
    name: 'Kakatiya Heritage Grand',
    city: 'Warangal',
    address: 'Subedari Main Road, Near Thousand Pillar Temple, Hanamkonda 506001',
    location: { lat: 17.9810, lng: 79.5910 },
    tier: 'Heritage Luxury',
    pricePerNight: 3600,
    commissionRate: 0.12,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Walking distance to 1000 Pillar Temple', 'Kakatiya brass decor', 'Authentic Telangana thali restaurant'],
    amenities: ['Free High-Speed Wi-Fi', 'Vegetarian Dining', 'Conference Hall', 'Travel Desk'],
    checkinCount: 14200,
    weeklyCheckins: 390,
    footfallRank: 1,
    googlePlaceId: 'ChIJkakatiya_heritage_grand',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kakatiya+Heritage+Grand+Warangal',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN36DDDDF4567T8U9',
    partnershipModel: 'community_pool',
    guideReferralKickbackPercent: 8.0,
    roomTypes: [
      {
        id: 'khg-deluxe',
        name: 'Kakatiya King Deluxe Room',
        pricePerNight: 3600,
        capacity: 2,
        description: 'Comfortable spacious room with carved stone accents and plush bedding.',
        perks: ['Breakfast included', 'Temple shuttle', 'Free Wi-Fi']
      }
    ]
  },
  {
    id: 'hotel-vivanta-lucknow',
    name: 'Vivanta Lucknow (Gomti Nagar)',
    city: 'Lucknow',
    address: 'Vipin Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010',
    location: { lat: 26.8520, lng: 80.9710 },
    tier: 'Heritage Luxury',
    pricePerNight: 5800,
    commissionRate: 0.15,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Riverfront View', 'Nawabi Dastarkhwan Dining Privileges', 'Heritage Walk Pass', 'Welcome Thandai'],
    amenities: ['High-Speed Wi-Fi', 'Outdoor Pool', 'Jiva Spa & Wellness', 'Fine Dining Oudhyana', '24h Concierge'],
    checkinCount: 28400,
    weeklyCheckins: 720,
    footfallRank: 1,
    googlePlaceId: 'ChIJ_vivanta_lucknow',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vivanta+Lucknow+Gomti+Nagar',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN09AAAAL8821K1Z9',
    partnershipModel: 'hybrid',
    guideReferralKickbackPercent: 7.0,
    roomTypes: [
      {
        id: 'vl-superior',
        name: 'Deluxe City View Room',
        pricePerNight: 5800,
        capacity: 2,
        description: 'Chic Awadhi decor with modern luxury, king plush bed, and Gomti river skyline views.',
        perks: ['Breakfast included', 'Welcome high-tea', 'Late checkout']
      },
      {
        id: 'vl-executive-suite',
        name: 'Nawabi Executive Suite',
        pricePerNight: 9500,
        capacity: 3,
        description: 'Expansive living salon with handcrafted chikan draperies and private butler service.',
        perks: ['All meals included', 'Spa pass', 'Chowk bazaar guide escort']
      }
    ]
  },
  {
    id: 'hotel-clarks-awadh',
    name: 'Clarks Awadh Heritage Stay',
    city: 'Lucknow',
    address: '8 Mahatma Gandhi Marg, Hazratganj, Lucknow, Uttar Pradesh 226001',
    location: { lat: 26.8620, lng: 80.9320 },
    tier: 'Heritage Luxury',
    pricePerNight: 4200,
    commissionRate: 0.12,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Rooftop Falaknuma Restaurant View', 'Hazratganj Walking Proximity', 'Awadhi Chai Tasting'],
    amenities: ['Free Wi-Fi', 'Rooftop Lounge', 'Airport Shuttle', 'Business Centre'],
    checkinCount: 21500,
    weeklyCheckins: 580,
    footfallRank: 2,
    googlePlaceId: 'ChIJ_clarks_awadh_lucknow',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clarks+Awadh+Lucknow',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN09BBBCK3312P2Q5',
    partnershipModel: 'community_pool',
    guideReferralKickbackPercent: 8.0,
    roomTypes: [
      {
        id: 'ca-heritage-deluxe',
        name: 'Awadh Heritage Room',
        pricePerNight: 4200,
        capacity: 2,
        description: 'Classic wooden aesthetics overlooking the Gomti river with complimentary breakfast.',
        perks: ['Breakfast included', 'Rooftop voucher', 'Free Wi-Fi']
      }
    ]
  },
  {
    id: 'hotel-lebua-lucknow',
    name: 'Lebua Lucknow (Heritage Haveli Bungalow)',
    city: 'Lucknow',
    address: '19 Mall Avenue, Lucknow, Uttar Pradesh 226001',
    location: { lat: 26.8490, lng: 80.9410 },
    tier: 'Boutique Stay',
    pricePerNight: 4900,
    commissionRate: 0.14,
    status: 'verified',
    allowsIndependentGuides: true,
    perks: ['Traditional 1936 Art Deco Bungalow', 'Private Courtyard Dining', 'Heritage Architecture Tour'],
    amenities: ['Outdoor Pool', 'Lush Gardens', 'Heritage Bar 1936', 'Free Wi-Fi'],
    checkinCount: 16800,
    weeklyCheckins: 430,
    footfallRank: 3,
    googlePlaceId: 'ChIJ_lebua_lucknow',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lebua+Lucknow',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    businessRegNumber: 'GSTIN09CCCDL9012R3S2',
    partnershipModel: 'in_house_guides',
    guideReferralKickbackPercent: 6.5,
    roomTypes: [
      {
        id: 'lebua-courtyard',
        name: 'Heritage Courtyard Room',
        pricePerNight: 4900,
        capacity: 2,
        description: 'Art deco room opening into sprawling green verandas and terracotta courtyards.',
        perks: ['Breakfast included', 'Artisan tea tasting', 'Free cancellation']
      }
    ]
  }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-nimrah',
    name: 'Nimrah Cafe & Bakery',
    city: 'Hyderabad',
    address: 'Opposite Mecca Masjid & Charminar, Charminar Rd, Hyderabad 500002',
    location: { lat: 17.3619, lng: 78.4744 },
    cuisine: ['Irani Chai', 'Bakery', 'Mughlai Snacks', 'Biscuits'],
    checkinCount: 312000,
    weeklyCheckins: 8400,
    footfallRank: 1,
    priceForTwo: 180,
    status: 'verified',
    openingHours: '04:00 AM - 11:30 PM',
    seatingCapacity: 60,
    tags: ['Legendary', 'Charminar View', 'Budget Friendly', 'Cult Favorite'],
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nimrah+Cafe+Charminar',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 200,
    famousDishes: [
      { name: 'Special Dum Ki Irani Chai', price: 30, description: 'Simmered with cardamom and thickened rich buffalo milk.', isVeg: true },
      { name: 'Warm Osmania Biscuits (Plate of 4)', price: 40, description: 'Traditional lightly sweet and salted crumbly royal biscuits.', isVeg: true },
      { name: 'Zafrani Irani Chai & Khari Puff', price: 60, description: 'Saffron-infused rich tea with buttery crisp layers.', isVeg: true }
    ]
  },
  {
    id: 'rest-shadab',
    name: 'Hotel Shadab (Authentic Nizami Kitchen)',
    city: 'Hyderabad',
    address: 'Plot 21, Madina Circle, High Court Road, Ghansi Bazaar, Hyderabad 500002',
    location: { lat: 17.3665, lng: 78.4735 },
    cuisine: ['Hyderabadi Biryani', 'Mutton Haleem', 'Kebabs', 'Nizami Curries'],
    checkinCount: 198000,
    weeklyCheckins: 5200,
    footfallRank: 2,
    priceForTwo: 650,
    status: 'verified',
    openingHours: '06:00 AM - 02:00 AM',
    seatingCapacity: 180,
    tags: ['Royal Biryani', 'Late Night', 'Must Visit', 'Generous Portions'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Shadab+Hyderabad',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 500,
    famousDishes: [
      { name: 'Mutton Special Dum Biryani', price: 380, description: 'Slow-cooked in heavy copper deg with fragrant basmati and tender meat.', isVeg: false },
      { name: 'Shadab Chicken 65 (Authentic spicy red)', price: 290, description: 'Tossed with green chillies, curry leaves, and secret masala.', isVeg: false },
      { name: 'Mirchi ka Salan & Dahi Chutney Thali', price: 160, description: 'Peanut-sesame roasted pepper gravy and chilled raita.', isVeg: true }
    ]
  },
  {
    id: 'rest-chutneys',
    name: 'Chutneys Traditional South Indian',
    city: 'Hyderabad',
    address: 'Road No 1, Banjara Hills / Old City Outpost, Hyderabad 500034',
    location: { lat: 17.3601, lng: 78.4690 },
    cuisine: ['South Indian', 'Guntur Idli', 'Babai Dosa', 'Pure Vegetarian'],
    checkinCount: 145000,
    weeklyCheckins: 3800,
    footfallRank: 3,
    priceForTwo: 500,
    status: 'verified',
    openingHours: '07:00 AM - 11:00 PM',
    seatingCapacity: 120,
    tags: ['Pure Veg', '6 Signature Chutneys', 'Family Friendly', 'Clean & Hygienic'],
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chutneys+Restaurant+Hyderabad',
    diningVoucherDiscountPercent: 12,
    diningVoucherPrice: 400,
    famousDishes: [
      { name: 'Babai Ghee Butter Dosa with 6 Chutneys', price: 185, description: 'Crispy fermented crepe dolloped with white home churned butter.', isVeg: true },
      { name: 'Steaming Guntur Idli with Gunpowder Podi', price: 130, description: 'Soft fluffy steamed rice cakes tossed in spiced lentil oil.', isVeg: true },
      { name: 'South Indian Filter Coffee', price: 65, description: 'Frothy chicory brew served in traditional brass dabarah.', isVeg: true }
    ]
  },
  {
    id: 'rest-golconda-dhaba',
    name: 'Fort Heritage Courtyard Dhaba',
    city: 'Hyderabad',
    address: 'Outside Fateh Darwaza, Golconda Fort Enclave, Hyderabad 500008',
    location: { lat: 17.3820, lng: 78.4035 },
    cuisine: ['Deccani Cuisine', 'Tandoori Platters', 'Bajara Rotis', 'Lassi'],
    checkinCount: 88000,
    weeklyCheckins: 2100,
    footfallRank: 1,
    priceForTwo: 480,
    status: 'verified',
    openingHours: '11:00 AM - 11:00 PM',
    seatingCapacity: 90,
    tags: ['Open Air', 'Fort Bastion View', 'Live Tandoor', 'Local Refreshments'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fort+Heritage+Dhaba+Golconda',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 350,
    famousDishes: [
      { name: 'Deccani Mutton Kebab Skewers', price: 310, description: 'Charcoal grilled kebabs rubbed in mint, raw papaya, and roasted garam masala.', isVeg: false },
      { name: 'Paneer Angara Tikka Platter', price: 240, description: 'Smoky spiced cottage cheese with mint yoghurt relish.', isVeg: true }
    ]
  },
  {
    id: 'rest-warangal-spices',
    name: 'Kakatiya Ruchulu (Telangana Spice Kitchen)',
    city: 'Warangal',
    address: 'Near Thousand Pillar Temple Arc, Hanamkonda, Warangal 506001',
    location: { lat: 17.9792, lng: 79.5930 },
    cuisine: ['Telangana Traditional', 'Sarva Pindi', 'Natu Kodi Pulusu', 'Country Chicken'],
    checkinCount: 64000,
    weeklyCheckins: 1750,
    footfallRank: 1,
    priceForTwo: 420,
    status: 'verified',
    openingHours: '11:30 AM - 10:30 PM',
    seatingCapacity: 75,
    tags: ['Authentic Regional', 'Clay Pot Cooking', 'UNESCO Proximity'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kakatiya+Ruchulu+Warangal',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 300,
    famousDishes: [
      { name: 'Crispy Sarva Pindi with Chutney', price: 110, description: 'Pan-baked spiced rice flour pancake embedded with peanuts and chana dal.', isVeg: true },
      { name: 'Telangana Natu Kodi Country Chicken Curry', price: 290, description: 'Slow cooked in stone mortar spices and fiery red chilies.', isVeg: false }
    ]
  },
  {
    id: 'rest-tunday-chowk',
    name: 'Tunday Kababi (Chowk Original Since 1905)',
    city: 'Lucknow',
    address: '168/6 Phool Wali Gali, Chowk, Lucknow, Uttar Pradesh 226003',
    location: { lat: 26.8670, lng: 80.9140 },
    cuisine: ['Awadhi Kebabs', 'Mughlai', 'Galouti Kebab', 'Sheermal'],
    checkinCount: 245000,
    weeklyCheckins: 6800,
    footfallRank: 1,
    priceForTwo: 350,
    status: 'verified',
    openingHours: '11:00 AM - 11:30 PM',
    seatingCapacity: 80,
    tags: ['Legendary 1905', 'Melt-in-Mouth', 'Galouti Kebabs', 'UNESCO Heritage Vibe'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tunday+Kababi+Chowk+Lucknow',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 300,
    famousDishes: [
      { name: 'Original Galouti Kebab (Plate of 4)', price: 160, description: 'Legendary recipe made with 160 aromatic herbs; dissolves effortlessly on the palate.', isVeg: false },
      { name: 'Ulte Tawe Ka Mughlai Paratha', price: 45, description: 'Crisp layered flaky saffron bread baked on inverted cast iron dome.', isVeg: true },
      { name: 'Awadhi Mutton Korma & Sheermal', price: 220, description: 'Rich saffron cashew gravy with warm fragrant bread.', isVeg: false }
    ]
  },
  {
    id: 'rest-dastarkhwan-hazratganj',
    name: 'Dastarkhwan (Traditional Awadhi Kitchen)',
    city: 'Lucknow',
    address: '29 BN Road, Near Tulsi Theatre, Lalbagh / Hazratganj, Lucknow 226001',
    location: { lat: 26.8530, lng: 80.9430 },
    cuisine: ['Awadhi Biryani', 'Chicken Masala', 'Mutton Boti', 'Shahi Tukda'],
    checkinCount: 185000,
    weeklyCheckins: 4900,
    footfallRank: 2,
    priceForTwo: 600,
    status: 'verified',
    openingHours: '12:30 PM - 11:00 PM',
    seatingCapacity: 110,
    tags: ['Signature Dum Biryani', 'Family Dining', 'Rich Gravies'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dastarkhwan+Lucknow',
    diningVoucherDiscountPercent: 15,
    diningVoucherPrice: 450,
    famousDishes: [
      { name: 'Awadhi Mutton Dum Biryani', price: 340, description: 'Fragrant long-grain basmati sealed in clay deg with tender marinated mutton.', isVeg: false },
      { name: 'Chicken Masala Dastarkhwan Special', price: 280, description: 'Silky rich brown onion and yogurt gravy simmered overnight.', isVeg: false },
      { name: 'Zafrani Shahi Tukda with Rabri', price: 120, description: 'Crisp ghee-fried bread steeped in cardamom syrup and thick condensed milk.', isVeg: true }
    ]
  },
  {
    id: 'rest-royal-cafe-hazratganj',
    name: 'Royal Cafe (Originator of Basket Chaat)',
    city: 'Lucknow',
    address: '51 Hazratganj, Opposite Halwasiya Market, Lucknow 226001',
    location: { lat: 26.8505, lng: 80.9450 },
    cuisine: ['Street Chaat', 'Basket Chaat', 'North Indian', 'Kulfi Falooda'],
    checkinCount: 162000,
    weeklyCheckins: 4200,
    footfallRank: 3,
    priceForTwo: 400,
    status: 'verified',
    openingHours: '11:00 AM - 11:00 PM',
    seatingCapacity: 95,
    tags: ['World-Famous Basket Chaat', 'Hazratganj Heart', 'Vegetarian Delights'],
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1000&q=80',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Royal+Cafe+Hazratganj+Lucknow',
    diningVoucherDiscountPercent: 12,
    diningVoucherPrice: 300,
    famousDishes: [
      { name: 'Monster Basket Chaat (Tokri Chaat)', price: 240, description: 'Deep fried crispy potato basket filled with sprouts, papdi, yoghurt, chutneys, and pomegranate.', isVeg: true },
      { name: 'Lucknawi Matar Chaat with Ghee', price: 110, description: 'White peas simmered in dry ginger, roasted cumin, and pure cow butter.', isVeg: true }
    ]
  }
];

export const INITIAL_GUIDES: Guide[] = [
  {
    id: 'guide-rahim-khan',
    name: 'Rahim Mohammed Khan',
    languages: ['English', 'Hindi', 'Urdu', 'Telugu'],
    hourlyRate: 500,
    halfDayRate: 1500,
    fullDayRate: 2800,
    photoWalkRate: 1200,
    verificationId: 'TS-TOUR-HYD-04192',
    completedToursCount: 428,
    bio: 'Historian and storyteller with 14 years uncovering the secret underground passages, Nizami legends, and diamond vaults of the Old City.',
    specialties: ['Old City Secrets', 'Nizami Architecture', 'Culinary & Spice Trails', 'Night Photography'],
    affiliatedHotelId: null,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 98491 23456'
  },
  {
    id: 'guide-ananya-reddy',
    name: 'Ananya Reddy, M.A. Archeology',
    languages: ['English', 'Telugu', 'Hindi', 'German'],
    hourlyRate: 650,
    halfDayRate: 1800,
    fullDayRate: 3200,
    photoWalkRate: 1500,
    verificationId: 'TS-TOUR-HYD-08819',
    completedToursCount: 312,
    bio: 'Archeological researcher specializing in Golconda acoustic engineering, Kakatiya basalt masonry, and UNESCO candidate restorations.',
    specialties: ['Fort Acoustics', 'Epigraphy & Inscriptions', 'Diamond Vault Legends', 'Student Educational Tours'],
    affiliatedHotelId: 'hotel-taj-falaknuma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 97002 98765'
  },
  {
    id: 'guide-vikram-joshi',
    name: 'Vikram Joshi (Heritage Lens)',
    languages: ['English', 'Hindi', 'French'],
    hourlyRate: 700,
    halfDayRate: 2000,
    fullDayRate: 3600,
    photoWalkRate: 1800,
    verificationId: 'IND-TOUR-NAT-11029',
    completedToursCount: 519,
    bio: 'National Geographic featured travel photographer guiding tourists to frame breathtaking golden hour angles without crowds.',
    specialties: ['Golden Hour Angles', 'Bazaar Street Portraits', 'Architectural Symmetry', 'Monument Timings'],
    affiliatedHotelId: 'hotel-marigold-bazaar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 94401 54321'
  },
  {
    id: 'guide-suresh-kakatiya',
    name: 'Suresh Kumar Kakatiya',
    languages: ['English', 'Telugu', 'Hindi'],
    hourlyRate: 450,
    halfDayRate: 1200,
    fullDayRate: 2200,
    photoWalkRate: 1000,
    verificationId: 'TS-TOUR-WRG-00341',
    completedToursCount: 260,
    bio: 'Native Warangal scholar dedicated to deciphering Kakatiya dynasty inscriptions and demonstrating the acoustic musical stone pillars.',
    specialties: ['Kakatiya Dynasty History', 'Ramappa Floating Bricks', 'Temple Sculpture Iconography'],
    affiliatedHotelId: 'hotel-warangal-regency',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 98480 11223'
  },
  {
    id: 'guide-salman-qureshi',
    name: 'Dr. Salman Qureshi (ASI Licensed Awadhi Historian)',
    languages: ['English', 'Hindi', 'Urdu'],
    hourlyRate: 550,
    halfDayRate: 1600,
    fullDayRate: 3000,
    photoWalkRate: 1400,
    verificationId: 'UP-TOUR-LKO-05912',
    completedToursCount: 462,
    bio: 'Historian & researcher with 12 years guiding the secret passages of Bhool Bhulaiya, Asafi architecture, and Awadhi royal lineages.',
    specialties: ['Bhool Bhulaiya Secrets', 'Asafi Architecture', 'Nawabi Lineage', 'Old Lucknow Food Walk'],
    affiliatedHotelId: 'hotel-vivanta-lucknow',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 98390 12345'
  },
  {
    id: 'guide-zoya-mirza',
    name: 'Zoya Mirza (Chikan Craft & Old City Cultural Curator)',
    languages: ['English', 'Hindi', 'Urdu', 'French'],
    hourlyRate: 600,
    halfDayRate: 1700,
    fullDayRate: 3200,
    photoWalkRate: 1500,
    verificationId: 'UP-TOUR-LKO-07841',
    completedToursCount: 388,
    bio: 'Artisan textile researcher and cultural custodian specializing in Chowk handicraft guilds, Zardozi embroidery, and Nawabi culinary trails.',
    specialties: ['Chikan Embroidery Guilds', 'Chowk Culinary Trails', 'Rumi Darwaza Twilight', 'Tunday Kebab Heritage'],
    affiliatedHotelId: 'hotel-clarks-awadh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    badgeVerified: true,
    phone: '+91 94500 67890'
  }
];
