import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { NavTab } from '../lib/catalog';

/** Burger menu for small screens; the desktop hover dropdowns don't work on touch. */
export default function MobileMenu({ nav }: { nav: NavTab[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', close);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', close);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas md:hidden"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label="Menu" className="animate-fade-in fixed inset-0 z-[1000] flex flex-col overflow-y-auto bg-canvas">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink px-4">
              <span className="font-display text-[24px] tracking-[0.18em] uppercase">DCS Y2K</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex size-10 items-center justify-center hover:bg-ink hover:text-canvas">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-col px-4 py-4">
              {nav.map((tab) => {
                const isOpen = expanded === tab.label;
                return (
                  <div key={tab.label} className="border-b border-hairline">
                    <div className="flex items-center justify-between">
                      <a href={tab.href} className="h-display flex-1 py-4 text-[34px]">{tab.label}</a>
                      <button
                        type="button"
                        aria-label={`${isOpen ? 'Hide' : 'Show'} ${tab.label} categories`}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : tab.label)}
                        className="flex size-11 items-center justify-center"
                      >
                        <ChevronDown size={20} strokeWidth={1.5} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <ul className="animate-fade-in flex flex-col pb-4">
                        {tab.items.map((item) => (
                          <li key={item.href + item.label}>
                            <a href={item.href} className="eyebrow block py-2.5 text-mute hover:text-ink">{item.label}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
