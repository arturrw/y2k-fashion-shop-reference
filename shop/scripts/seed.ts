import { db } from '../src/db';
import { products } from '../src/db/schema';

const FEATURED_IDS: string[] = ['w-jeans-1', 'm-hood-1', 'w-top-2', 'u-sun-1', 'm-jeans-1', 'u-bag-1', 'w-hood-1', 'u-jewel-2', 'm-top-1', 'u-belt-1'];

const PRODUCTS = [
  { id: 'w-jeans-1', name: 'Low-Rise Butterfly Jeans', category: 'jeans', gender: 'women', price: 52, aspect: '3/4', desc: 'Butterfly embroidery down the leg on an authentic low-rise cut.', imageUrl: 'https://i.pinimg.com/736x/03/8e/9f/038e9f5f50af1c8f3ab45fbc66c6d034.jpg' },
  { id: 'w-jeans-2', name: 'Frayed Flare Denim', category: 'jeans', gender: 'women', price: 48, aspect: '4/5', desc: 'Raw-hem flares with a lived-in wash, made for platform boots.', imageUrl: 'https://i.pinimg.com/originals/07/75/33/0775337beaa7613150e3fce4a3cede50.jpg' },
  { id: 'm-jeans-1', name: 'Baggy Cargo Denim', category: 'jeans', gender: 'men', price: 54, aspect: '4/5', desc: 'Utility pockets and a dropped seat for that skater-baggy fit.', imageUrl: 'https://i.pinimg.com/originals/8e/7b/c0/8e7bc0d50958be962963ae7c32e9b4a8.jpg' },
  { id: 'm-jeans-2', name: 'Distressed Skater Jorts', category: 'jeans', gender: 'men', price: 38, aspect: '1/1', desc: 'Below-the-knee jorts, heavily distressed, built to layer over tights or alone.', imageUrl: 'https://i.pinimg.com/originals/08/38/72/0838728ae91a61be20cada32bfcfa665.jpg' },
  { id: 'w-hood-1', name: 'Star Motif Zip Hoodie', category: 'hoodies', gender: 'women', price: 46, aspect: '4/5', desc: 'Cropped zip-up covered in scattered star patches.', imageUrl: 'https://i.pinimg.com/736x/02/23/f2/0223f2318e369e87a1c89efe76436560.jpg' },
  { id: 'w-hood-2', name: 'Cropped Chrome Hoodie', category: 'hoodies', gender: 'women', price: 44, aspect: '3/4', desc: 'Metallic chrome print on cropped fleece, made for layering under a bomber.', imageUrl: 'https://i.pinimg.com/originals/04/e7/3c/04e73c77a51e52bf5130099641da6d0a.jpg' },
  { id: 'm-hood-1', name: 'Logo Mania Zip Hoodie', category: 'hoodies', gender: 'men', price: 50, aspect: '4/5', desc: 'Oversized zip hoodie stacked with logo prints, an early-2000s wardrobe staple.', imageUrl: 'https://i.pinimg.com/originals/03/da/61/03da61342de8699c1546749ddf88fb76.jpg' },
  { id: 'm-hood-2', name: 'Oversized Graphic Hoodie', category: 'hoodies', gender: 'men', price: 48, aspect: '1/1', desc: 'Drop-shoulder fit with a bold front graphic and ribbed cuffs.', imageUrl: 'https://i.pinimg.com/originals/04/53/84/0453844b5375857d174505f27755b30e.jpg' },
  { id: 'w-top-1', name: 'Bedazzled Baby Tee', category: 'tops', gender: 'women', price: 26, aspect: '3/4', desc: 'Fitted baby tee with rhinestone lettering across the chest.', imageUrl: 'https://i.pinimg.com/originals/01/a1/dd/01a1ddc485e023e48c059c685eac7119.jpg' },
  { id: 'w-top-2', name: 'Iridescent Crop Top', category: 'tops', gender: 'women', price: 28, aspect: '1/1', desc: 'Shiny iridescent fabric that shifts color as it catches the light.', imageUrl: 'https://i.pinimg.com/originals/03/f9/d4/03f9d4048caecedb7c438711973dd9cc.jpg' },
  { id: 'w-top-3', name: 'Butterfly Mesh Cami', category: 'tops', gender: 'women', price: 24, aspect: '4/5', desc: 'Sheer mesh cami with butterfly appliqués, layer over a bandeau.', imageUrl: 'https://i.pinimg.com/originals/2c/2d/ed/2c2dede88e34d4794c47aa8d1eacee33.jpg' },
  { id: 'm-top-1', name: 'Y2K Logo Graphic Tee', category: 'tops', gender: 'men', price: 22, aspect: '3/4', desc: 'Faded logo-mania graphic on a boxy, relaxed tee.', imageUrl: 'https://i.pinimg.com/736x/50/9a/18/509a18876c145cb1e4e4d5d6daf73efd.jpg' },
  { id: 'm-top-2', name: 'Cyber Mesh Long Sleeve', category: 'tops', gender: 'men', price: 30, aspect: '4/5', desc: 'Fitted mesh long sleeve for that cyber-Y2K silhouette.', imageUrl: 'https://i.pinimg.com/originals/06/c5/11/06c511fb81d8b14cc45f41c16a135843.jpg' },
  { id: 'u-sun-1', name: 'Rhinestone Star Shades', category: 'sunglasses', gender: 'unisex', price: 18, aspect: '1/1', desc: 'Small tinted frames edged in rhinestone stars.', imageUrl: 'https://i.pinimg.com/originals/05/5d/84/055d84e7e3f0bf198fea6bbf4fdece58.jpg' },
  { id: 'u-sun-2', name: 'Shield Wraparound Shades', category: 'sunglasses', gender: 'unisex', price: 20, aspect: '1/1', desc: 'Single-lens wraparound shield with a chrome finish.', imageUrl: 'https://i.pinimg.com/originals/d4/30/00/d4300099214c3d638176b917f86af5c8.jpg' },
  { id: 'u-belt-1', name: 'Chain Link Belt', category: 'belts', gender: 'unisex', price: 16, aspect: '3/4', desc: 'Low-slung metal chain belt, the finishing touch on baggy denim.', imageUrl: 'https://i.pinimg.com/736x/8b/63/a4/8b63a44257571a9559ca70860f88377e.jpg' },
  { id: 'u-belt-2', name: 'Butterfly Clip Beanie', category: 'belts', gender: 'unisex', price: 14, aspect: '1/1', desc: 'Ribbed beanie with a butterfly clip pinned to the fold.', imageUrl: 'https://i.pinimg.com/originals/8e/8a/ff/8e8aff279c3139225f4a94497ff83ec4.jpg' },
  { id: 'u-jewel-1', name: 'Chunky Hoop Earrings', category: 'jewelry', gender: 'unisex', price: 15, aspect: '1/1', desc: 'Oversized chunky hoops in a brushed gold finish.', imageUrl: 'https://i.pinimg.com/originals/d6/a6/6d/d6a66dabcf55eea2ac82d40575158c5b.jpg' },
  { id: 'u-jewel-2', name: 'Y2K Star Pendant Necklace', category: 'jewelry', gender: 'unisex', price: 19, aspect: '1/1', desc: 'Layered chain necklace with a star pendant drop.', imageUrl: 'https://i.pinimg.com/originals/e7/9d/a1/e79da1878e2528d01cc03240be28a5d9.jpg' },
  { id: 'u-bag-1', name: 'Baguette Chain Bag', category: 'bags', gender: 'unisex', price: 34, aspect: '1/1', desc: 'Compact baguette bag on a metal chain strap.', imageUrl: 'https://i.pinimg.com/originals/7a/e5/6b/7ae56b9a454ae56aa3b8b9dd9ab6fe72.jpg' },
  { id: 'u-bag-2', name: 'Mini Metallic Shoulder Bag', category: 'bags', gender: 'unisex', price: 36, aspect: '3/4', desc: 'Mini shoulder bag in a metallic finish with a top handle.', imageUrl: 'https://i.pinimg.com/736x/58/ef/c9/58efc97fc54fa88d045cf3bac4b82db3.jpg' },
  { id: 'w-jack-1', name: 'Draped Funnel-Collar Jacket', category: 'jackets', gender: 'women', price: 88, aspect: '4/5', desc: 'Oversized black leather jacket with a dramatic draped funnel collar, avant-garde silhouette.', imageUrl: 'https://i.pinimg.com/736x/01/26/69/0126695b961226da44862b2989f26095.jpg' },
  { id: 'm-jack-1', name: 'Distressed Asymmetric Moto Jacket', category: 'jackets', gender: 'men', price: 84, aspect: '4/5', desc: 'Oversized black leather moto jacket with an asymmetric zip and a high funnel collar.', imageUrl: 'https://i.pinimg.com/originals/02/26/91/022691a775547a904ba6609207e6a661.jpg' },
  { id: 'w-tank-1', name: 'Ribbed Racerback Tank', category: 'tops', gender: 'women', price: 20, aspect: '4/5', desc: 'Fitted ribbed racerback tank in washed grey, layers under anything oversized.', imageUrl: 'https://i.pinimg.com/originals/9e/4c/26/9e4c26e73ff9a08779b35b71ed214c59.jpg' },
  { id: 'm-tank-1', name: 'Ribbed Wife-Beater Tank', category: 'tops', gender: 'men', price: 18, aspect: '4/5', desc: 'Classic ribbed A-shirt tank in black, the base layer under every oversized fit.', imageUrl: 'https://i.pinimg.com/originals/18/4a/e9/184ae9a39c689adcd03db0bb6ed242a6.jpg' },
] as const;

await db.delete(products);
await db.insert(products).values(
  PRODUCTS.map((p) => ({ ...p, description: p.desc, featured: FEATURED_IDS.includes(p.id) })).map(({ desc, ...rest }) => rest),
);
console.log(`Seeded ${PRODUCTS.length} products`);
process.exit(0);
