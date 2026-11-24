import type { Locale } from '@/i18n/config';

const en = {
  heroTitle: 'Luxury Apartments in Tel Aviv',
  viewAria: (title: string) => `View ${title}`,
  cards: {
    'penthouse-jacuzzi': {
      title: 'Luxury Penthouse',
      location: 'Kerem HaTeimanim, Tel Aviv',
      description:
        'This unique penthouse is perfect for both friendly or family stays equipped with amenities like the jacuzzi and barbecue, and live an unforgettable experience in a special place.',
    },
    'cozy-studio': {
      title: 'Spacious & Cosy Apartment',
      location: 'Kerem HaTeimanim, Tel Aviv',
      description:
        'This renovated apartment is perfect for short and medium term stays. Fully equipped and located a short walk from the beach, Carmel Market, and the entrance to Kerem HaTeimanim.',
    },
  },
  experience: {
    kicker: 'Stay Experience',
    heading: 'A more local way to stay in Tel Aviv',
    p1: "Located in Kerem HaTeimanim, our apartments combine modern comfort with the character of one of Tel Aviv's most established neighborhoods. The setting feels central and connected, yet calmer and more personal than a conventional hotel stay.",
    p2: 'Whether you are visiting for a weekend by the sea, a longer city stay, or time between business meetings and local plans, Or Hakerem offers a polished base within easy reach of the beach, the market, and the cultural center of the city.',
    onFootHeading: 'Best enjoyed on foot',
    neighborhoodHighlights: [
      'Carmel Market for local produce, cafes, and everyday Tel Aviv energy',
      'Banana Beach and the shoreline for morning walks and sunset swims',
      'Nachalat Binyamin for galleries, design, and a lively cultural scene',
      'Rothschild Boulevard and central Tel Aviv within easy reach',
    ],
    imageAlt: 'Or Hakerem apartment view in Tel Aviv',
    rating: '4.9/5',
    ratingLabel: 'Verified guest rating',
    ratingBody: 'A stay shaped by responsive hosting, strong reviews, and a location guests return to.',
  },
  directBanner: 'Booking directly with us is up to 15% cheaper than platforms!',
  included: {
    kicker: 'Included in Every Stay',
    heading: 'Thoughtful essentials, consistently delivered',
    highlights: [
      {
        title: 'High-speed WiFi',
        description: 'Reliable connectivity for work, planning, and longer stays in the city.',
      },
      {
        title: 'Fully equipped kitchens',
        description: 'Thoughtful essentials for breakfast at home, relaxed evenings, or extended visits.',
      },
      {
        title: 'Secure, private setting',
        description: 'A calm and well-kept address in one of central Tel Aviv’s most characterful neighborhoods.',
      },
      {
        title: 'Responsive hosting',
        description: 'Fast communication before arrival and attentive support throughout the stay.',
      },
    ],
  },
  landmarks: {
    kicker: 'Nearby Landmarks',
    heading: 'Prime location in Tel Aviv',
    items: [
      { name: 'Carmel Market', distance: '400m' },
      { name: 'Banana Beach', distance: '600m' },
      { name: 'Nachalat Binyamin', distance: '450m' },
    ],
  },
  platforms: {
    kicker: 'Also Available On',
    heading: 'Our listings on different platforms',
    body: 'Find us on the platforms you trust. Remember, booking directly with us is up to 15% cheaper.',
    penthouseAvailability: 'Available on Airbnb and Booking.com',
    studioAvailability: 'Available on Airbnb',
    viewOnAirbnb: 'View on Airbnb',
    viewOnBooking: 'View on Booking.com',
  },
  beach45: {
    kicker: 'Managed by 45Beach',
    heading: 'The 45Beach studios',
    body: 'Or Hakerem is managed by 45Beach. Discover its studios at 45 HaYarkon Street, one minute from the beach: each card opens the listing on 45beach.com.',
    viewAria: (name: string) => `View ${name} on 45beach.com`,
    guests: 'Guests',
    beds: 'Beds',
    size: 'Size',
    comingSoon: 'Coming soon',
    airbnb: 'Airbnb',
    booking: 'Booking.com',
    allListings: 'See all studios on 45beach.com',
  },
};

export type PropertiesMessages = typeof en;

const fr: PropertiesMessages = {
  heroTitle: 'Appartements de luxe à Tel Aviv',
  viewAria: (title: string) => `Voir ${title}`,
  cards: {
    'penthouse-jacuzzi': {
      title: 'Penthouse de luxe',
      location: 'Kerem HaTeimanim, Tel Aviv',
      description:
        'Ce penthouse unique est parfait pour des séjours entre amis ou en famille, équipé de prestations comme le jacuzzi et le barbecue, pour vivre une expérience inoubliable dans un lieu à part.',
    },
    'cozy-studio': {
      title: 'Appartement spacieux et chaleureux',
      location: 'Kerem HaTeimanim, Tel Aviv',
      description:
        "Cet appartement rénové est parfait pour les séjours courts et moyens. Entièrement équipé, il se trouve à quelques minutes à pied de la plage, du marché du Carmel et de l'entrée de Kerem HaTeimanim.",
    },
  },
  experience: {
    kicker: "L'expérience du séjour",
    heading: 'Une façon plus locale de séjourner à Tel Aviv',
    p1: "Situés à Kerem HaTeimanim, nos appartements allient confort moderne et caractère de l'un des quartiers les plus authentiques de Tel Aviv. Un cadre central et connecté, mais plus calme et plus personnel qu'un séjour à l'hôtel classique.",
    p2: "Que vous veniez pour un week-end au bord de la mer, un séjour urbain prolongé ou entre deux rendez-vous professionnels, Or Hakerem offre un pied-à-terre soigné, tout près de la plage, du marché et du cœur culturel de la ville.",
    onFootHeading: 'À savourer à pied',
    neighborhoodHighlights: [
      'Le marché du Carmel pour les produits locaux, les cafés et l’énergie quotidienne de Tel Aviv',
      'Banana Beach et le littoral pour les promenades matinales et les baignades au coucher du soleil',
      'Nachalat Binyamin pour les galeries, le design et une scène culturelle animée',
      'Le boulevard Rothschild et le centre de Tel Aviv à portée de main',
    ],
    imageAlt: "Vue depuis un appartement Or Hakerem à Tel Aviv",
    rating: '4,9/5',
    ratingLabel: 'Note vérifiée des voyageurs',
    ratingBody: 'Un séjour porté par un accueil réactif, d’excellents avis et un emplacement où les voyageurs reviennent.',
  },
  directBanner: "Réserver en direct avec nous coûte jusqu'à 15 % moins cher que les plateformes !",
  included: {
    kicker: 'Inclus dans chaque séjour',
    heading: "L'essentiel pensé pour vous, à chaque fois",
    highlights: [
      {
        title: 'WiFi haut débit',
        description: 'Une connexion fiable pour travailler, organiser et prolonger votre séjour en ville.',
      },
      {
        title: 'Cuisines entièrement équipées',
        description: 'Tout le nécessaire pour les petits-déjeuners à la maison, les soirées tranquilles ou les longs séjours.',
      },
      {
        title: 'Cadre sûr et privé',
        description: "Une adresse calme et bien tenue dans l'un des quartiers les plus attachants du centre de Tel Aviv.",
      },
      {
        title: 'Un hôte réactif',
        description: "Une communication rapide avant l'arrivée et un accompagnement attentif pendant tout le séjour.",
      },
    ],
  },
  landmarks: {
    kicker: 'Points d’intérêt à proximité',
    heading: 'Un emplacement de choix à Tel Aviv',
    items: [
      { name: 'Marché du Carmel', distance: '400 m' },
      { name: 'Banana Beach', distance: '600 m' },
      { name: 'Nachalat Binyamin', distance: '450 m' },
    ],
  },
  platforms: {
    kicker: 'Également disponible sur',
    heading: 'Nos annonces sur les différentes plateformes',
    body: 'Retrouvez-nous sur les plateformes que vous connaissez. Et rappelez-vous : réserver en direct coûte jusqu’à 15 % moins cher.',
    penthouseAvailability: 'Disponible sur Airbnb et Booking.com',
    studioAvailability: 'Disponible sur Airbnb',
    viewOnAirbnb: 'Voir sur Airbnb',
    viewOnBooking: 'Voir sur Booking.com',
  },
  beach45: {
    kicker: 'Géré par 45Beach',
    heading: 'Les studios 45Beach',
    body: 'Or Hakerem est gérée par 45Beach. Découvrez ses studios au 45 rue HaYarkon, à une minute de la plage : chaque fiche ouvre l’annonce sur 45beach.com.',
    viewAria: (name: string) => `Voir ${name} sur 45beach.com`,
    guests: 'Voyageurs',
    beds: 'Lits',
    size: 'Surface',
    comingSoon: 'Bientôt disponible',
    airbnb: 'Airbnb',
    booking: 'Booking.com',
    allListings: 'Voir tous les studios sur 45beach.com',
  },
};

const he: PropertiesMessages = {
  heroTitle: 'דירות יוקרה בתל אביב',
  viewAria: (title: string) => `לצפייה ב${title}`,
  cards: {
    'penthouse-jacuzzi': {
      title: 'פנטהאוז יוקרה',
      location: 'כרם התימנים, תל אביב',
      description:
        'פנטהאוז ייחודי, מושלם לשהות עם חברים או משפחה, מאובזר בג׳קוזי ובמנגל — חוויה בלתי נשכחת במקום מיוחד.',
    },
    'cozy-studio': {
      title: 'דירה מרווחת ונעימה',
      location: 'כרם התימנים, תל אביב',
      description:
        'דירה משופצת, מושלמת לשהות קצרה או בינונית. מאובזרת במלואה וממוקמת במרחק הליכה קצר מהים, משוק הכרמל ומהכניסה לכרם התימנים.',
    },
  },
  experience: {
    kicker: 'חוויית האירוח',
    heading: 'דרך מקומית יותר לגור בתל אביב',
    p1: 'הדירות שלנו בכרם התימנים משלבות נוחות מודרנית עם האופי של אחת השכונות הוותיקות של תל אביב. מיקום מרכזי ומחובר, אבל רגוע ואישי יותר משהות במלון רגיל.',
    p2: 'בין אם אתם מגיעים לסוף שבוע ליד הים, לשהות עירונית ארוכה יותר או בין פגישות עבודה לתוכניות מקומיות — אור הכרם מציע בסיס מוקפד, קרוב לים, לשוק וללב התרבותי של העיר.',
    onFootHeading: 'הכי כיף ברגל',
    neighborhoodHighlights: [
      'שוק הכרמל לתוצרת מקומית, בתי קפה והאנרגיה היומיומית של תל אביב',
      'חוף בננה ביץ׳ והטיילת להליכות בוקר ושחיית שקיעה',
      'נחלת בנימין לגלריות, עיצוב וסצנה תרבותית תוססת',
      'שדרות רוטשילד ומרכז תל אביב במרחק נגיעה',
    ],
    imageAlt: 'נוף מדירת אור הכרם בתל אביב',
    rating: '4.9/5',
    ratingLabel: 'דירוג אורחים מאומת',
    ratingBody: 'שהות שמבוססת על אירוח קשוב, ביקורות מעולות ומיקום שאורחים חוזרים אליו.',
  },
  directBanner: 'הזמנה ישירה אצלנו זולה עד 15% מהפלטפורמות!',
  included: {
    kicker: 'כלול בכל שהות',
    heading: 'כל מה שחשוב, בסטנדרט קבוע',
    highlights: [
      {
        title: 'WiFi מהיר',
        description: 'חיבור אמין לעבודה, לתכנון ולשהיות ארוכות בעיר.',
      },
      {
        title: 'מטבחים מאובזרים במלואם',
        description: 'כל מה שצריך לארוחת בוקר בבית, לערבים רגועים או לביקורים ממושכים.',
      },
      {
        title: 'סביבה בטוחה ופרטית',
        description: 'כתובת שקטה ומטופחת באחת השכונות המיוחדות של מרכז תל אביב.',
      },
      {
        title: 'אירוח קשוב',
        description: 'תקשורת מהירה לפני ההגעה וליווי אישי לאורך כל השהות.',
      },
    ],
  },
  landmarks: {
    kicker: 'נקודות עניין בסביבה',
    heading: 'מיקום מנצח בתל אביב',
    items: [
      { name: 'שוק הכרמל', distance: '400 מ׳' },
      { name: 'בננה ביץ׳', distance: '600 מ׳' },
      { name: 'נחלת בנימין', distance: '450 מ׳' },
    ],
  },
  platforms: {
    kicker: 'זמין גם ב',
    heading: 'המודעות שלנו בפלטפורמות השונות',
    body: 'תמצאו אותנו בפלטפורמות שאתם מכירים. וזכרו — הזמנה ישירה אצלנו זולה עד 15%.',
    penthouseAvailability: 'זמין ב-Airbnb וב-Booking.com',
    studioAvailability: 'זמין ב-Airbnb',
    viewOnAirbnb: 'לצפייה ב-Airbnb',
    viewOnBooking: 'לצפייה ב-Booking.com',
  },
  beach45: {
    kicker: 'בניהול 45Beach',
    heading: 'הסטודיואים של 45Beach',
    body: 'אור הכרם מנוהלת על ידי 45Beach. גלו את הסטודיואים שלה ברחוב הירקון 45, דקה מהחוף: כל כרטיס פותח את המודעה באתר 45beach.com.',
    viewAria: (name: string) => `לצפייה ב${name} באתר 45beach.com`,
    guests: 'אורחים',
    beds: 'מיטות',
    size: 'שטח',
    comingSoon: 'בקרוב',
    airbnb: 'Airbnb',
    booking: 'Booking.com',
    allListings: 'לכל הסטודיואים באתר 45beach.com',
  },
};

export const propertiesMessages: Record<Locale, PropertiesMessages> = { en, fr, he };
