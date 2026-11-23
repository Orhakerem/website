import type { Locale } from '@/i18n/config';
import type { SiteVideo } from '@/lib/site-schema';

type LocalizedText = Record<Locale, string>;

export type VideoDefinition = Omit<SiteVideo, 'name' | 'description'> & {
  name: LocalizedText;
  description: LocalizedText;
};

const HOME_HERO: VideoDefinition = {
  thumbnailPath: '/hero-poster.webp',
  contentPath: '/hero.mp4',
  uploadDate: '2025-05-18T19:39:49+02:00',
  duration: 'PT4S',
  name: {
    en: 'Or Hakerem — luxury apartments in Kerem HaTeimanim, Tel Aviv',
    fr: 'Or Hakerem — appartements de luxe à Kerem HaTeimanim, Tel Aviv',
    he: 'אור הכרם — דירות יוקרה בכרם התימנים, תל אביב',
  },
  description: {
    en: 'A short tour of Or Hakerem: rooftop jacuzzi, terrace and the Kerem HaTeimanim neighbourhood, minutes from the Carmel Market and the Tel Aviv beaches.',
    fr: "Un aperçu d'Or Hakerem : jacuzzi sur le toit, terrasse et le quartier de Kerem HaTeimanim, à quelques minutes du marché Carmel et des plages de Tel Aviv.",
    he: 'הצצה קצרה לאור הכרם: ג׳קוזי על הגג, מרפסת ושכונת כרם התימנים, דקות ספורות משוק הכרמל ומחופי תל אביב.',
  },
};

const EVENTS_HERO: VideoDefinition = {
  thumbnailPath: '/hero-events-2-poster.webp',
  contentPath: '/hero-events-2.mp4',
  uploadDate: '2026-07-19T17:15:19+03:00',
  duration: 'PT10S',
  name: {
    en: 'Or Hakerem — private event venue in Tel Aviv',
    fr: "Or Hakerem — lieu d'événements privés à Tel Aviv",
    he: 'אור הכרם — מקום לאירועים פרטיים בתל אביב',
  },
  description: {
    en: 'The Or Hakerem rooftop set up for private events in Tel Aviv: birthdays, celebrations and intimate gatherings above Kerem HaTeimanim.',
    fr: "Le rooftop d'Or Hakerem aménagé pour des événements privés à Tel Aviv : anniversaires, célébrations et réceptions intimes au-dessus de Kerem HaTeimanim.",
    he: 'הגג של אור הכרם ערוך לאירועים פרטיים בתל אביב: ימי הולדת, חגיגות ומפגשים אינטימיים מעל כרם התימנים.',
  },
};

export function localizeVideo(definition: VideoDefinition, locale: Locale): SiteVideo {
  return {
    ...definition,
    name: definition.name[locale],
    description: definition.description[locale],
  };
}

export const getHomeHeroVideo = (locale: Locale) => localizeVideo(HOME_HERO, locale);
export const getEventsHeroVideo = (locale: Locale) => localizeVideo(EVENTS_HERO, locale);
