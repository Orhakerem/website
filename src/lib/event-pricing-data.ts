import type { Locale } from '@/i18n/config';

export type VenueRental = {
  id: 'venue';
  label: string;
  price: number;
  priceSuffix: string;
  features: string[];
  highlight?: boolean;
};

export const eventVenueRentalPrice = 4500;
export const eventCleaningFee = 750;

const venueRentalByLocale: Record<Locale, VenueRental> = {
  en: {
    id: 'venue',
    label: 'Venue Rental',
    price: eventVenueRentalPrice,
    priceSuffix: '+ cleaning fee',
    features: ['Space rental only', 'Catering and service add-ons available separately'],
    highlight: true,
  },
  fr: {
    id: 'venue',
    label: 'Location du lieu',
    price: eventVenueRentalPrice,
    priceSuffix: '+ frais de ménage',
    features: ['Location de l’espace uniquement', 'Traiteur et services additionnels disponibles séparément'],
    highlight: true,
  },
  he: {
    id: 'venue',
    label: 'השכרת המקום',
    price: eventVenueRentalPrice,
    priceSuffix: '+ דמי ניקיון',
    features: ['השכרת המקום בלבד', 'קייטרינג ושירותים נוספים זמינים בנפרד'],
    highlight: true,
  },
};

export function getVenueRental(locale: Locale): VenueRental {
  return venueRentalByLocale[locale];
}
