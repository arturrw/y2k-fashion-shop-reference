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
