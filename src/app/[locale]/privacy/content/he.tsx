/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { BulletList, CardGrid } from '@/components/legal/LegalPageShell';
import { OPEN_CONSENT_SETTINGS_EVENT } from '@/lib/consent';

const dataYouProvide = [
  {
    title: 'טופס יצירת קשר',
    body: 'השם שלכם, כתובת האימייל ותוכן ההודעה.',
  },
  {
    title: 'בקשות הזמנה',
    body: 'השם שלכם, אימייל, מספר טלפון, דרך התקשרות מועדפת, הדירה שנבחרה, תאריכי הצ׳ק-אין והצ׳ק-אאוט, ומספר האורחים.',
  },
  {
    title: 'פניות לגבי אירועים',
    body: 'השם שלכם, אימייל, מספר טלפון, דרך התקשרות מועדפת, סוג האירוע, תאריך האירוע, מספר אורחים צפוי, וכל פרט אופציונלי נוסף שתשתפו.',
  },
];

const dataCollectedAutomatically = [
  'העמודים שבהם אתם צופים ואופן הניווט שלכם באתר',
  'סוג הדפדפן, המכשיר ומערכת ההפעלה',
  'מיקום משוער המבוסס על כתובת ה-IP שלכם',
  'האתר או המקור שהפנה אתכם אלינו',
  'האינטראקציות שלכם עם קמפיינים פרסומיים של Meta ושל Google כאשר אתם מאשרים עוגיות פרסום',
];

const howWeUse = [
  'מענה לפניות ולהודעות שלכם',
  'טיפול, אישור וניהול של בקשות ההזמנה והאירועים שלכם',
  'יצירת קשר איתכם בדרך המועדפת עליכם בנוגע לבקשתכם',
  'תפעול, אבטחה, תחזוקה ושיפור האתר',
  'מדידת יעילות הפרסום ויצירת קהלים רלוונטיים כאשר אתם מסכימים לכך',
  'עמידה בהתחייבויותינו המשפטיות, המיסויות והחשבונאיות',
];

const legalBases = [
  {
    title: 'ביצוע חוזה',
    body: 'טיפול בבקשת ההזמנה או האירוע שלכם ונקיטת צעדים לבקשתכם לפני כריתת הסכם.',
  },
  {
    title: 'הסכמה',
    body: 'טעינת עוגיות האנליטיקה של Google Analytics וטכנולוגיות הפרסום של Meta ושל Google Ads, המופעלות רק לאחר בחירה מפורשת בכל קטגוריה. ניתן לשנות או לבטל את ההסכמה בכל עת.',
  },
  {
    title: 'אינטרסים לגיטימיים',
    body: 'שמירה על אבטחת האתר, הבנת אופן השימוש בו, שיפורו ומענה לפניות כלליות.',
  },
  {
    title: 'חובה משפטית',
    body: 'שמירת רשומות כאשר הדין המיסויי והחשבונאי החל מחייב זאת.',
  },
];

const processors = [
  {
    title: 'Resend',
    body: 'שולח את הודעות האימייל שנוצרות על ידי טפסי יצירת הקשר, ההזמנה והאירועים שלנו.',
  },
  {
    title: 'Supabase',
    body: 'שומר באופן מאובטח את בקשות ההזמנה כדי שנוכל לנהל ולעקוב אחר ההזמנה שלכם.',
  },
  {
    title: '(Google LLC) Google Analytics',
    body: 'מספק נתוני שימוש מצטברים באתר באמצעות עוגיות וטכנולוגיות דומות.',
  },
  {
    title: '(Google LLC) Google Ads',
    body: 'מודד את ההזמנות והפניות שנוצרו מקמפיינים ברשת החיפוש וברשת המדיה ובונה קהלי רימרקטינג. Google פועלת כבעלת שליטה עצמאית בחלק מהעיבודים הללו, בהתאם לתנאי הפרסום שלה.',
  },
  {
    title: 'Meta Platforms',
    body: 'מספקת את Meta Pixel. בהתאם למטרה, Meta עשויה לעבד נתונים עבורנו או לפעול יחד איתנו כאחראית משותפת לאיסוף ולהעברת נתוני אירועים המשמשים למיקוד ולשיפור פרסום.',
  },
  {
    title: 'Vercel',
    body: 'מארח את האתר ומעבד יומני שרת ואבטחה סטנדרטיים.',
  },
];

const dataRetention = [
  'הודעות יצירת קשר ופנייה נשמרות רק לפרק הזמן הנדרש לטיפול בבקשתכם, בתוספת תקופת מעקב סבירה.',
  'רשומות הזמנה נשמרות לצורך ניהול ההזמנות ולעמידה בדרישות משפטיות וחשבונאיות.',
  'נתוני אנליטיקה נשמרים בהתאם להגדרות השמירה של Google Analytics.',
  'נתוני המרות ורימרקטינג של Google Ads נשמרים לפרקי הזמן שנקבעו על ידי Google, וההשתייכות לרשימת רימרקטינג פוקעת בתום משך הזמן המרבי המותר ב-Google Ads.',
  'בהתאם לתנאי כלי Meta Business, Meta עשויה לשמור נתוני אירועים למשך עד שנתיים, וקהלים שנוצרו מהם עד למחיקתם באמצעות כלי החשבון.',
];

const gdprRights = [
  'לגשת לנתונים האישיים שאנו מחזיקים לגביכם',
  'לבקש תיקון של נתונים שגויים או לא שלמים',
  'לבקש מחיקה של הנתונים שלכם',
  'לבקש הגבלה של העיבוד, או להתנגד לו',
  'לבקש ניידות של הנתונים שמסרתם לנו',
  'לבטל את ההסכמה בכל עת, מבלי להשפיע על עיבוד שבוצע קודם לכן',
  'להגיש תלונה לרשות הפיקוח המקומית להגנת מידע',
];

export default function PrivacyContentHe({
  termsHref,
  cancellationHref,
}: {
  termsHref: string;
  cancellationHref: string;
}) {
  return (
    <>
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <h2 className="font-head text-3xl font-bold text-black">מי אנחנו</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="space-y-4 text-black/80 leading-relaxed">
            <p>
              אור הכרם ("אנחנו" או "החברה") מספקת אירוח יוקרתי לטווח קצר בתל אביב ומפעילה את
              האתר orhakerem.com. אור הכרם מנוהלת על ידי 45Beach (45beach.com, רחוב הירקון 45, תל
              אביב-יפו), המנהלת בשמה את האתר, ההזמנות והפניות. אור הכרם, בניהול 45Beach, היא הגורם
              האחראי על הנתונים האישיים המתוארים במדיניות זו.
            </p>
            <p>
              ניתן לפנות אלינו בכל נושא הקשור לפרטיות בכתובת{' '}
              <a
                href="mailto:orhakerem@45beach.com"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                orhakerem@45beach.com
              </a>{' '}
              או בדואר לכתובת רחוב הכובשים 35, תל אביב, ישראל. אם הזמנתם דרך Airbnb, השהות שלכם
              כפופה גם למדיניות הפרטיות של Airbnb.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up" data-delay="2">
        <h2 className="font-head text-3xl font-bold text-black">המידע שאנו אוספים</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
            <h3 className="font-head text-2xl font-semibold text-black">מידע שאתם מוסרים</h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              אנחנו מקבלים מידע זה רק כאשר אתם בוחרים לשלוח אותו אלינו דרך אחד הטפסים שלנו.
            </p>
            <div className="mt-6">
              <CardGrid items={dataYouProvide} />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
            <h3 className="font-head text-2xl font-semibold text-black">
              מידע שנאסף באופן אוטומטי
            </h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              בהתאם לבחירות ההסכמה שלכם, ספקי האנליטיקה והפרסום שלנו עשויים לאסוף מידע טכני מוגבל
              באמצעות עוגיות וטכנולוגיות דומות:
            </p>
            <div className="mt-5">
              <BulletList items={dataCollectedAutomatically} />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up" data-delay="3">
        <h2 className="font-head text-3xl font-bold text-black">עוגיות, אנליטיקה ופרסום</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="space-y-4 text-black/80 leading-relaxed">
            <p>
              אנחנו משתמשים ב-Google Analytics 4 כדי להבין כיצד המבקרים משתמשים באתר ולשפר אותו.
              Google Analytics מפעיל עוגיות ומעבד את המידע הטכני שתואר לעיל. עוגיות אנליטיקה אלה
              נטענות רק אם תאשרו בנפרד את קטגוריית מדידת השימוש.
            </p>
            <p>
              בהסכמה נפרדת לקטגוריית הפרסום, אנו משתמשים גם ב-Meta Pixel. הפיקסל מסייע לנו למדוד
              פעולות שבוצעו לאחר אינטראקציה עם הפרסומות שלנו וליצור קהלים רלוונטיים בשירותי Meta.
              הוא עשוי לעבד מידע טכני, כתובת IP, כתובת העמוד, מזהי דפדפן ומידע על הקמפיין. איננו
              שולחים ל-Meta את תוכן הטפסים באמצעות הפיקסל.
            </p>
            <p>
              אותה הסכמה לקטגוריית הפרסום חלה גם על Google Ads. אנו מפעילים קמפיינים ברשת החיפוש
              וברשת המדיה, ותג Google Ads מאפשר לנו למדוד הזמנות ופניות שבוצעו לאחר קליק על מודעה
              ולהציג מודעות רלוונטיות למי שכבר ביקר באתר (רימרקטינג). כאשר נכס Google Analytics שלנו
              מקושר ל-Google Ads, נתוני האנליטיקה עשויים לשמש גם לבניית קהלים אלה. איננו שולחים
              ל-Google את תוכן הטפסים.
            </p>
            <p>
              באפשרותכם לשנות או לבטל את בחירתכם בכל עת באמצעות הכפתור למטה, לסרב או למחוק עוגיות
              דרך הגדרות הדפדפן, להסיר את עצמכם מ-Google Analytics בכל האתרים באמצעות{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                תוסף ההסרה של Google
              </a>
              , לכבות פרסום מותאם אישית ב{' '}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                הגדרות המודעות של Google
              </a>
              , או להתאים את{' '}
              <a
                href="https://www.facebook.com/settings?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                העדפות המודעות שלכם ב-Meta
              </a>
              . חסימת עוגיות לא תפגע ביכולתכם לגלוש באתר או ליצור איתנו קשר.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
            className="mt-6 inline-flex items-center rounded-full border border-primary/15 bg-white px-5 py-2.5 font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            ניהול העדפות עוגיות
          </button>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">כיצד אנו משתמשים במידע שלכם</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={howWeUse} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">הבסיס המשפטי לעיבוד</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
          <p className="text-black/75 leading-relaxed">
            כאשר תקנת ה-GDPR של האיחוד האירופי או בריטניה חלה, אנו מסתמכים על הבסיסים המשפטיים הבאים:
          </p>
          <div className="mt-6">
            <CardGrid items={legalBases} />
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">שיתוף ושירותי צד שלישי</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            איננו מוכרים את הנתונים האישיים שלכם. בהתאם לשירות ולמטרה, צדדים שלישיים עשויים לעבד
            נתונים עבורנו, לפעול כאחראים עצמאיים או לפעול יחד איתנו כאחראים משותפים. עבור עיבודים
            מסוימים של כלי Meta Business הכפופים ל-GDPR, אור הכרם ו-Meta Platforms Ireland Limited
            הן אחראיות משותפות לאיסוף ולהעברת נתוני אירועים. למידע נוסף, ראו את{' '}
            <a
              href="https://www.facebook.com/legal/terms/businesstools/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              תנאי כלי Meta Business
            </a>
            .
          </p>
          <div className="mt-6">
            <CardGrid items={processors} />
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">העברות מידע בינלאומיות</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            חלק מספקי השירות שלנו נמצאים מחוץ לישראל ולאזור הכלכלי האירופי, למשל בארצות הברית.
            כאשר הנתונים שלכם מועברים בינלאומית, אנו מסתמכים על אמצעי הגנה מתאימים המוצעים על ידי
            אותם ספקים, לרבות סעיפים חוזיים סטנדרטיים ומנגנוני התאמה מוכרים.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">שמירת נתונים</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={dataRetention} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">הזכויות שלכם</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h3 className="font-head text-2xl font-semibold text-black">אם אתם באזור הכלכלי האירופי או בבריטניה</h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              בהתאם ל-GDPR, יש לכם את הזכות:
            </p>
            <div className="mt-5">
              <BulletList items={gdprRights} />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h3 className="font-head text-2xl font-semibold text-black">אם אתם בישראל</h3>
            <div className="mt-2 space-y-4 text-black/75 leading-relaxed">
              <p>
                בהתאם לחוק הגנת הפרטיות בישראל, יש לכם הזכות לעיין בנתונים האישיים שאנו מחזיקים
                לגביכם במאגר שלנו ולבקש תיקון או עדכון שלהם.
              </p>
              <p>
                כדי לממש זכויות אלה, שלחו לנו אימייל אל{' '}
                <a
                  href="mailto:orhakerem@45beach.com"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  orhakerem@45beach.com
                </a>
                . נשיב תוך פרק הזמן הנדרש על פי הדין החל.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">אבטחת מידע</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            אנחנו נוקטים באמצעים טכניים וארגוניים סבירים כדי להגן על הנתונים האישיים שלכם,
            ומסתמכים על ספקי שירות מהימנים לאחסון ולעיבוד מאובטח שלהם. עם זאת, אף שיטת העברה
            באינטרנט או אחסון אלקטרוני אינה מאובטחת לחלוטין, ולא נוכל להבטיח אבטחה מוחלטת.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">פרטיות ילדים</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            האתר מיועד למבוגרים. אנחנו לא אוספים ביודעין נתונים אישיים מילדים מתחת לגיל 16. אם
            אתם סבורים שילד מסר לנו נתונים אישיים, אנא צרו קשר ואנחנו נמחק אותם.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">קישורים לצדדים שלישיים</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            האתר שלנו מקשר לשירותים חיצוניים כמו Airbnb, וואטסאפ, אינסטגרם, LinkedIn ופייסבוק.
            איננו אחראים למדיניות הפרטיות של שירותים אלה, ואנו ממליצים לעיין במדיניות הפרטיות
            שלהם.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">שינויים במדיניות זו</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            אנו עשויים לעדכן מדיניות זו מעת לעת כדי לשקף שינויים בפעילותנו או מטעמים משפטיים.
            כשנעשה זאת, נעדכן את תאריך "עדכון אחרון" בראש עמוד זה.
          </p>
        </div>
      </section>

      <section data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">צרו קשר</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="rounded-2xl border border-secondary/20 bg-cream p-6">
            <h3 className="font-head text-2xl font-semibold text-black">אור הכרם</h3>
            <address className="mt-4 not-italic space-y-2 text-black/80 leading-relaxed">
              <p>רחוב הכובשים 35, תל אביב, ישראל</p>
              <p>
                בניהול{' '}
                <a
                  href="https://www.45beach.com/he"
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  45Beach
                </a>{' '}
                — רחוב הירקון 45, תל אביב-יפו, ישראל
              </p>
              <p>
                אימייל:{' '}
                <a
                  href="mailto:orhakerem@45beach.com"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  orhakerem@45beach.com
                </a>
              </p>
              <p dir="ltr">
                טלפון:{' '}
                <a href="tel:+972585778891" className="font-semibold text-primary hover:text-primary-light">
                  +972 58 577 8891
                </a>{' '}
                (ישראל) ·{' '}
                <a href="tel:+33651179925" className="font-semibold text-primary hover:text-primary-light">
                  +33 6 51 17 99 25
                </a>{' '}
                (צרפת)
              </p>
            </address>
          </div>

          <p className="mt-6 text-black/80 leading-relaxed">
            ראו גם את{' '}
            <Link
              href={termsHref}
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              תנאי השימוש
            </Link>{' '}
            ואת{' '}
            <Link
              href={cancellationHref}
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              מדיניות הביטולים וההחזרים
            </Link>
            {' '}שלנו.
          </p>
        </div>
      </section>
    </>
  );
}
