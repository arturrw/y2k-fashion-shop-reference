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
        className="flex size-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <ShoppingBag size={18} />
      </button>
      {count > 0 && (
        <span key={count} className="animate-pop pointer-events-none absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </div>
  );
}
