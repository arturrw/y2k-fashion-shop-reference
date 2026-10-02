import { useStore } from '@nanostores/react';
import { ShoppingBag } from 'lucide-react';
import { cartCount, cartOpen } from '../lib/cart';

export default function CartButton() {
  const count = useStore(cartCount);
  return (
    <div className="relative">
      <button
        aria-label="Cart"
        onClick={() => cartOpen.set(true)}
        className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas"
      >
        <ShoppingBag size={18} strokeWidth={1.5} />
      </button>
      {count > 0 && (
        <span key={count} className="animate-pop pointer-events-none absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[10px] font-medium text-ink">
          {count}
        </span>
      )}
    </div>
  );
}
