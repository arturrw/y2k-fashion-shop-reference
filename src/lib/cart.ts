import { atom, computed } from 'nanostores';

export interface CartLine {
  id: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  imageUrl?: string | null;
}

const KEY = 'y2k-cart';

function load(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export const cart = atom<CartLine[]>([]);
export const cartOpen = atom(false);

if (typeof window !== 'undefined') {
  cart.set(load());
  // the drawer is persisted across view transitions, so close it on navigation
  document.addEventListener('astro:before-swap', () => cartOpen.set(false));
  cart.listen((lines) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  });
}

export const cartCount = computed(cart, (l) => l.reduce((s, x) => s + x.qty, 0));
export const cartSubtotal = computed(cart, (l) => l.reduce((s, x) => s + x.price * x.qty, 0));

export function addToCart(item: Omit<CartLine, 'qty'>) {
  const lines = [...cart.get()];
  const i = lines.findIndex((l) => l.id === item.id && l.size === item.size);
  if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + 1 };
  else lines.push({ ...item, qty: 1 });
  cart.set(lines);
  cartOpen.set(true);
}

export function removeFromCart(id: string, size: string) {
  cart.set(cart.get().filter((l) => !(l.id === id && l.size === size)));
}
