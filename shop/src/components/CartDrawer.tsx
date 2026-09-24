import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Trash2, X } from 'lucide-react';
import { cart, cartOpen, cartSubtotal, removeFromCart } from '../lib/cart';

export default function CartDrawer() {
  const lines = useStore(cart);
  const open = useStore(cartOpen);
  const subtotal = useStore(cartSubtotal);
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cartOpen.set(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) setCheckoutMessage(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-[1000] bg-black/50" onClick={() => cartOpen.set(false)}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="animate-drawer absolute inset-y-0 right-0 flex w-[400px] max-w-[90vw] flex-col gap-4 overflow-y-auto bg-canvas p-6 shadow-modal"
        aria-label="Your bag"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[22px] font-semibold">Your bag</h2>
          <button aria-label="Close" onClick={() => cartOpen.set(false)} className="flex size-10 items-center justify-center rounded-full hover:bg-secondary">
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <span className="text-mute">Your bag is empty.</span>
            <a href="/shop" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-pressed">
              Start shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {lines.map((l) => (
              <div key={l.id + l.size} className="flex items-center gap-3">
                <a href={`/product/${l.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-md hover:opacity-80">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-secondary to-stone">
                    {l.imageUrl && <img src={l.imageUrl} alt={l.name} className="size-full object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-sm font-semibold">{l.name}</span>
                    <span className="text-[13px] text-mute">
                      Size {l.size} · Qty {l.qty} · ${l.price * l.qty}
                    </span>
                  </div>
                </a>
                <button aria-label={`Remove ${l.name}`} onClick={() => removeFromCart(l.id, l.size)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-secondary">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-hairline pt-4 font-semibold">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <button
              onClick={() => setCheckoutMessage(true)}
              className="w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-pressed"
            >
              Checkout
            </button>
            {checkoutMessage && (
              <p role="status" className="rounded-md bg-surface-card p-3 text-sm text-body">
                Checkout isn’t available yet — we’re working on it.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
