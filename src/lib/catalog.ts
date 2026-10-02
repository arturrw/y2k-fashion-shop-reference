export const CATEGORIES = [
  { key: 'jeans', label: 'Baggy jeans & jorts' },
  { key: 'hoodies', label: 'Hoodies & jumpers' },
  { key: 'jackets', label: 'Jackets' },
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
  {
    title: 'Shop',
    links: [
      { label: 'Women', href: '/shop?gender=women' },
      { label: 'Men', href: '/shop?gender=men' },
      { label: 'New drops', href: '/#trending' },
      { label: 'Accessories', href: '/shop?category=accessories' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & returns', href: '/shipping-returns' },
      { label: 'Size guide', href: '/size-guide' },
      { label: 'Track my order', href: '/track-order' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Careers', href: '/careers' },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
] as const;

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
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
