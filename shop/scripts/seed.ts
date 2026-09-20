import { db } from '../src/db';
import { products } from '../src/db/schema';

const FEATURED_IDS: string[] = ['w-jeans-1', 'm-hood-1', 'w-top-2', 'u-sun-1', 'm-jeans-1', 'u-bag-1', 'w-hood-1', 'u-jewel-2', 'm-top-1', 'u-belt-1'];

const PRODUCTS = [
  { id: 'w-jeans-1', name: 'Low-Rise Butterfly Jeans', category: 'jeans', gender: 'women', price: 52, aspect: '3/4', desc: 'Butterfly embroidery down the leg on an authentic low-rise cut.' },
  { id: 'w-jeans-2', name: 'Frayed Flare Denim', category: 'jeans', gender: 'women', price: 48, aspect: '4/5', desc: 'Raw-hem flares with a lived-in wash, made for platform boots.' },
  { id: 'm-jeans-1', name: 'Baggy Cargo Denim', category: 'jeans', gender: 'men', price: 54, aspect: '4/5', desc: 'Utility pockets and a dropped seat for that skater-baggy fit.' },
  { id: 'm-jeans-2', name: 'Distressed Skater Jorts', category: 'jeans', gender: 'men', price: 38, aspect: '1/1', desc: 'Below-the-knee jorts, heavily distressed, built to layer over tights or alone.' },
  { id: 'w-hood-1', name: 'Star Motif Zip Hoodie', category: 'hoodies', gender: 'women', price: 46, aspect: '4/5', desc: 'Cropped zip-up covered in scattered star patches.' },
  { id: 'w-hood-2', name: 'Cropped Chrome Hoodie', category: 'hoodies', gender: 'women', price: 44, aspect: '3/4', desc: 'Metallic chrome print on cropped fleece, made for layering under a bomber.' },
  { id: 'm-hood-1', name: 'Logo Mania Zip Hoodie', category: 'hoodies', gender: 'men', price: 50, aspect: '4/5', desc: 'Oversized zip hoodie stacked with logo prints, an early-2000s wardrobe staple.' },
  { id: 'm-hood-2', name: 'Oversized Graphic Hoodie', category: 'hoodies', gender: 'men', price: 48, aspect: '1/1', desc: 'Drop-shoulder fit with a bold front graphic and ribbed cuffs.' },
  { id: 'w-top-1', name: 'Bedazzled Baby Tee', category: 'tops', gender: 'women', price: 26, aspect: '3/4', desc: 'Fitted baby tee with rhinestone lettering across the chest.' },
  { id: 'w-top-2', name: 'Iridescent Crop Top', category: 'tops', gender: 'women', price: 28, aspect: '1/1', desc: 'Shiny iridescent fabric that shifts color as it catches the light.' },
  { id: 'w-top-3', name: 'Butterfly Mesh Cami', category: 'tops', gender: 'women', price: 24, aspect: '4/5', desc: 'Sheer mesh cami with butterfly appliqués, layer over a bandeau.' },
  { id: 'm-top-1', name: 'Y2K Logo Graphic Tee', category: 'tops', gender: 'men', price: 22, aspect: '3/4', desc: 'Faded logo-mania graphic on a boxy, relaxed tee.' },
  { id: 'm-top-2', name: 'Cyber Mesh Long Sleeve', category: 'tops', gender: 'men', price: 30, aspect: '4/5', desc: 'Fitted mesh long sleeve for that cyber-Y2K silhouette.' },
  { id: 'u-sun-1', name: 'Rhinestone Star Shades', category: 'sunglasses', gender: 'unisex', price: 18, aspect: '1/1', desc: 'Small tinted frames edged in rhinestone stars.' },
  { id: 'u-sun-2', name: 'Shield Wraparound Shades', category: 'sunglasses', gender: 'unisex', price: 20, aspect: '1/1', desc: 'Single-lens wraparound shield with a chrome finish.' },
  { id: 'u-belt-1', name: 'Chain Link Belt', category: 'belts', gender: 'unisex', price: 16, aspect: '3/4', desc: 'Low-slung metal chain belt, the finishing touch on baggy denim.' },
  { id: 'u-belt-2', name: 'Butterfly Clip Beanie', category: 'belts', gender: 'unisex', price: 14, aspect: '1/1', desc: 'Ribbed beanie with a butterfly clip pinned to the fold.' },
  { id: 'u-jewel-1', name: 'Chunky Hoop Earrings', category: 'jewelry', gender: 'unisex', price: 15, aspect: '1/1', desc: 'Oversized chunky hoops in a brushed gold finish.' },
  { id: 'u-jewel-2', name: 'Y2K Star Pendant Necklace', category: 'jewelry', gender: 'unisex', price: 19, aspect: '1/1', desc: 'Layered chain necklace with a star pendant drop.' },
  { id: 'u-bag-1', name: 'Baguette Chain Bag', category: 'bags', gender: 'unisex', price: 34, aspect: '1/1', desc: 'Compact baguette bag on a metal chain strap.' },
  { id: 'u-bag-2', name: 'Mini Metallic Shoulder Bag', category: 'bags', gender: 'unisex', price: 36, aspect: '3/4', desc: 'Mini shoulder bag in a metallic finish with a top handle.' },
] as const;

await db.delete(products);
await db.insert(products).values(
  PRODUCTS.map((p) => ({ ...p, description: p.desc, featured: FEATURED_IDS.includes(p.id) })).map(({ desc, ...rest }) => rest),
);
console.log(`Seeded ${PRODUCTS.length} products`);
process.exit(0);
