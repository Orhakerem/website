import { createCanonicalUrl } from '@/app/seo';
import type { Locale } from '@/i18n/config';

const bioText: Record<Locale, { jobTitle: string; bio: string; connectOnLinkedIn: string }> = {
  en: {
    jobTitle: 'Founder and Host',
    bio: 'Joseph Atia is the founder of Or Hakerem, where he personally oversees everything from guest check-ins and check-outs to marketing, branding, digital, and property upkeep. An Airbnb Superhost with a perfect 10-star rating on Booking.com, Joseph grew up in the Kerem HaTeimanim neighborhood and has been welcoming travelers to Tel Aviv since 2024.',
    connectOnLinkedIn: 'Connect on LinkedIn',
  },
  fr: {
    jobTitle: 'Fondateur et hôte',
    bio: "Joseph Atia est le fondateur d'Or Hakerem, où il supervise personnellement tout, de l'accueil et du départ des voyageurs au marketing, à l'image de marque, au digital et à l'entretien des logements. Superhost Airbnb avec une note parfaite de 10 sur Booking.com, Joseph a grandi dans le quartier de Kerem HaTeimanim et accueille des voyageurs à Tel Aviv depuis 2024.",
    connectOnLinkedIn: 'Me contacter sur LinkedIn',
  },
  he: {
    jobTitle: 'מייסד ומארח',
    bio: 'ג׳וזף אטיה הוא המייסד של אור הכרם, שם הוא מפקח באופן אישי על הכול — מקבלת אורחים ופרידה מהם ועד שיווק, מיתוג, דיגיטל ותחזוקת הנכסים. סופרהוסט ב-Airbnb עם דירוג מושלם של 10 כוכבים ב-Booking.com, ג׳וזף גדל בשכונת כרם התימנים ומארח אורחים בתל אביב מאז 2024.',
    connectOnLinkedIn: 'התחברות ב-LinkedIn',
  },
};

export function getHostText(locale: Locale) {
  return bioText[locale];
}

export const HOST = {
  name: 'Joseph Atia',
  jobTitle: 'Founder and Host',
  bio: 'Joseph Atia is the founder of Or Hakerem, where he personally oversees everything from guest check-ins and check-outs to marketing, branding, digital, and property upkeep. An Airbnb Superhost with a perfect 10-star rating on Booking.com, Joseph grew up in the Kerem HaTeimanim neighborhood and has been welcoming travelers to Tel Aviv since 2024.',
  image: '/joseph-atia.jpg',
  imageAlt: 'Joseph Atia, founder and host of Or Hakerem',
  url: createCanonicalUrl('/about'),
  sameAs: ['https://www.linkedin.com/in/joseph-atia'],
} as const;
