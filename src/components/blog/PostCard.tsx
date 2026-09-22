import Image from 'next/image';
import Link from 'next/link';
import { formatDate, readingTime, type Post } from '@/lib/blog';
import { localizePath, type Locale } from '@/i18n/config';
import { blogMessages } from '@/i18n/messages/blog';

interface PostCardProps {
  post: Post;
  locale: Locale;
  /**
   * Heading level for the card title. `h2` on the blog index, where cards are
   * top-level sections; `h3` under the "More from the blog" h2 on a post page.
   */
  headingLevel?: 'h2' | 'h3';
}

export default function PostCard({ post, locale, headingLevel = 'h2' }: PostCardProps) {
  const { frontmatter, slug, content } = post;
  const t = blogMessages[locale];
  const Heading = headingLevel;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(83,45,36,0.08)] border border-primary/10 transition-transform duration-300 hover:-translate-y-1">
      <Link
        href={localizePath(locale, `/blog/${slug}`)}
        className="absolute inset-0 z-10"
        aria-label={t.readAria(frontmatter.title)}
      />

      <div className="relative h-52 overflow-hidden">
        <Image
          src={frontmatter.image}
          alt={frontmatter.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {frontmatter.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary/15 px-3 py-0.5 text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <Heading className="mb-2 font-head text-lg font-bold leading-snug text-black line-clamp-2 md:text-xl">
          {frontmatter.title}
        </Heading>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-black/65 line-clamp-3">
          {frontmatter.description}
        </p>

        <div className="flex items-center justify-between text-xs text-black/45">
          <span>{formatDate(frontmatter.date, locale)}</span>
          <span>{readingTime(content, locale)}</span>
        </div>
      </div>
    </article>
  );
}
