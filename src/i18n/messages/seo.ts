import type { Locale } from '@/i18n/config';

type PageSeo = {
  title: string;
  description: string;
  keywords?: string;
};

type SeoCatalog = {
  home: PageSeo;
  about: PageSeo;
  properties: PageSeo;
  services: PageSeo;
  events: PageSeo;
  reservation: PageSeo;
  contact: PageSeo;
  faq: PageSeo;
  terms: PageSeo;
  privacy: PageSeo;
  cancellation: PageSeo;
  blog: PageSeo;
};

const en: SeoCatalog = {
  home: {
    title: 'Luxury Apartments in Tel Aviv | Or Hakerem',
    description:
      'Luxury short-term apartments in the heart of Tel Aviv. Book direct with Or Hakerem for boutique stays and attentive hosting.',
    keywords:
      'or hakerem, luxury apartments Tel Aviv, short-term rental Tel Aviv, vacation rental Tel Aviv, boutique stays Tel Aviv, luxury apartment in Tel Aviv, apartment Tel Aviv, events Tel Aviv, Kerem HaTeimanim, property management Tel Aviv, Tel Aviv accommodations',
  },
  about: {
    title: 'About Or Hakerem – Luxury Stays in Tel Aviv',
    description:
      'Discover Or Hakerem, a boutique collection of luxury short-term stays, Shabbat-friendly hospitality and events in Tel Aviv.',
    keywords:
      'About Or Hakerem, luxury apartments Tel Aviv, boutique stays Tel Aviv, Kerem HaTeimanim apartments, Shabbat friendly stays Tel Aviv, Tel Aviv luxury stay, boutique event venue Tel Aviv',
  },
  properties: {
    title: 'Luxury Apartments in Tel Aviv | Or Hakerem Properties',
    description:
      'A penthouse with private jacuzzi and a cosy studio in central Tel Aviv, both steps from the beach and Carmel Market.',
    keywords: 'luxury apartments Tel Aviv, penthouse jacuzzi Tel Aviv, studio apartment Tel Aviv, Kerem HaTeimanim properties',
  },
  services: {
    title: 'Concierge Services in Tel Aviv | Or Hakerem | Groceries, Transfers & More',
    description:
      'Grocery delivery, airport transfers, babysitting, cleaning and event planning in Tel Aviv, included on request.',
    keywords:
      'concierge services Tel Aviv, concierge Tel Aviv, concierge TLV, airport transfer Tel Aviv, grocery delivery Tel Aviv apartment, babysitting Tel Aviv, restaurant reservation Tel Aviv, event planning Tel Aviv',
  },
  events: {
    title: 'Boutique Events Tel Aviv | Jewish Celebrations & Kosher Services | Or Hakerem',
    description:
      'Host an intimate celebration in Tel Aviv: a boutique venue with optional kosher services and tailored planning.',
    keywords:
      'boutique events Tel Aviv, event space Tel Aviv, luxury venue Israel, luxury event venue Israel, Jewish events Tel Aviv, Jewish celebrations Tel Aviv, kosher services Tel Aviv, intimate events Tel Aviv, private venue Tel Aviv, bar mitzvah venue Tel Aviv, brit mila venue Tel Aviv, Or Hakerem',
  },
  reservation: {
    title: 'Book a Stay in Tel Aviv | Or Hakerem | Direct Reservation',
    description:
      'Book your Tel Aviv apartment directly with Or Hakerem. Request a clear quote for your exact dates in minutes.',
    keywords:
      'book luxury apartment Tel Aviv, direct booking Tel Aviv, reserve penthouse Tel Aviv, book studio Tel Aviv, Kerem HaTeimanim reservation, Or Hakerem booking',
  },
  contact: {
    title: 'Contact Or Hakerem | Tel Aviv Luxury Stays',
    description:
      'Reach Or Hakerem by phone, WhatsApp or email to book your stay or arrange concierge services in Tel Aviv.',
    keywords: 'contact Or Hakerem, book luxury apartment Tel Aviv, Tel Aviv rental inquiry, Kerem HaTeimanim contact, WhatsApp Or Hakerem',
  },
  faq: {
    title: 'FAQ — Booking, Location & Stay Info | Or Hakerem Tel Aviv',
    description:
      'Check-in times, location, Shabbat support, parking, cancellation policy and how to book Or Hakerem directly.',
    keywords:
      'Or Hakerem FAQ, Tel Aviv apartment questions, Kerem HaTeimanim stay, Shabbat friendly FAQ, book direct Tel Aviv, cancellation policy Or Hakerem',
  },
  terms: {
    title: 'Terms & Conditions | Or Hakerem Tel Aviv',
    description:
      'Terms and conditions for booking a stay at Or Hakerem: cancellation policy, house rules and payment terms.',
  },
  privacy: {
    title: 'Privacy Policy | Or Hakerem Tel Aviv',
    description:
      'How Or Hakerem collects and uses your personal data, the cookies we rely on, and your rights under GDPR.',
    keywords: 'Or Hakerem privacy policy, Tel Aviv rental privacy, GDPR short-term rental, personal data, cookies, data protection',
  },
  cancellation: {
    title: 'Cancellation & Refund Policy | Or Hakerem Tel Aviv',
    description:
      "Or Hakerem's cancellation and refund policy: deposit schedule, non-refundable conditions and voucher terms.",
    keywords: 'cancellation policy Tel Aviv, refund policy short-term rental, Or Hakerem booking terms, Tel Aviv apartment cancellation',
  },
  blog: {
    title: 'Tel Aviv Travel Blog | Or Hakerem',
    description:
      'Tel Aviv travel guides, neighbourhood tips and Shabbat advice from Or Hakerem, your hosts in the city centre.',
    keywords: 'Tel Aviv travel blog, Kerem HaTeimanim guide, Tel Aviv neighborhood, Shabbat Tel Aviv, things to do Tel Aviv, luxury stays Tel Aviv, Carmel Market guide',
  },
};

const fr: SeoCatalog = {
  home: {
    title: 'Appartements de luxe à Tel Aviv | Or Hakerem',
    description:
      'Appartements de luxe en courte durée au cœur de Tel Aviv. Réservez en direct avec Or Hakerem et son accueil attentif.',
    keywords:
      'appartements de luxe à Tel Aviv, location appartement Tel Aviv, voyage Tel Aviv, séjour de luxe Israël, appartement de vacances Tel Aviv, location courte durée Tel Aviv, hébergement haut de gamme Tel Aviv, Or Hakerem, Kerem HaTeimanim',
  },
  about: {
    title: 'À propos d’Or Hakerem – Séjours de luxe à Tel Aviv',
    description:
      "Découvrez Or Hakerem : séjours de luxe courte durée, accueil adapté au Shabbat et événements intimistes à Tel Aviv.",
    keywords:
      'appartements de luxe à Tel Aviv, séjour boutique Tel Aviv, hébergement haut de gamme Israël, voyage Shabbat friendly Tel Aviv, lieu événementiel Tel Aviv, à propos d’Or Hakerem, Kerem HaTeimanim',
  },
  properties: {
    title: 'Appartements de luxe à Tel Aviv | Les biens Or Hakerem',
    description:
      'Un penthouse avec jacuzzi privé et un studio chaleureux à Tel Aviv, à deux pas de la plage et du marché du Carmel.',
    keywords:
      'appartements de luxe à Tel Aviv, location vacances Tel Aviv, penthouse avec jacuzzi Tel Aviv, studio à louer Tel Aviv, appartement centre-ville Tel Aviv, biens Kerem HaTeimanim',
  },
  services: {
    title: 'Services de conciergerie à Tel Aviv | Or Hakerem | Courses, transferts et plus',
    description:
      'Courses, transferts aéroport, garde d’enfants, ménage et organisation d’événements : conciergerie sur demande.',
    keywords:
      'conciergerie Tel Aviv, services de conciergerie voyage, transfert aéroport Tel Aviv, organisation séjour Israël, garde d’enfants Tel Aviv, réservation restaurant Tel Aviv, service sur mesure Tel Aviv',
  },
  events: {
    title: 'Lieu événementiel boutique à Tel Aviv | Célébrations juives et services casher | Or Hakerem',
    description:
      'Organisez une célébration intimiste à Tel Aviv : lieu boutique, services casher optionnels et organisation sur mesure.',
    keywords:
      'événements privés Tel Aviv, salle de réception Tel Aviv, lieu de réception Israël, organisation bar mitzvah Israël, mariage Tel Aviv, événement casher Tel Aviv, lieu pour événement privé Israël, Or Hakerem',
  },
  reservation: {
    title: 'Réservez un séjour à Tel Aviv | Or Hakerem | Réservation directe',
    description:
      "Réservez votre appartement à Tel Aviv en direct avec Or Hakerem et recevez un devis clair pour vos dates.",
    keywords:
      'réserver appartement Tel Aviv, réservation directe Tel Aviv, réserver un séjour à Tel Aviv, location vacances Israël réservation, réserver penthouse Tel Aviv, Kerem HaTeimanim',
  },
  contact: {
    title: 'Contacter Or Hakerem | Séjours de luxe à Tel Aviv',
    description:
      'Contactez Or Hakerem par téléphone, WhatsApp ou e-mail pour réserver votre séjour ou vos services de conciergerie.',
    keywords: 'contacter Or Hakerem, réserver séjour Tel Aviv, agence location Tel Aviv, demande location Tel Aviv, WhatsApp Tel Aviv location',
  },
  faq: {
    title: 'FAQ — Réservation, emplacement et séjour | Or Hakerem Tel Aviv',
    description:
      "Horaires d’arrivée, emplacement, Shabbat, parking, annulation : les réponses pour réserver chez Or Hakerem.",
    keywords:
      'questions fréquentes location Tel Aviv, FAQ voyage Israël, conditions séjour Tel Aviv, politique d’annulation location, FAQ Or Hakerem',
  },
  terms: {
    title: 'Conditions Générales | Or Hakerem Tel Aviv',
    description:
      "Conditions générales de réservation chez Or Hakerem : annulation, règlement intérieur et conditions de paiement.",
  },
  privacy: {
    title: 'Politique de confidentialité | Or Hakerem Tel Aviv',
    description:
      "Quelles données personnelles Or Hakerem collecte, comment nous les utilisons, les cookies et vos droits RGPD.",
    keywords: 'politique de confidentialité, RGPD location courte durée, protection des données voyage, cookies, Or Hakerem',
  },
  cancellation: {
    title: "Politique d'annulation et de remboursement | Or Hakerem Tel Aviv",
    description:
      "Politique d’annulation et de remboursement d’Or Hakerem : acomptes, cas non remboursables et bons d’achat.",
    keywords: "politique d'annulation Tel Aviv, remboursement location Israël, conditions de réservation, Or Hakerem",
  },
  blog: {
    title: 'Blog voyage Tel Aviv | Or Hakerem',
    description:
      'Guides de voyage à Tel Aviv, conseils de quartier et informations Shabbat par Or Hakerem, vos hôtes sur place.',
    keywords: 'blog voyage Tel Aviv, guide voyage Israël, que faire à Tel Aviv, conseils voyage Tel Aviv, quartier Kerem HaTeimanim',
  },
};

const he: SeoCatalog = {
  home: {
    title: 'דירות יוקרה בתל אביב | אור הכרם',
    description: 'דירות פרימיום להשכרה לטווח קצר ושהיות בוטיקיות בתל אביב. גלו את אור הכרם בכרם התימנים לאירוח יוקרתי, אירועים ואירוח קשוב.',
    keywords: 'דירות יוקרה בתל אביב, דירות נופש בתל אביב, השכרה לטווח קצר תל אביב, כרם התימנים, לב תל אביב, 2 דקות לים, שוק הכרמל, אירוח בוטיקי תל אביב',
  },
  about: {
    title: 'אודות אור הכרם – אירוח יוקרתי בתל אביב',
    description: 'הכירו את אור הכרם: שהיות יוקרה קצרות, אירוח ידידותי לשבת ואירועים אינטימיים בכרם התימנים, בלב תל אביב.',
    keywords: 'אודות אור הכרם, דירות יוקרה כרם התימנים, לב תל אביב, אירוח ידידותי לשבת תל אביב, מקום אירועים בוטיקי, שוק הכרמל',
  },
  properties: {
    title: 'דירות יוקרה בתל אביב | הנכסים של אור הכרם',
    description: 'עיינו בדירות היוקרה שלנו בכרם התימנים, תל אביב: פנטהאוז עם ג׳קוזי פרטי וסטודיו נעים, שניהם צעדים ספורים מהים ומשוק הכרמל.',
    keywords: 'דירות יוקרה בתל אביב, פנטהאוז עם ג׳קוזי תל אביב, סטודיו להשכרה תל אביב, נכסים כרם התימנים, 2 דקות מהים, שוק הכרמל',
  },
  services: {
    title: 'שירותי קונסיירז׳ בתל אביב | אור הכרם | קניות, הסעות ועוד',
    description: 'משלוח קניות, הסעות משדה התעופה, שמרטפות, ניקיון ותכנון אירועים — שירותי קונסיירז׳ לפי דרישה.',
    keywords: 'קונסיירז׳ תל אביב, שירותי קונסיירז׳ לדירות נופש, הסעה משדה התעופה תל אביב, שמרטפות תל אביב, הזמנת מסעדות תל אביב, כרם התימנים',
  },
  events: {
    title: 'מקום אירועים בוטיקי בתל אביב | חגיגות יהודיות ושירותי כשרות | אור הכרם',
    description: 'ארחו חגיגה אינטימית בתל אביב: מקום בוטיקי עם שירותי כשרות אופציונליים ותכנון מותאם אישית.',
    keywords: 'אירועים בוטיקיים תל אביב, מקום לאירועים פרטיים תל אביב, אולם אירועים כרם התימנים, בר מצווה תל אביב, ברית מילה תל אביב, אירוע כשר תל אביב, לב תל אביב',
  },
  reservation: {
    title: 'הזמינו שהות בתל אביב | אור הכרם | הזמנה ישירה',
    description: 'הזמינו את דירת היוקרה שלכם בתל אביב ישירות מול אור הכרם וקבלו הצעת מחיר ברורה לתאריכים שלכם.',
    keywords: 'הזמנת דירה בתל אביב, הזמנה ישירה תל אביב, הזמנת פנטהאוז תל אביב, הזמנת סטודיו כרם התימנים, כרם התימנים',
  },
  contact: {
    title: 'צרו קשר עם אור הכרם | שהיות יוקרה בתל אביב',
    description: 'צרו קשר עם אור הכרם בטלפון, בוואטסאפ או באימייל להזמנת שהות או לתיאום שירותי קונסיירז׳ בתל אביב.',
    keywords: 'יצירת קשר אור הכרם, פנייה להשכרת דירה תל אביב, וואטסאפ תל אביב, כרם התימנים',
  },
  faq: {
    title: 'שאלות נפוצות — הזמנה, מיקום ושהות | אור הכרם תל אביב',
    description: 'שעות צ׳ק-אין, מיקום, תמיכה לשבת, חניה ומדיניות ביטולים — כל התשובות להזמנה ישירה באור הכרם.',
    keywords: 'שאלות נפוצות השכרת דירה, שאלות על שהות בתל אביב, מדיניות ביטולים, כרם התימנים',
  },
  terms: {
    title: 'תנאי שימוש | אור הכרם תל אביב',
    description: 'עיינו בתנאי השימוש להזמנת שהות באור הכרם בתל אביב, כולל מדיניות ביטולים, כללי הבית, תנאי תשלום ואחריות האורח.',
  },
  privacy: {
    title: 'מדיניות פרטיות | אור הכרם תל אביב',
    description: 'אילו נתונים אישיים אור הכרם אוסף, כיצד אנו משתמשים בהם, אילו עוגיות אנו מפעילים ומהן זכויותיכם.',
    keywords: 'מדיניות פרטיות, הגנת מידע אישי, עוגיות אתר, אור הכרם',
  },
  cancellation: {
    title: 'מדיניות ביטולים והחזרים | אור הכרם תל אביב',
    description: 'קראו את מדיניות הביטולים וההחזרים של אור הכרם לשהיות קצרות בתל אביב, כולל לוח מקדמות, מקרים ללא החזר ותנאי שוברים.',
    keywords: 'מדיניות ביטולים תל אביב, החזר כספי השכרת דירה, תנאי הזמנה, אור הכרם',
  },
  blog: {
    title: 'בלוג טיולים תל אביב | אור הכרם',
    description: 'מדריכי טיולים לתל אביב, טיפים על השכונה וייעוץ ידידותי לשבת מאור הכרם — המארחים שלכם בעיר.',
    keywords: 'בלוג טיולים תל אביב, מדריך כרם התימנים, מה לעשות בתל אביב, טיולים בשבת תל אביב, שוק הכרמל מדריך',
  },
};

export const seoMessages: Record<Locale, SeoCatalog> = { en, fr, he };
