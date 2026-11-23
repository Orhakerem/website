import type { Locale } from '@/i18n/config';
import type { SiteVideo } from '@/lib/site-schema';
import { localizeVideo, type VideoDefinition } from '@/lib/site-videos';

export type EventVideo = SiteVideo & {
  slug: string;
  /** Muted loop played inside the card; `contentPath` is the full clip. */
  previewPath: string;
};

type EventVideoDefinition = Pick<
  VideoDefinition,
  'name' | 'description' | 'uploadDate' | 'duration'
> & { slug: string };

const UPLOAD_DATE = '2026-11-22T12:00:00+02:00';

/** Display order. Files are produced by `scripts/build-event-videos.mjs`. */
const EVENT_VIDEOS: readonly EventVideoDefinition[] = [
  {
    slug: 'rooftop-by-night',
    uploadDate: UPLOAD_DATE,
    duration: 'PT18S',
    name: {
      en: 'The rooftop by night',
      fr: 'Le rooftop de nuit',
      he: 'הגג בלילה',
    },
    description: {
      en: 'Drone view of an evening event on the Or Hakerem rooftop in Tel Aviv, lit by string lights.',
      fr: "Vue par drone d'une soirée sur le rooftop d'Or Hakerem à Tel Aviv, éclairé par des guirlandes lumineuses.",
      he: 'מבט מרחפן על אירוע ערב בגג של אור הכרם בתל אביב, מואר בשרשראות אור.',
    },
  },
  {
    slug: 'daytime-reception',
    uploadDate: UPLOAD_DATE,
    duration: 'PT5S',
    name: {
      en: 'Daytime reception',
      fr: 'Réception en journée',
      he: 'קבלת פנים בשעות היום',
    },
    description: {
      en: 'Guests around long tables and a buffet during a daytime reception on the Or Hakerem terrace.',
      fr: "Des invités autour de grandes tables et d'un buffet lors d'une réception en journée sur la terrasse d'Or Hakerem.",
      he: 'אורחים סביב שולחנות ארוכים ומזנון בקבלת פנים בשעות היום במרפסת של אור הכרם.',
    },
  },
  {
    slug: 'string-lights-party',
    uploadDate: UPLOAD_DATE,
    duration: 'PT5S',
    name: {
      en: 'Party under the lights',
      fr: 'Soirée sous les guirlandes',
      he: 'מסיבה תחת האורות',
    },
    description: {
      en: 'An evening party under the pergola lights on the Or Hakerem rooftop in Tel Aviv.',
      fr: "Une soirée sous les lumières de la pergola, sur le rooftop d'Or Hakerem à Tel Aviv.",
      he: 'מסיבת ערב תחת אורות הפרגולה בגג של אור הכרם בתל אביב.',
    },
  },
  {
    slug: 'family-ceremony',
    uploadDate: UPLOAD_DATE,
    duration: 'PT7S',
    name: {
      en: 'Family ceremony',
      fr: 'Cérémonie familiale',
      he: 'טקס משפחתי',
    },
    description: {
      en: 'A ceremonial chair and guests gathered for a family celebration on the Or Hakerem terrace.',
      fr: "Un fauteuil de cérémonie et des invités réunis pour une fête familiale sur la terrasse d'Or Hakerem.",
      he: 'כיסא טקסי ואורחים שהתכנסו לחגיגה משפחתית במרפסת של אור הכרם.',
    },
  },
  {
    slug: 'buffet-barbecue',
    uploadDate: UPLOAD_DATE,
    duration: 'PT8S',
    name: {
      en: 'Buffet and barbecue',
      fr: 'Buffet et barbecue',
      he: 'מזנון וברביקיו',
    },
    description: {
      en: 'A buffet lunch and barbecue on the Or Hakerem terrace in Tel Aviv.',
      fr: "Un déjeuner buffet et barbecue sur la terrasse d'Or Hakerem à Tel Aviv.",
      he: 'ארוחת צהריים עם מזנון וברביקיו במרפסת של אור הכרם בתל אביב.',
    },
  },
  {
    slug: 'dj-sunset-session',
    uploadDate: UPLOAD_DATE,
    duration: 'PT20S',
    name: {
      en: 'DJ set at sunset',
      fr: 'Set DJ au coucher du soleil',
      he: 'סט די-ג׳יי בשקיעה',
    },
    description: {
      en: 'A DJ set on the Or Hakerem rooftop in Tel Aviv, from sunset into the night, with views over the city.',
      fr: "Un set DJ sur le rooftop d'Or Hakerem à Tel Aviv, du coucher du soleil à la nuit, avec vue sur la ville.",
      he: 'סט די-ג׳יי בגג של אור הכרם בתל אביב, מהשקיעה ועד הלילה, עם נוף לעיר.',
    },
  },
  {
    slug: 'dj-rooftop-drone',
    uploadDate: UPLOAD_DATE,
    duration: 'PT25S',
    name: {
      en: 'The rooftop from above',
      fr: 'Le rooftop vu du ciel',
      he: 'הגג ממעוף הציפור',
    },
    description: {
      en: 'Drone footage flying in over Kerem HaTeimanim to a DJ set on the Or Hakerem rooftop at dusk.',
      fr: "Un drone survole le Kerem HaTeimanim jusqu'à un set DJ sur le rooftop d'Or Hakerem, au crépuscule.",
      he: 'רחפן חולף מעל כרם התימנים אל סט די-ג׳יי בגג של אור הכרם בשעת בין ערביים.',
    },
  },
];

export function getEventVideos(locale: Locale): EventVideo[] {
  return EVENT_VIDEOS.map(({ slug, ...definition }) => ({
    ...localizeVideo(
      {
        ...definition,
        contentPath: `/videos/events/${slug}.mp4`,
        thumbnailPath: `/videos/events/${slug}.webp`,
      },
      locale,
    ),
    slug,
    previewPath: `/videos/events/${slug}-preview.mp4`,
  }));
}
