'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

import { useLocale } from '@/i18n/useLocale';
import { homeMessages } from '@/i18n/messages/home';
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/business-schema';

const reviewPlatforms = [
  { name: 'Airbnb', src: '/logo/airbnb.svg', href: 'https://he.airbnb.com/users/show/464026460' },
  {
    name: 'Booking.com',
    src: '/logo/booking.svg',
    href: 'https://www.booking.com/hotel/il/penthouse-with-jacuzzi-bbq-2mn-from-sea-or-hakerem.fr.html?label=gen173bo-10CAsoakIycGVudGhvdXNlLXdpdGgtamFjdXp6aS1iYnEtMm1uLWZyb20tc2VhLW9yLWhha2VyZW1IM1gDaGqIAQGYATO4AQfIAQzYAQPoAQH4AQGIAgGYAgaoAgG4ArzUsNAGwAIB0gIkODQ1YTJkYmItOWI2NS00YWUwLTg4ZGEtNGUwMGJiNTAyMjZl2AIB4AIB&sid=d76cf1f6818f7b442a6ed091d7429070&dist=0&keep_landing=1&sb_price_type=total&type=total&',
  },
  {
    name: 'Google',
    src: '/logo/google.svg',
    href: GOOGLE_BUSINESS_PROFILE_URL,
  },
];

interface Testimonial {
  name: string;
  rating: number;
  date: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Amin',
    rating: 5,
    date: 'February 2026',
    text: 'Great view of the city from this rooftop penthouse. The beach is literally right there and I was able to walk to many of my favorite places. 5 stars.',
  },
  {
    name: 'Idan',
    rating: 5,
    date: 'September 2025',
    text: 'היה מעולה נהנו מכל רגע יוסף היה אדיב מאוד והתקשורת הייתה מצוינת ממליץ בחום !',
  },
  {
    name: 'Ruben',
    rating: 5,
    date: 'February 2026',
    text: 'Great location, clean and easy to access. EXCELLENT AND FAST COMMUNICATION.',
  },
  {
    name: 'Marina',
    rating: 5,
    date: 'February 2026',
    text: 'Beautiful charming apartment at the heart of Shuk Hacarmel, 2 blocks from the beach. Joseph was an amazing gracious host, always responsive. Will definitely come back!',
  },
  {
    name: 'Daniel',
    rating: 5,
    date: 'January 2026',
    text: 'Great location by the sea, market, restaurants and grocery. Very well equipped. Wonderful.',
  },
  {
    name: 'Liora',
    rating: 5,
    date: 'January 2026',
    text: 'A beautiful and special apartment two blocks from the beach and two blocks from the market. It was perfect.',
  },
  {
    name: 'Jacob',
    rating: 5,
    date: 'December 2025',
    text: 'Great place, as described, looks even better than the pictures! Joseph was easy to communicate with. Highly recommend.',
  },
  {
    name: 'Levi',
    rating: 5,
    date: 'December 2025',
    text: 'Super appartement, a deux minutes à pied d’un parking à 30 shekels les 24h, c’est un bon plus.',
  },
  {
    name: 'Benjamin',
    rating: 5,
    date: 'October 2025',
    text: 'Appartement 5/5 Emplacement 6/5 Hôte 7/5 Merci encore Joseph c’était parfait, nous reviendrons.',
  },
  {
    name: 'Andy',
    rating: 5,
    date: 'October 2025',
    text: 'It was amazing, he was so friendly and nice.',
  },
  {
    name: 'Navah',
    rating: 5,
    date: 'September 2025',
    text: 'Great location and apartment, would stay again :)',
  },
];

export default function TestimonialsCarousel() {
  const locale = useLocale();
  const t = homeMessages[locale].testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-secondary fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="home-testimonials-section py-20 bg-cream relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <div className="home-testimonials-header text-center mb-16">
          <h2 className="font-head text-3xl md:text-6xl font-bold text-primary mb-4 md:mb-6 leading-tight">
            {t.heading}
          </h2>
          <p className="text-primary/80 text-sm md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t.subheading}
          </p>

          <div className="home-testimonials-platforms mt-5 md:mt-10 flex flex-col items-center gap-4">
            <span className="text-primary/60 text-sm tracking-[0.2em] uppercase">
              {t.reviewedOn}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
              {reviewPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.viewReviewsAria(platform.name)}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={platform.src}
                    alt={t.reviewsAlt(platform.name)}
                    width={140}
                    height={42}
                    className="h-7 md:h-9 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="home-testimonials-carousel relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Testimonial Card */}
          <div className="home-testimonials-card relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-secondary/10 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-tertiary/5 rounded-3xl"></div>
            
            {/* Quote icon */}
            <div className="absolute top-6 end-6 opacity-10">
              <Quote className="w-24 h-24 text-primary" />
            </div>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1 rtl:space-x-reverse">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-center mb-5 md:mb-8">
                <p className="text-primary/90 text-sm md:text-xl leading-relaxed font-light italic">
                  &ldquo;{testimonials[currentIndex].text}&rdquo;
                </p>
              </blockquote>

              {/* Guest Info */}
              <div className="text-center">
                <div className="home-testimonials-guest inline-block p-6 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-secondary/20">
                  <h3 className="font-head text-xl md:text-2xl font-bold text-primary mb-2">
                    {testimonials[currentIndex].name}
                  </h3>
                  <div className="flex items-center justify-center text-sm text-primary/60">
                    <span>{testimonials[currentIndex].date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
