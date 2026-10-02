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
        <span className="eyebrow mb-3 block text-mute">Size</span>
        <div className="flex flex-wrap">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-pressed={s === size}
              className={`-ml-px h-11 w-14 border border-ink font-mono text-sm transition-colors first:ml-0 ${s === size ? 'bg-ink text-canvas' : 'hover:bg-surface-card'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => addToCart({ id, name, price, size, imageUrl })}
        className="eyebrow h-12 w-full bg-ink text-canvas transition-colors hover:bg-accent hover:text-ink"
      >
        Add to bag
      </button>
    </>
  );
}
