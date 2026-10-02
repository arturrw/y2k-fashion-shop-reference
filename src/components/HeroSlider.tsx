import { useState } from 'react';

interface Slide { src: string; alt: string }

const pad = (n: number) => String(n).padStart(2, '0');

/** Full-bleed crossfading lookbook. The active indicator fills over 6s, then the next look fades in. */
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <div className="absolute inset-0">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={i === active ? s.alt : ''}
          aria-hidden={i !== active}
          loading={i === 0 ? 'eager' : 'lazy'}
          data-active={i === active || undefined}
          className="hero-slide absolute inset-0 size-full object-cover"
        />
      ))}

      {/* keeps the overlaid headline readable on any photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />

      <div className="absolute inset-x-6 bottom-6 z-10 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-8">
        <span className="eyebrow shrink-0 bg-accent px-2 py-1 text-ink">
          Look {pad(active + 1)} / {pad(slides.length)}
        </span>
        <div className="flex w-full max-w-[360px] gap-1.5" role="group" aria-label="Choose a look">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show look ${i + 1}`}
              aria-current={i === active || undefined}
              className="group/dot flex h-6 flex-1 items-center"
            >
              <span className="relative block h-[3px] w-full overflow-hidden bg-white/35 backdrop-blur-sm transition-[height] group-hover/dot:h-[5px]">
                <span
                  // re-mount on every activation so the fill restarts from zero
                  key={i === active ? `on-${active}` : 'off'}
                  onAnimationEnd={i === active ? next : undefined}
                  data-state={i === active ? 'active' : i < active ? 'done' : 'todo'}
                  className="hero-fill absolute inset-0 origin-left bg-white"
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
