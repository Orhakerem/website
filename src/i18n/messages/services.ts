import type { Locale } from '@/i18n/config';

const en = {
  hero: {
    titleLine1: 'Premium Concierge',
    titleLine2: 'Services',
    body: 'Our dedicated concierge team provides impeccable service tailored to your every need. Experience the ultimate in personalized luxury during your stay.',
    pills: ['24/7 Available', 'Personalized Service', 'Expert Team'],
  },
  grid: {
    titleLine1: 'Tailored to Your',
    titleLine2: 'Every Need',
    subheading: 'Discover our comprehensive range of luxury services designed to exceed your expectations',
  },
  services: [
    {
      title: 'Grocery Delivery',
      description: 'We offer delivery during your stay on demand and even before check-in.',
    },
    {
      title: 'Transportation',
      description: 'Private cars with professional drivers and airport or city-to-city transfers.',
    },
    {
      title: 'Baby Sitting',
      description: 'Certified childcare professionals available 24/7 for your complete peace of mind.',
    },
    {
      title: 'Event Planning',
      description: 'Access to events and private celebrations with meticulous attention to every detail.',
    },
    {
      title: 'Cleaning on Demand',
      description:
        'We offer cleaning services during your stay, provided by a professional team that will not interfere with your time in the apartment.',
    },
    {
      title: 'Dining Reservation',
      description:
        'Experience the finest culinary destinations with our restaurant reservation service. We secure tables at the most sought-after establishments.',
    },
  ],
  contact: {
    heading: 'Request Concierge Services',
    subheading: 'Available 24/7 to fulfill your every request',
    inquire: 'Inquire about services',
    successTitle: 'Thank you for your inquiry!',
    successBody: 'Our concierge team will get back to you within 2 hours.',
    sendAnother: 'Send Another Request',
  },
  form: {
    title: 'Concierge Service Inquiry',
    subtitle: "Tell us what you need and we'll arrange it for your stay.",
    close: 'Close',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    detailsLabel: 'Service Request Details',
    detailsPlaceholder: 'Please describe the concierge service you need...',
    cancel: 'Cancel',
    sending: 'Sending...',
    submit: 'Submit Request',
    success: 'Your concierge request has been sent successfully!',
    error: 'Failed to send request. Please try again.',
    messagePrefix: 'Concierge Service Request: ',
  },
};

export type ServicesMessages = typeof en;

const fr: ServicesMessages = {
  hero: {
    titleLine1: 'Conciergerie',
    titleLine2: 'premium',
    body: "Notre équipe de conciergerie dédiée offre un service impeccable, adapté à chacun de vos besoins. Vivez le summum du luxe personnalisé pendant votre séjour.",
    pills: ['Disponible 24/7', 'Service personnalisé', 'Équipe experte'],
  },
  grid: {
    titleLine1: 'Adapté à',
    titleLine2: 'chacun de vos besoins',
    subheading: 'Découvrez notre gamme complète de services de luxe conçus pour dépasser vos attentes',
  },
  services: [
    {
      title: 'Livraison de courses',
      description: "Nous proposons une livraison pendant votre séjour, sur demande et même avant votre arrivée.",
    },
    {
      title: 'Transport',
      description: 'Voitures privées avec chauffeurs professionnels et transferts aéroport ou de ville à ville.',
    },
    {
      title: "Garde d'enfants",
      description: 'Professionnels de la petite enfance certifiés, disponibles 24/7 pour votre tranquillité totale.',
    },
    {
      title: "Organisation d'événements",
      description: "Accès à des événements et célébrations privées, avec une attention méticuleuse portée à chaque détail.",
    },
    {
      title: 'Ménage à la demande',
      description:
        "Nous proposons un service de ménage pendant votre séjour, assuré par une équipe professionnelle qui ne perturbera pas votre temps dans l'appartement.",
    },
    {
      title: 'Réservation de restaurant',
      description:
        'Découvrez les meilleures adresses culinaires grâce à notre service de réservation. Nous obtenons des tables dans les établissements les plus recherchés.',
    },
  ],
  contact: {
    heading: 'Demander les services de conciergerie',
    subheading: 'Disponible 24/7 pour répondre à toutes vos demandes',
    inquire: 'Demander un service',
    successTitle: 'Merci pour votre demande !',
    successBody: 'Notre équipe de conciergerie vous répondra sous 2 heures.',
    sendAnother: 'Envoyer une autre demande',
  },
  form: {
    title: 'Demande de service de conciergerie',
    subtitle: 'Indiquez-nous vos besoins, nous nous chargeons de tout pour votre séjour.',
    close: 'Fermer',
    nameLabel: 'Votre nom',
    namePlaceholder: 'Entrez votre nom',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'votre@email.com',
    detailsLabel: 'Détails de la demande',
    detailsPlaceholder: 'Décrivez-nous le service de conciergerie dont vous avez besoin...',
    cancel: 'Annuler',
    sending: 'Envoi en cours...',
    submit: 'Envoyer la demande',
    success: 'Votre demande de conciergerie a bien été envoyée !',
    error: "Échec de l'envoi de la demande. Veuillez réessayer.",
    messagePrefix: 'Demande de service de conciergerie : ',
  },
};

const he: ServicesMessages = {
  hero: {
    titleLine1: 'שירותי קונסיירז׳',
    titleLine2: 'פרימיום',
    body: 'צוות הקונסיירז׳ המסור שלנו מספק שירות ללא רבב, מותאם לכל צורך. חוו יוקרה אישית ברמה הגבוהה ביותר במהלך השהות שלכם.',
    pills: ['זמינים 24/7', 'שירות אישי', 'צוות מומחים'],
  },
  grid: {
    titleLine1: 'מותאם',
    titleLine2: 'לכל צורך שלכם',
    subheading: 'גלו את מגוון שירותי היוקרה המקיף שלנו, שנועד לעלות על הציפיות שלכם',
  },
  services: [
    {
      title: 'משלוח קניות',
      description: 'אנחנו מציעים משלוח במהלך השהות לפי דרישה, ואפילו לפני הצ׳ק-אין.',
    },
    {
      title: 'הסעות',
      description: 'רכבים פרטיים עם נהגים מקצועיים והסעות משדה התעופה או בין ערים.',
    },
    {
      title: 'שמרטפות',
      description: 'אנשי מקצוע מוסמכים לטיפול בילדים, זמינים 24/7, לשקט נפשי מלא.',
    },
    {
      title: 'תכנון אירועים',
      description: 'גישה לאירועים וחגיגות פרטיות עם תשומת לב קפדנית לכל פרט.',
    },
    {
      title: 'ניקיון לפי דרישה',
      description: 'אנחנו מציעים שירותי ניקיון במהלך השהות, על ידי צוות מקצועי שלא יפריע לזמן שלכם בדירה.',
    },
    {
      title: 'הזמנת מסעדות',
      description: 'חוו את היעדים הקולינריים הטובים ביותר בעזרת שירות הזמנת המסעדות שלנו. אנחנו מבטיחים שולחן במקומות המבוקשים ביותר.',
    },
  ],
  contact: {
    heading: 'בקשת שירותי קונסיירז׳',
    subheading: 'זמינים 24/7 למילוי כל בקשה',
    inquire: 'בקשת שירות',
    successTitle: 'תודה על פנייתכם!',
    successBody: 'צוות הקונסיירז׳ שלנו יחזור אליכם תוך שעתיים.',
    sendAnother: 'שליחת בקשה נוספת',
  },
  form: {
    title: 'בקשת שירות קונסיירז׳',
    subtitle: 'ספרו לנו מה אתם צריכים ואנחנו נדאג לזה עבור השהות שלכם.',
    close: 'סגירה',
    nameLabel: 'השם שלכם',
    namePlaceholder: 'הכניסו את שמכם',
    emailLabel: 'כתובת אימייל',
    emailPlaceholder: 'your@email.com',
    detailsLabel: 'פרטי הבקשה',
    detailsPlaceholder: 'אנא תארו את שירות הקונסיירז׳ שאתם צריכים...',
    cancel: 'ביטול',
    sending: 'שולח...',
    submit: 'שליחת הבקשה',
    success: 'בקשת הקונסיירז׳ נשלחה בהצלחה!',
    error: 'שליחת הבקשה נכשלה. אנא נסו שוב.',
    messagePrefix: 'בקשת שירות קונסיירז׳: ',
  },
};

export const servicesMessages: Record<Locale, ServicesMessages> = { en, fr, he };
