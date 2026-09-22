'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type HeroAnimatedTitleProps = {
  className?: string;
  titles?: readonly string[];
};

const DEFAULT_TITLES = ['Or Hakerem', 'Luxury Short-Term Stays in Tel Aviv'] as const;

export default function HeroAnimatedTitle({
  className = '',
  titles: titlesProp,
}: HeroAnimatedTitleProps) {
  const titles = useMemo(() => titlesProp ?? DEFAULT_TITLES, [titlesProp]);
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <h1
      className={`hero-animated-title font-head font-bold ${className}`}
    >
      {/*
        Every animated item stays in the DOM at once, so without a separator
        text extraction reads them glued together ("Or HakeremLuxury ...").
        The separators are visually hidden and out of flow, so the animation
        is untouched while the heading reads as one sentence.
      */}
      <span className="hero-animated-title-stage">
        {titles.map((title, index) => (
          <Fragment key={index}>
            {index > 0 && <span className="sr-only"> — </span>}
            <motion.span
              className="hero-animated-title-item"
              initial={{ opacity: 0, y: -100 }}
              transition={{ type: 'spring', stiffness: 50 }}
              animate={
                titleNumber === index
                  ? { y: 0, opacity: 1 }
                  : { y: titleNumber > index ? -150 : 150, opacity: 0 }
              }
            >
              {title}
            </motion.span>
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
