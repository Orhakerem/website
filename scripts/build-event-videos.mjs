#!/usr/bin/env node
/**
 * Encodes the raw event footage in `media-src/events/` (git-ignored) into the
 * web files served from `public/videos/events/`:
 *
 *   <slug>.mp4          full clip, 720px wide, with sound — played on click
 *   <slug>-preview.mp4  muted 5s loop, 480px wide — played inside the card
 *   <slug>.webp         poster frame
 *
 * Phone footage carries GPS coordinates, so all metadata is stripped. Fails if
 * a file blows its weight budget.
 *
 * To add a video: drop `<slug>.mov|mp4` in media-src/events, add it to VIDEOS
 * below, run `node scripts/build-event-videos.mjs [slug…]` (needs ffmpeg), then
 * add the matching entry in src/lib/event-videos.ts.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const SRC = fileURLToPath(new URL('../media-src/events/', import.meta.url));
const OUT = fileURLToPath(new URL('../public/videos/events/', import.meta.url));

// start/end trim the clip; posterAt and previewStart are seconds into the
// trimmed clip; audio: false drops the sound track; zoom keeps that fraction of
// the frame, from x/y (fractions too), to crop out burned-in logos and text.
// All optional.
const VIDEOS = [
  { slug: 'string-lights-party', posterAt: 2.6 },
  { slug: 'daytime-reception', posterAt: 1.6 },
  { slug: 'rooftop-by-night', end: 17.5, posterAt: 3.6, audio: false, zoom: { keep: 0.71, x: 0.145, y: 0.13 } },
  { slug: 'family-ceremony', posterAt: 4.1, previewStart: 2.2 },
  { slug: 'sunset-gathering', posterAt: 0.2 },
  { slug: 'buffet-barbecue', posterAt: 3.4 },
  { slug: 'evening-celebration', posterAt: 3.5 },
];

const MAX_SECONDS = 30;
const PREVIEW_SECONDS = 5;
const BUDGET = { full: 5 * 1024 * 1024, preview: 350 * 1024, poster: 90 * 1024 };
const HDR_TRANSFERS = new Set(['arib-std-b67', 'smpte2084']);

function probe(file) {
  const raw = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=r_frame_rate,color_transfer:format=duration',
    '-of', 'json', file,
  ]);
  const { streams: [stream], format } = JSON.parse(raw);
  const [num, den] = stream.r_frame_rate.split('/').map(Number);
  return { fps: num / den, transfer: stream.color_transfer, duration: Number(format.duration) };
}

const ffmpeg = (args, options) =>
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { maxBuffer: 64 * 1024 * 1024, ...options });

// Cover-crop to 9:16 without upscaling past the source (some clips are 480px wide).
const cover = (width, zoom) =>
  (zoom ? `crop=iw*${zoom.keep}:ih*${zoom.keep}:iw*${zoom.x}:ih*${zoom.y},` : '') +
  `crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale='trunc(min(${width},iw)/2)*2':-2`;

function checkBudget(file, kind) {
  const { size } = statSync(file);
  if (size > BUDGET[kind]) {
    throw new Error(`${file}: ${size} bytes, over the ${BUDGET[kind]}-byte ${kind} budget`);
  }
  return `${kind} ${Math.round(size / 1024)} KB`;
}

const only = new Set(process.argv.slice(2));
mkdirSync(OUT, { recursive: true });

for (const { slug, start = 0, end, posterAt = 0, previewStart = 0, audio = true, zoom } of VIDEOS) {
  if (only.size > 0 && !only.has(slug)) continue;

  const source = ['.mov', '.mp4'].map((ext) => join(SRC, slug + ext)).find(existsSync);
  if (!source) throw new Error(`No media-src/events/${slug}.mov|mp4`);

  const { fps, transfer, duration } = probe(source);
  if (HDR_TRANSFERS.has(transfer)) {
    throw new Error(
      `${source} is HDR and would look washed out. Convert it to SDR first:\n` +
        `  avconvert -p Preset1920x1080 -s ${source} -o <sdr-copy>.mov`,
    );
  }

  const length = (end ?? duration) - start;
  if (length > MAX_SECONDS) throw new Error(`${slug}: ${length}s, trim it under ${MAX_SECONDS}s`);

  const rate = Math.min(30, fps);
  const full = join(OUT, `${slug}.mp4`);
  const preview = join(OUT, `${slug}-preview.mp4`);
  const poster = join(OUT, `${slug}.webp`);
  const h264 = ['-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1'];

  ffmpeg([
    '-ss', String(start), '-i', source, '-t', String(length),
    '-map', '0:v:0', ...(audio ? ['-map', '0:a:0?', '-c:a', 'aac', '-b:a', '96k', '-ac', '2'] : ['-an']),
    '-vf', `${cover(720, zoom)},fps=${rate}`, ...h264,
    '-crf', '26', '-maxrate', '1800k', '-bufsize', '3600k', full,
  ]);
  ffmpeg([
    '-ss', String(start + previewStart), '-i', source,
    '-t', String(Math.min(PREVIEW_SECONDS, length - previewStart)),
    '-map', '0:v:0', '-an', '-vf', `${cover(480, zoom)},fps=24`, ...h264,
    '-crf', '30', '-maxrate', '480k', '-bufsize', '960k', preview,
  ]);
  const frame = ffmpeg([
    '-ss', String(start + posterAt), '-i', source, '-frames:v', '1',
    '-vf', cover(540, zoom), '-f', 'image2pipe', '-c:v', 'png', '-',
  ]);
  await sharp(frame).webp({ quality: 70, effort: 6 }).toFile(poster);

  console.log(
    `${slug} (${length.toFixed(1)}s): ` +
      [checkBudget(full, 'full'), checkBudget(preview, 'preview'), checkBudget(poster, 'poster')].join(', '),
  );
}
