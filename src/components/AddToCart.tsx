import { useState } from 'react';
import { addToCart } from '../lib/cart';

interface Props {
  id: string;
  name: string;
  price: number;
  sizes: readonly string[];
  imageUrl?: string | null;
}

export default function AddToCart({ id, name, price, sizes, imageUrl }: Props) {
  const [size, setSize] = useState('M');
  return (
    <>
      <div>
        <span className="mb-2 block text-sm font-semibold">Size</span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-pressed={s === size}
              className={`h-9 rounded-full px-4 text-sm font-semibold ${s === size ? 'bg-ink text-white' : 'bg-secondary hover:bg-secondary-pressed'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => addToCart({ id, name, price, size, imageUrl })}
        className="mt-2 h-11 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-pressed"
      >
        Add to bag
      </button>
    </>
  );
}
