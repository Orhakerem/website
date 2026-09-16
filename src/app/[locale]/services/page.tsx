'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendContactEmail } from '@/actions/contact';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import { useBackToTopVisibility } from '@/hooks/useBackToTopVisibility';
import { useLocale } from '@/i18n/useLocale';
import { servicesMessages } from '@/i18n/messages/services';
import { trackMetaLead } from '@/lib/meta-events';
import { trackGaLead } from '@/lib/ga-events';

interface ServiceCardProps {
  title: string;
  description: string;
  delay: number;
}

function ServiceCard({ title, description, delay }: ServiceCardProps) {
  return (
    <div
      data-animate="scale"
      className="service-card relative rounded-xl border border-gray-100 bg-white p-4 md:p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="relative z-10 mb-3 font-head text-base md:text-xl font-bold text-black">
        {title}
      </h3>
      <p className="relative z-10 text-sm leading-relaxed text-black/80">
        {description}
      </p>
    </div>
  );
}

export default function ServicesPage() {
  const locale = useLocale();
  const t = servicesMessages[locale];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const showBackToTop = useBackToTopVisibility();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (showForm) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showForm]);

  const services = t.services;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      // Add context that this is a concierge service request
      const originalMessage = formData.get('message') as string;
      formData.set('message', `${t.form.messagePrefix}${originalMessage}`);

      const result = await sendContactEmail(formData);
      if (result.success) {
        trackMetaLead({
          leadType: 'concierge_inquiry',
          formLocation: 'services',
          locale,
        });
        trackGaLead({
          leadType: 'concierge_inquiry',
          formLocation: 'services',
          locale,
        });
        toast.success(result.message || t.form.success);
        (e.target as HTMLFormElement).reset();
        setIsSuccess(true);
        setShowForm(false);
      } else {
        toast.error(result.error || t.form.error);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error(t.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8e4dc' }}>
      {/* Hero Section - Split layout with image */}
      <motion.section
        className="hero-section services-hero-section relative flex w-full flex-col overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary pt-20 md:flex-row"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
        }}
        data-animate="fade-up"
      >
        {/* Left: Content */}
        <div className="services-hero-copy flex w-full flex-col justify-center min-h-[30vh] p-5 md:min-h-0 md:w-1/2 md:p-10 lg:w-3/5 lg:p-12">
          <motion.main
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.h1
              className="font-head text-3xl md:text-5xl lg:text-[4rem] font-bold leading-tight text-white"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              data-animate="text"
            >
              {t.hero.titleLine1}
              <br />
              <span className="text-secondary">{' '}{t.hero.titleLine2}</span>
            </motion.h1>

            <motion.div
              className="my-3 md:my-6 h-1 w-20 bg-secondary"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            ></motion.div>

            <motion.p
              className="mb-4 md:mb-8 max-w-xl text-sm md:text-xl text-white/90 leading-relaxed"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              {t.hero.body}
            </motion.p>

            <motion.div
              className="services-hero-pills flex flex-wrap gap-2 md:gap-4"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              {t.hero.pills.map((pill) => (
                <div
                  key={pill}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90"
                >
                  {pill}
                </div>
              ))}
            </motion.div>
          </motion.main>
        </div>

        {/* Right: Image with clip-path reveal */}
        <motion.div
          className="services-hero-media w-full min-h-[170px] bg-cover bg-center md:w-1/2 md:min-h-[72vh] lg:w-2/5"
          style={{
            backgroundImage: 'url(/Service_page_Hero.png)',
            backgroundColor: '#1f1612',
          }}
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
          transition={{ duration: 1.2, ease: 'circOut' }}
        ></motion.div>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 8.33333C120 16.6667 240 33.3333 360 41.6667C480 50 600 50 720 41.6667C840 33.3333 960 16.6667 1080 16.6667C1200 16.6667 1320 33.3333 1380 41.6667L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </motion.section>

      {/* Services Section - Redesigned */}
      <section className="services-grid-section relative py-24 bg-cream" data-animate="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section with modern design */}
          <div className="services-grid-header text-center mb-20" data-animate="fade-up">
            <h2 className="font-head text-2xl md:text-6xl font-bold text-black mb-6 leading-tight" data-animate="text">
              {t.grid.titleLine1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
                {t.grid.titleLine2}
              </span>
            </h2>
            <p className="text-black/70 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t.grid.subheading}
            </p>
          </div>

          {/* Services grid with enhanced cards - Updated to 3 columns with reduced gap */}
          <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto" data-animate-group="cards">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8 md:mb-16"></div>

        {/* Contact Section - Centered and with bottom spacing */}
        <section className="services-contact-section py-12 bg-gradient-to-br from-primary via-primary to-primary-light relative overflow-hidden rounded-2xl mb-8 md:mb-20">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-6 left-5 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-5 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl"></div>
          </div>

          {/* Centered content container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center">
            <div className="w-full">
            {/* Compact Header */}
            <div className="services-contact-header text-center mb-5 md:mb-10">
              <h2 className="font-head text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {t.contact.heading}
              </h2>
              <p className="text-white/80 text-base max-w-xl mx-auto">
                {t.contact.subheading}
              </p>
            </div>

            {isSuccess ? (
              <div className="max-w-2xl mx-auto">
                <div className="services-contact-success bg-white/10 backdrop-blur-sm rounded-3xl p-10 text-center border border-white/20">
                  <div className="inline-block p-4 bg-gradient-to-br from-secondary to-secondary-light rounded-full mb-6">
                    <Mail className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-head text-3xl font-bold text-white mb-4">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-white/90 text-lg mb-8">
                    {t.contact.successBody}
                  </p>
                  <LiquidGlassButton variant="dark" onClick={() => setIsSuccess(false)}>
                    {t.contact.sendAnother}
                  </LiquidGlassButton>
                </div>
              </div>
            ) : (
              <div className="services-contact-cta text-center mb-8">
                <div className="inline-block relative">
                  <LiquidGlassButton variant="dark" onClick={() => setShowForm(true)}>
                    <span className="me-2">{t.contact.inquire}</span>
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </LiquidGlassButton>
                </div>
              </div>
            )}
            </div>
          </div>
        </section>
      </div>

      {showForm && (
        <div
          className="services-modal tap-reset fixed inset-0 z-50 bg-black/55 backdrop-blur-sm px-3 pt-24 pb-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="services-inquiry-title"
          onClick={() => setShowForm(false)}
        >
          <div
            className="services-form-wrap w-full min-h-full flex items-start justify-center sm:items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="services-form w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-2xl sm:rounded-3xl">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-primary/10 bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-8 sm:py-5">
                <div>
                  <h3 id="services-inquiry-title" className="font-head text-2xl sm:text-3xl font-bold text-black">
                    {t.form.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-black/70">
                    {t.form.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="shrink-0 rounded-full border border-primary/10 p-2 text-black/60"
                  aria-label={t.form.close}
                >
                  <span className="sr-only">{t.form.close}</span>
                  ✕
                </button>
              </div>

              <div className="px-5 py-5 sm:px-8 sm:py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        required
                        className="h-11 w-full rounded-lg border border-primary/15 bg-white px-4 text-sm text-black placeholder-primary/40 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        className="h-11 w-full rounded-lg border border-primary/15 bg-white px-4 text-sm text-black placeholder-primary/40 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black/80 mb-2">
                      Service Request Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Please describe the concierge service you need..."
                      rows={5}
                      required
                      className="w-full resize-none rounded-lg border border-primary/15 bg-white px-4 py-3 text-sm text-black placeholder-primary/40 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <LiquidGlassButton
                      type="button"
                      variant="dark"
                      size="sm"
                      onClick={() => setShowForm(false)}
                    >
                      {t.form.cancel}
                    </LiquidGlassButton>
                    <LiquidGlassButton type="submit" size="sm" disabled={isSubmitting}>
                      <span className="me-2">
                        {isSubmitting ? t.form.sending : t.form.submit}
                      </span>
                      <span>→</span>
                    </LiquidGlassButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-secondary to-secondary-light p-4 text-black shadow-lg"
          aria-label={t.backToTopAria}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
