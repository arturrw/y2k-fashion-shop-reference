export const CATEGORIES = [
  { key: 'jeans', label: 'Baggy jeans & jorts' },
  { key: 'hoodies', label: 'Hoodies & jumpers' },
  { key: 'tops', label: 'Crop tops & baby tees' },
  { key: 'sunglasses', label: 'Sunglasses' },
  { key: 'belts', label: 'Belts & beanies' },
  { key: 'jewelry', label: 'Jewelry & rings' },
  { key: 'bags', label: 'Bags' },
] as const;

export const ACCESSORY_CATS = ['sunglasses', 'belts', 'jewelry', 'bags'];
export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
);
export const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export const FOOTER_COLUMNS = [
  { title: 'Shop', links: ['Women', 'Men', 'New drops', 'Accessories'] },
  { title: 'Help', links: ['Shipping & returns', 'Size guide', 'Track my order', 'Contact us'] },
  { title: 'About', links: ['Our story', 'Sustainability', 'Careers'] },
  { title: 'Follow', links: ['Instagram', 'TikTok', 'Pinterest'] },
];

export interface NavItem { label: string; href: string }
export interface NavTab extends NavItem { items: NavItem[] }

const shopHref = (gender?: string, category?: string) => {
  const q = new URLSearchParams();
  if (gender) q.set('gender', gender);
  if (category) q.set('category', category);
  return `/shop${q.size ? '?' + q : ''}`;
};
const byCategory = (gender?: string) =>
  CATEGORIES.map((c) => ({ label: c.label, href: shopHref(gender, c.key) }));

export const NAV: NavTab[] = [
  { label: 'All', href: '/shop', items: [{ label: 'All products', href: '/shop' }, ...byCategory()] },
  { label: 'Mens', href: shopHref('men'), items: [{ label: "All men's", href: shopHref('men') }, ...byCategory('men')] },
  { label: 'Womens', href: shopHref('women'), items: [{ label: "All women's", href: shopHref('women') }, ...byCategory('women')] },
  {
    label: 'Themed Collections',
    href: shopHref(undefined, 'accessories'),
    items: [
      { label: 'All accessories', href: shopHref(undefined, 'accessories') },
      ...CATEGORIES.filter((c) => ACCESSORY_CATS.includes(c.key)).map((c) => ({ label: c.label, href: shopHref(undefined, c.key) })),
    ],
  },
  {
    label: 'New Collections',
    href: '/shop',
    items: [{ label: 'New arrivals', href: '/shop' }, { label: 'Trending now', href: '/#trending' }],
  },
];
