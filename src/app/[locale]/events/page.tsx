import { getPropertyAvailability } from '@/lib/airbnb-calendar';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { getEventVideos } from '@/lib/event-videos';
import { getVideoStructuredData } from '@/lib/site-schema';
import { getEventsHeroVideo } from '@/lib/site-videos';

import EventsClient from './events-client';

export const dynamic = 'force-dynamic';

export default async function Events({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const penthouseAvailability = await getPropertyAvailability('penthouse-jacuzzi');
  const videos = getEventVideos(locale);
  const pagePath = localizePath(locale, '/events');
  const videoSchemas = [
    getVideoStructuredData(getEventsHeroVideo(locale), pagePath),
    ...videos.map((video) => getVideoStructuredData(video, pagePath)),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas) }}
      />
      <EventsClient
        blockedDates={penthouseAvailability.blockedDates}
        availabilityStatus={penthouseAvailability.status}
        videos={videos}
      />
    </>
  );
}
