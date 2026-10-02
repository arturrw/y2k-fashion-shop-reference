/**
 * Demo reviews for the seed. Deterministic per product id, so re-seeding gives the same reviews.
 * NOTE: these are placeholder reviews for development — remove them before taking real orders.
 */

interface SeedProduct { id: string; name: string; category: string; gender: string }
export interface SeedReview { productId: string; author: string; rating: number; body: string; imageUrl: string | null; createdAt: Date }

// "Customer photos": Pinterest street shots matching the category and gender (hash → i.pinimg.com URL).
const PHOTO_POOLS: Record<string, string[]> = {
  'jeans-women': [
    '7b137166675d134df509cf7e70667209',
    'b089f277cf449872a1b01a24e11dfa1d',
    '31a1064110793e6a23b8ca26187ab99e',
    '9f358c3a2ca22bd0a2dcbde72f082cc9',
    'b1d86352cf5a6bcf46cfdb7d5c5ee316',
    '06ec51c763d9964b0b9835b1bb0c181e',
    '80e142b7dd72a94ecdaa36a803fa6420',
    '6bf4b73150081179cf3054471779df07',
    '1b794cb9a70306874bd0b0a0ab5ef462',
    '1e8902f1df2dea0565fce4ebdf139d07',
    '61e09a5a36ad258377ccce9189eec074',
  ],
  'jeans-men': [
    '8ad0344af08610b97e7a1188cc5b77c4',
    'dade6faa0d92c3ee90712f438c1453f2',
    'f4f578435949abb33913c30603f88ae2',
    '3c7a712c028f15a61d8e821b61c78e44',
    '2d848e6ab150f4ae8d16c4ae51b20346',
    '19066c29f462e19ccb073ddd0ff3b6fa',
    'bb1cb5f711ca375a18f57a3bbc678424',
    '8b9c4383867029e24bae378ef5ac6502',
    '37a43d650ab7f5e6981ffe20f60e8bf8',
    'cc8b85f274d4ca8194d3e5a5dbb9041b',
    'c3be10e0e386d3195574a1de35850ba6',
  ],
  'hoodies-women': [
    '7fad43bf108612d9fbb0a459950d35c6',
    'f8ca6017ebf91a1843b2420ebf1147bd',
    'cd6d8668a74278adeb6e032cf4890017',
    'e2728a76d7667074364619c4c132e76e',
  ],
  'hoodies-men': [
    '1d18024ae95c78229fc42ca122dcc8fe',
    '4d45bae595bcf723419effa3ee51e028',
    'c39e642f845f5d884318cffd83ba29a9',
    '92769a098fdd3c182bd40ba504c78634',
    'a7430d47add2af21087eecbc5d1375d9',
    'f82e2981d2030502e2593b5b5220d0e6',
    '24a32a1e6de7570caef8f1621cfbe651',
    '8abca4da9d8c4df11e4beb3b8fd67a1c',
    'e479a70b443918405ee3d240c3133723',
    '722d639402e3db7aa9196a5da1953c17',
    'cb5d46779dc7b7095f57302344ae4b5f',
  ],
  'jackets-women': [
    '99953cccb9a5731fca223c93604d9f85',
    '201a7d8743a2b1a5bf9f61343fad9ec2',
    '5bed8a39b53ba4495ac8d94c6a455437',
    '4c2f3d417887e4bc006d65ca9fa37ff9',
    'cfd4de116183515b59cbe531f1d1244e',
    'b3072efadc57714a4e35a8dac5b848f5',
    'c3b16065f89f972f1402eb847b1baf93',
    '146f5cdc1fb916fd087ea10a49f3a2f9',
    'a9b3e7789d26e954371a2dcc302e0605',
    '071196dbca889e105d1dd39af153e85d',
    '8883cc9832715dcb5362bea0359ef17d',
  ],
  'jackets-men': [
    '02d82a29e0c2f7684d9757f89757a4a1',
    '467424ae58e9a5694ea87bfe23db3b6f',
    '1aeba1917ad7760d093ab82868cdc35e',
  ],
  'tops-women': [
    'fbd27f260d4b3e3ab4323ce9bd5f9a27',
    '255c9f5c4196d6be0bb21a8ca171f6ab',
    '9b3ba0f134fd9e8c1adcbcc191b6c978',
    '6a632c304f59aab5f31de0a38d276923',
    '5a50f934c85f635fd0bead29ae667ce5',
    '2e8248268330c56a5917ad532053c2f5',
    '4e91c7e96137f0e0076c3bfb84364162',
    '6f98b65b2bed3f9d6387de03f12fdeed',
    '5e57e5cb315995a35e98888d7c8e0f33',
  ],
  'tops-men': [
    'c5ba560b455b6e8d3f175c7bb185eafe',
    '73c96e744d759cdb1ef5fc545a74ec27',
    'c8eea84cbca3404efcdaae950d6ba822',
    'f070ce271a31a9eaf0a0815351f1609b',
    '3e9fbaf80c8aed2921ec61a4cb6bb682',
    '18d941c7a30950dd26ec70345e97bc27',
  ],
  'sunglasses-women': [
    '26d32f13de400fd316252b4f41738667',
  ],
  'sunglasses-men': [
    '9c74ac400ebfac7e6aa769a1882816ea',
    'f2c77582a1d695f0e668a0c24e4a2737',
    'da05d056114e29e7e8636be6d8275c45',
    '2a75329ccc22cfe0be056a6be5140288',
    '5edae76246a8c4f5a95a184d894203ee',
    '1fa5acba223e8126b5a91ba622a64e9a',
    '45830f46736f34f9a454a201db26cdea',
    '03bcbb110a6794eb7fe3110902020774',
    'e3b523c9829888726768d82a170bb155',
  ],
  'belts-women': [
    '7d50b2d2213f43bbf51aba24e5f852c1',
    '91add5f07cefb2ad146ec7ac187d2a10',
    '9372073b7bdaab1862ae19725ea0f3a2',
    '838b856a8c11a6791721b3d5b34185ce',
    '63e5e8291b9967868db229573a38145b',
    '02b1d6e37bb44d458cf25ec0e054078a',
    '0be33bf5d87d7414862d0665daaba7be',
    'ae6d98d700520795f4da42a1455e601f',
    '152a04da01d3ad6336514d494c4ef313',
    '76c86e70da5169166ae3da80e7933ef7',
  ],
  'belts-men': [
    'b445afb2f0d9313a097d5e6b7c8899f4',
    '059185f9530d1b1c8bb65106f17a0077',
    '6649fe5bcda360fc3776d8f74da545ab',
    '5abb802a9ae8eaad301b80314ecb4a85',
    'e5471fe75b4ddece7a6237ac4e3f4247',
    '3765940aa488051f03acf573514fd120',
    '7d4d537bd8dd0baae724405c223bfe19',
    '76c86e70da5169166ae3da80e7933ef7',
    '3727096722152bc45f2c898e6ea2a4cd',
    '35f741466c0e4bc72ee9db5e7d98707f',
    '8304e65929e8ad846e9153add21b9af5',
  ],
  'beanies-women': [
    '438a8324cd617ce3c636a2a4358409f1',
    '71dd91234f9ef6baf85da25d8d1abf3f',
    '0596f252a43a0b0e845ca78a14781909',
    '35d4f8df14df14fb48b8346cd76970a1',
  ],
  'beanies-men': [
    'dd5feb3962a73dd610de27cc9c736537',
    'd6af542a966ae2030adc671404e06e01',
    '48ed6ec7caf6dc332fb6c0c6a7703402',
    '17b655fb944dfdd64b25438511fd188e',
  ],
  'jewelry-women': [
    '521ab5218a09044fe1551ea2d3c238ff',
    'a9ea5327e8a02642208e4f86c8d6aab5',
    'f8fb253a7440fa5d2a7d8aec01aed882',
    '06d5b681e584aa7a6629c7397290c5e9',
    'c268b23c61006d2e780129e08216dc83',
    '1d79357fc5092fdfd4c4139d1883e2cf',
    'a0d00a3befa0b16e1cd71e72460c1b7c',
    '7fa57808582e24c4580fc6487b56fd84',
    '632409602cdc3fbe2cd2cc33846ed4eb',
    '06b00b27798312ac6ea18cd0ef2b294d',
    '8eb2ccccf150c5f9ab101891f31a497e',
    '33052c36b1c0195483a84839bc60a446',
    'b295d6e18e89e2a25c3948cf273f5efc',
    'c8f701874dd08535506269d25de806d2',
  ],
  'jewelry-men': [
    '065573b4da70b1da245713db9483bb01',
    '0812a560795dd450cf73a26a975e39ef',
    '9b5bf6507f72d01db6e433e285ae59ba',
    '788bfd4c5fa5435d38bd547f389b4fd9',
    '9bcdb38eecccf5d8778d5960790aa363',
    'c27c95a26eb21e4d9695e039aa75f8ae',
    'a335d7f66e82464523bf757b70de787d',
    '144f3566b0319acd3b1eabc7ade34abb',
    'cbf378611f099ed8528031dd8e7c7542',
    '2a681d3865146c6d5053012bd6850dff',
    'c19c48109bb5eb2b1e89cfadb5be3547',
    '83460372fe75016f72e6905e2900f714',
    '7511d53f5c7013e8822f13c7051f9f0c',
    '80e7f55fe947fb5a14a64770c761faed',
    'e9e0b5f7301b2447641318bf9bffe233',
    '8ee3d60c9227957a9886a5414fb9eb00',
    'da3a9acd4294d23e3f6a308b44623cee',
    'e15dee59483982572363fdf522fbdc91',
    'd752ec1eda366e2471b48d4187311f31',
  ],
  'bags-women': [
    'ce8d2d06fc3690463d05654388efefa7',
    '6ecceceb0a26f27078b1eaa542a5b727',
    '8e3263ddaef12269e56e19af3173e6c8',
    '9300819f61c093556d3c1fc2c743610b',
  ],
  'bags-men': [
    'f745d236f2b799de4fd562c2d63bf8c4',
    '0ea3d6c4617458a77369d2a03ca3b5b3',
    'e4b5ac5da7d588560c3c895bcfc9ad97',
    'f38682ad82f0ff2ad8ab77d70e1f576c',
    '3561b4594e274cfccdccf4040d7938bf',
    'ef834f0ad901d77691bffc3552e0accd',
    '2b4af751c81569609f2736b77cd0c1e0',
    '8cfe3109b99ef5689c8ccff776caf8fc',
    '1e1e3850aa5a32d03b0e1e3d4477d77b',
    'aadc23aa968831b565cce7a2c4cb1431',
    'd6ceefb231a7f1a888a21b55b929d459',
    '9f720e51971e5ced4956d8e0d0eb1b9d',
    '3a0123777a426ddefd631970a8b5dcfb',
  ],
};

const pinUrl = (h: string) => `https://i.pinimg.com/736x/${h.slice(0, 2)}/${h.slice(2, 4)}/${h.slice(4, 6)}/${h}.jpg`;

const NAMES = [
  'Mia K.', 'Lexi R.', 'Jade T.', 'Kayla M.', 'Nova P.', 'Sienna L.', 'Bree A.', 'Luna V.', 'Paris D.', 'Amber S.',
  'Destiny W.', 'Tia G.', 'Raven H.', 'Cleo B.', 'Skye N.', 'Ivy F.', 'Zara O.', 'Hailey C.',
  'Marcus J.', 'Dante L.', 'Kai S.', 'Jaden P.', 'Rico M.', 'Tyler B.', 'Andre W.', 'Leo V.', 'Malik R.', 'Nico T.',
  'Ezra K.', 'Jalen D.', 'Theo A.', 'Omar F.', 'Zion H.', 'Kenji O.', 'Sasha E.', 'Robin Q.', 'Alex Y.', 'Sam Z.',
];

type Band = 'good' | 'ok' | 'bad';
const LINES: Record<string, Record<Band, string[]>> = {
  jeans: {
    good: [
      'The wash is even better in person, exactly that early-2000s fade.',
      'Finally a pair that sits properly low without gaping at the back.',
      'Super baggy in the best way, stacks perfectly over my sneakers.',
      'Heavy denim, feels like a real vintage pair. Compliments every time I wear them.',
      'The embroidery is clean and tight, no loose threads anywhere.',
      'Length is perfect for platforms, they just skim the floor.',
    ],
    ok: ['Love the look but the waist runs a little big, I wear a belt.', 'Nice jeans, the wash is a bit darker than the photos.', 'Good quality but the legs are very long, had to hem them.'],
    bad: ['Too stiff for me and the rise was higher than I expected.', 'Sizing was way off, had to send them back.'],
  },
  hoodies: {
    good: [
      'Thick heavyweight fleece, it feels expensive.',
      'The print survived several washes without cracking.',
      'Perfect oversized fit, I sized up and it drapes beautifully.',
      'The zip is chunky metal, not the cheap plastic kind.',
      'Softest hoodie I own and the graphic is so sick.',
    ],
    ok: ['Great graphic, but the sleeves are a little long.', 'Cozy but the hood is smaller than I hoped.', 'Nice hoodie, washed color is lighter than in the photos.'],
    bad: ['Shrunk a bit after the first wash even on cold.', 'Fabric pilled faster than I expected.'],
  },
  jackets: {
    good: [
      'The leather look is so convincing, everyone asks where it is from.',
      'Statement piece, makes any outfit look styled.',
      'The cut is perfect, boxy without swallowing me.',
      'Hardware is solid and the lining is really nice.',
      'Warm enough for autumn and looks incredible with baggy jeans.',
    ],
    ok: ['Beautiful jacket but a little stiff at first, softening up with wear.', 'Fits great, the color is slightly different from the photo.', 'Love it, but the shoulders are wide even for an oversized cut.'],
    bad: ['Too heavy for me, not my style in person.', 'One snap was loose on arrival, support swapped it though.'],
  },
  tops: {
    good: [
      'The perfect shrunken fit, so Y2K.',
      'The print is crisp and the fabric is stretchy and soft.',
      'Wore it with low-rise jeans and felt like a 2003 music video.',
      'Great quality for the price, the seams are really neat.',
      'Washed well, no fading on the graphic.',
    ],
    ok: ['Cute but very cropped, I would size up next time.', 'Nice tee, a little thin but good for layering.', 'Fit is good, the color is a bit brighter than shown.'],
    bad: ['Too short for me and it rode up all day.', 'Fabric felt thinner than I expected.'],
  },
  sunglasses: {
    good: [
      'Look exactly like the photos, the chrome is so shiny.',
      'Lightweight and they actually stay on my face.',
      'The shape is so 2000s, instant outfit upgrade.',
      'Great lenses, real sun protection and not just for looks.',
    ],
    ok: ['Love the style, a little tight behind the ears.', 'Cool shades, the case is quite basic.'],
    bad: ['One arm felt loose after a couple of weeks.'],
  },
  belts: {
    good: [
      'Studs are firmly set, nothing has fallen off.',
      'The buckle is huge and heavy in the best way.',
      'Exactly the belt my low-rise jeans needed.',
      'The rhinestones catch every bit of light, obsessed.',
    ],
    ok: ['Nice belt but I needed to punch an extra hole.', 'Looks great, the strap is a little stiff at first.'],
    bad: ['Smaller than expected, barely fits over baggy jeans.'],
  },
  beanies: {
    good: [
      'Thick knit and it keeps its shape all day.',
      'The pattern is so clean, gets compliments constantly.',
      'Warm without being itchy, wearing it every day.',
    ],
    ok: ['Cute beanie, sits a bit shallow on my head.', 'Nice knit but the cuff unfolds sometimes.'],
    bad: ['A bit too tight for me.'],
  },
  jewelry: {
    good: [
      'Heavy and chunky, it feels like solid silver.',
      'Has not tarnished at all after weeks of wear.',
      'The details are so sharp, love stacking these.',
      'Looks like an archive piece, people always ask about it.',
    ],
    ok: ['Beautiful, but runs a little small.', 'Nice piece, the finish is a bit darker than shown.'],
    bad: ['The clasp feels fragile.'],
  },
  bags: {
    good: [
      'Fits my phone, wallet and keys with room to spare.',
      'The hardware is so good, the bag looks way more expensive than it is.',
      'Strap length is perfect, sits right under the arm.',
      'Leather looks like real vintage, completes every outfit.',
    ],
    ok: ['Great bag, smaller inside than it looks.', 'Love it, the strap could be a bit longer.'],
    bad: ['The zip got stuck a few times.'],
  },
};

const EXTRAS: Record<Band, string[]> = {
  good: ['Shipping was fast too.', 'Already planning my next order.', 'Packaging was so cute.', '10/10 would buy again.', ''],
  ok: ['Still happy with it overall.', 'Would buy from here again.', ''],
  bad: ['Customer service was helpful though.', ''],
};

// Small deterministic PRNG (mulberry32) seeded from the product id.
function rng(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, list: T[]) => list[Math.floor(r() * list.length)];

function rating(r: () => number) {
  const x = r();
  const whole = x < 0.5 ? 5 : x < 0.8 ? 4 : x < 0.92 ? 3 : x < 0.97 ? 2 : 1;
  // some reviewers give half stars, e.g. 4.5
  return whole < 5 && r() < 0.3 ? whole + 0.5 : whole;
}

export function buildReviews(products: readonly SeedProduct[], now = new Date('2026-10-01T12:00:00Z')): SeedReview[] {
  const out: SeedReview[] = [];
  for (const p of products) {
    const r = rng(p.id);
    const kind = p.category === 'belts' && /beanie/i.test(p.name) ? 'beanies' : p.category;
    const photos = PHOTO_POOLS[`${kind}-${p.gender}`] ?? [];
    const count = 3 + Math.floor(r() * 6);
    const usedNames = new Set<string>();
    const usedLines = new Set<string>();
    for (let i = 0; i < count; i++) {
      const stars = rating(r);
      const band: Band = stars >= 4 ? 'good' : stars === 3 ? 'ok' : 'bad';
      let author = pick(r, NAMES);
      while (usedNames.has(author)) author = pick(r, NAMES);
      usedNames.add(author);
      // prefer a line this product hasn't used yet
      const fresh = LINES[kind][band].filter((l) => !usedLines.has(l));
      const line = pick(r, fresh.length ? fresh : LINES[kind][band]);
      usedLines.add(line);
      const body = [line, pick(r, EXTRAS[band])].filter(Boolean).join(' ');
      const withPhoto = photos.length > 0 && stars >= 3 && r() < 0.35;
      out.push({
        productId: p.id,
        author,
        rating: stars,
        body,
        imageUrl: withPhoto ? pinUrl(pick(r, photos)) : null,
        createdAt: new Date(now.getTime() - Math.floor(r() * 240 * 864e5)),
      });
    }
  }
  return out;
}
