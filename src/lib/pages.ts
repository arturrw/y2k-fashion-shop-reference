/** Content for the help & about pages linked from the footer, rendered by src/pages/[page].astro. */

// Placeholder address — replace with the real support inbox before launch.
export const CONTACT_EMAIL = 'hello@dcsy2k.example';

export interface InfoSection { title: string; body: string[] }
export interface InfoPage {
  title: string;
  eyebrow: string;
  intro: string;
  sections: InfoSection[];
  /** extra block rendered after the intro */
  extra?: 'size-table' | 'track-form' | 'contact';
}

export const INFO_PAGES: Record<string, InfoPage> = {
  'shipping-returns': {
    title: 'Shipping & returns',
    eyebrow: 'Help',
    intro: 'Every order ships free, worldwide. If a piece is not right, send it back within 30 days.',
    sections: [
      { title: 'Dispatch', body: ['Orders leave our studio within 2–4 business days. Archive and restocked pieces are checked by hand before they ship, so busy drops can take a day longer.'] },
      { title: 'Delivery times', body: ['Europe: 3–6 business days.', 'North America: 5–9 business days.', 'Rest of world: 7–14 business days.', 'You receive a tracking link by email as soon as your parcel is handed to the carrier.'] },
      { title: 'Returns', body: ['You can return unworn items with their tags within 30 days of delivery. Start a return by emailing us your order number and we will send a prepaid label.', 'Refunds go back to the original payment method within 5 business days of the return reaching us.'] },
      { title: 'Exchanges', body: ['Need another size? Mention it in your return email and we will hold the new size for you while your return is on its way.'] },
    ],
  },
  'size-guide': {
    title: 'Size guide',
    eyebrow: 'Help',
    intro: 'Measurements are body measurements in centimetres. Y2K cuts run small on top and long in the leg — size up for a baggier fit.',
    extra: 'size-table',
    sections: [
      { title: 'How to measure', body: ['Chest: around the fullest part, under the arms.', 'Waist: around the narrowest part of your torso. For low-rise jeans, measure 5 cm below your navel instead.', 'Hips: around the fullest part, feet together.'] },
      { title: 'Between sizes?', body: ['Baby tees and crop tops: take the smaller size for the shrunken fit.', 'Hoodies, jackets and baggy denim: take the larger size for the oversized silhouette.'] },
    ],
  },
  'track-order': {
    title: 'Track my order',
    eyebrow: 'Help',
    intro: 'Enter your order number and email to see where your parcel is.',
    extra: 'track-form',
    sections: [
      { title: 'Where is my tracking link?', body: ['We email it the moment your order ships. Check your spam folder, or reach out with your order number and we will resend it.'] },
    ],
  },
  contact: {
    title: 'Contact us',
    eyebrow: 'Help',
    intro: 'Questions about an order, sizing or a piece you have your eye on — we answer every message within one business day.',
    extra: 'contact',
    sections: [
      { title: 'Order questions', body: ['Include your order number so we can find it straight away.'] },
      { title: 'Press & collaborations', body: ['Stylists, photographers and creators: tell us about your project and where you would like to feature our pieces.'] },
    ],
  },
  about: {
    title: 'Our story',
    eyebrow: 'About',
    intro: 'DCS Y2K started as a rail of archive finds in a shared studio and grew into a home for the millennium’s most dramatic silhouettes.',
    sections: [
      { title: 'The archive, re-cut', body: ['We source original early-2000s pieces and produce small runs inspired by them — low-rise denim, chrome hardware, rhinestones and all — updated with better fabrics and fits.'] },
      { title: 'Small drops, no overstock', body: ['Every collection is produced in limited quantities. When a piece sells out, it is gone, which keeps the wardrobe interesting and the warehouse empty.'] },
    ],
  },
  sustainability: {
    title: 'Sustainability',
    eyebrow: 'About',
    intro: 'The most sustainable garment is one that already exists. Archive pieces are at the heart of every drop.',
    sections: [
      { title: 'Vintage first', body: ['A growing part of our catalogue is genuine second-hand clothing, cleaned and repaired in our studio before it is listed.'] },
      { title: 'Made to order runs', body: ['New pieces are produced in small batches to avoid overproduction, using recycled packaging for every order.'] },
      { title: 'Repair, don’t replace', body: ['Lost a rhinestone or broke a buckle? Send it to us and we will repair it for free in the first year.'] },
    ],
  },
  careers: {
    title: 'Careers',
    eyebrow: 'About',
    intro: 'We are a small team of stylists, sourcers and developers obsessed with the turn of the millennium.',
    extra: 'contact',
    sections: [
      { title: 'Open roles', body: ['There are no open positions right now, but we always want to hear from vintage sourcers, photographers and stylists.'] },
      { title: 'How to apply', body: ['Send a short note and a link to your work. We read every application.'] },
    ],
  },
};

/** Body measurements in cm: [size, chest, waist, hips] */
export const SIZE_TABLE = [
  ['XS', '78–82', '60–64', '84–88'],
  ['S', '83–87', '65–69', '89–93'],
  ['M', '88–94', '70–76', '94–100'],
  ['L', '95–101', '77–83', '101–107'],
  ['XL', '102–108', '84–90', '108–114'],
] as const;
