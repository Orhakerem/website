import Link from 'next/link';

import { BulletList } from '@/components/legal/LegalPageShell';

const deleted = [
  'ההודעות, הקבצים המצורפים ופרטי הפרופיל שלכם שהתקבלו מ-Facebook, ‏Instagram או WhatsApp.',
  'פרטי הקשר שלכם והיסטוריית השיחות בכלי ניהול הלקוחות שלנו.',
];

export default function DataDeletionContentHe({ privacyHref }: { privacyHref: string }) {
  return (
    <>
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <div className="rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            אור הכרם משתמשת במידע שאתם משתפים איתנו דרך Facebook Messenger, ‏Instagram Direct ו-WhatsApp אך ורק כדי להשיב להודעות שלכם ולשמור את היסטוריית ההתכתבות שלנו. תוכלו לבקש מאיתנו למחוק אותו בכל עת.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">איך מבקשים מחיקה</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <ol className="list-decimal space-y-3 ps-6 text-black/80 leading-relaxed">
            <li>
              שלחו אימייל אל{' '}
              <a href="mailto:orhakerem@45beach.com" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
                orhakerem@45beach.com
              </a>{' '}
              עם הנושא ״בקשה למחיקת מידע״.
            </li>
            <li>
              ציינו באיזה ערוץ פניתם אלינו (Facebook Messenger, ‏Instagram, ‏WhatsApp, אימייל או האתר שלנו) ואת השם או שם המשתמש שמופיע בערוץ זה, כדי שנוכל לאתר את השיחות שלכם.
            </li>
            <li>
              נאשר את קבלת הבקשה תוך 5 ימי עסקים ונמחק את המידע שלכם תוך 30 יום, ולאחר מכן נשלח לכם אישור עם מספר אסמכתה לבקשה.
            </li>
          </ol>
          <p className="mt-6 text-black/80 leading-relaxed">
            ניתן גם לשלוח את הבקשה כהודעה לדף הפייסבוק או לחשבון האינסטגרם שלנו (@or_hakerem).
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">מה נמחק</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={deleted} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">מה אנו עשויים לשמור</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            מידע שאנו מחויבים על פי חוק לשמור — למשל חשבוניות ורשומות חשבונאיות הקשורות להזמנה קודמת — נשמר רק לתקופה הנדרשת על פי חוק ולאחר מכן נמחק.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">ביטול הגישה שלנו</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            איננו משתמשים ב״התחברות עם פייסבוק״. מחיקת השיחה באפליקציה שלכם או חסימת הדף או החשבון שלנו מונעות הודעות עתידיות, אך אינן מוחקות את העותק שבידינו, ולכן אנא שלחו לנו גם את הבקשה שלמעלה.
          </p>
        </div>
      </section>

      <section data-animate="fade-up">
        <div className="rounded-2xl border border-secondary/20 bg-cream p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            בקשה זו חלה הן על אור הכרם והן על 45Beach, שחולקות את אותו כלי לניהול לקוחות. כל הפרטים מופיעים ב
            <Link href={privacyHref} className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
              מדיניות הפרטיות
            </Link>{' '}
            שלנו.
          </p>
        </div>
      </section>
    </>
  );
}
