export const products = [
  // Nike products
  {
    id: 'nike-air-max-1',
    brand: 'Nike',
    name: 'Nike Jordan 4 Retro OG',
    price: 2499.0,
    image: 'assets/kicks/White J4 Both.jpg',
    description:
      'The original Air Max, a timeless classic that started it all. Featuring visible Air cushioning and iconic design lines.',
    features: [
      'Visible Max Air unit in the heel for classic cushioning.',
      'Waffle outsole for durable traction.',
      'Padded, low-cut collar looks sleek and feels great.',
      'Original 1987 design elements.',
    ],
    otherImages: [
      'assets/kicks/White J4 Right.jpg',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Nike+Air+Max+1+Back',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Nike+Air+Max+1+Sole',
    ],
  },
  {
    id: 'adidas-superstar',
    brand: 'Nike', // <-- This product looks like Nike, but name says Adidas. Check and fix brand if needed.
    name: 'Nike Air Force 1 Hightop Black',
    price: 1899.0,
    image: 'assets/kicks 2/Black AF1 High Both.jpg',
    description:
      'The legendary shell-toe sneaker, a staple of street culture since the 80s. Premium leather and classic detailing.',
    features: [
      'Full-grain leather upper for comfort and soft feel.',
      'Classic rubber shell toe.',
      'Herringbone-pattern rubber cupsole.',
      'Authentic 80s silhouette.',
    ],
    otherImages: [
      'assets/kicks 2/Black AF1 High Right.jpg',
      'assets/kicks 2/Black AF1 High Back.jpg',
      'assets/kicks 2/Black AF1 High Front.jpg',
    ],
  },

  // Puma products
  {
    id: 'puma-suede-classic',
    brand: 'Puma',
    name: 'Puma Suede Classic',
    price: 1599.0,
    image: 'assets/kicks 2/Puma X LULU Black/Green Both.jpg',
    description:
      'A true icon of sport and street style, the Puma Suede has been making waves since 1968. Timeless and versatile.',
    features: [
      'Full suede upper for a premium look and feel.',
      'Rubber outsole for grip.',
      'Gold foil PUMA Suede branding.',
      'Original 1968 design.',
    ],
    otherImages: [
      'assets/kicks 2/Puma X LULU Black/Green Right.jpg',
      'assets/kicks 2/Puma X LULU Black/Green Front.jpg',
      'assets/kicks 2/Puma X LULU Black/Green Back.jpg',
      'assets/kicks 2/Puma X LULU Black/Green Soul & Front.jpg',
      'assets/kicks 2/Puma X LULU Black/Green Fitted.jpg',
    ],
  },

  // New Balance products
  {
    id: 'new-balance-574',
    brand: 'New Balance',
    name: 'New Balance 574 Classic',
    price: 2199.0,
    image:
      'https://placehold.co/400x300/F3F4F6/6B7280?text=New+Balance+574+Front',
    description:
      'The quintessential New Balance sneaker, known for its versatility, comfort, and understated style. A true retro runner.',
    features: [
      'ENCAP midsole cushioning combines soft foam with a durable polyurethane rim.',
      'Lightweight EVA foam cushioning in the midsole and heel.',
      'Suede and mesh upper.',
      'Classic 80s running silhouette.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=New+Balance+574+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=New+Balance+574+Heel',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=New+Balance+574+Toe',
    ],
  },

  // Converse products
  {
    id: 'converse-chuck-70',
    brand: 'Converse',
    name: 'Converse Chuck 70 High-Top',
    price: 1799.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=Chuck+70+Front',
    description:
      'The Chuck 70 brings back the original design from the 1970s, with premium materials and improved cushioning.',
    features: [
      'Heavier-grade canvas for durability.',
      'More cushioning and a slightly higher rubber foxing.',
      'Vintage license plate branding.',
      'Iconic 70s high-top design.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Chuck+70+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Chuck+70+Laces',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Chuck+70+Patch',
    ],
  },

  // Vans products
  {
    id: 'vans-old-skool',
    brand: 'Vans',
    name: 'Vans Old Skool OG',
    price: 1699.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=Vans+Old+Skool+Front',
    description:
      'The classic Vans skate shoe and the first to bear the iconic sidestripe. Durable and stylish for everyday wear.',
    features: [
      'Sturdy suede and canvas uppers.',
      'Re-enforced toe caps to withstand repeated wear.',
      'Padded collars for support and flexibility.',
      'Signature rubber waffle outsoles.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Vans+Old+Skool+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Vans+Old+Skool+Back',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Vans+Old+Skool+Stripe',
    ],
  },

  // Reebok products
  {
    id: 'reebok-classic-leather',
    brand: 'Reebok',
    name: 'Reebok Classic Leather',
    price: 1499.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=Reebok+Classic+Front',
    description:
      'A timeless silhouette, the Reebok Classic Leather offers comfort and style that never fades. Perfect for everyday wear.',
    features: [
      'Soft garment leather upper for instant comfort.',
      'Die-cut EVA midsole provides lightweight cushioning.',
      'High-abrasion rubber outsole for durability.',
      'Iconic side stripes.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Reebok+Classic+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Reebok+Classic+Top',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Reebok+Classic+Heel',
    ],
  },

  // ASICS products
  {
    id: 'asics-gel-lyte-iii',
    brand: 'ASICS',
    name: 'ASICS GEL-Lyte III',
    price: 2299.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=ASICS+Gel-Lyte+Front',
    description:
      'Known for its split-tongue design and GEL cushioning, the GEL-Lyte III is a retro running favorite.',
    features: [
      'Split-tongue design eliminates tongue slippage.',
      'GEL technology cushioning for excellent shock absorption.',
      'Suede and mesh upper for breathability and comfort.',
      'Original 90s running aesthetic.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=ASICS+Gel-Lyte+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=ASICS+Gel-Lyte+Split',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=ASICS+Gel-Lyte+Sole',
    ],
  },

  // Brooks products
  {
    id: 'brooks-chariot',
    brand: 'Brooks',
    name: 'Brooks Chariot',
    price: 1699.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=Brooks+Chariot+Front',
    description:
      'Originally released in 1982, the Brooks Chariot offers classic running style with modern comfort.',
    features: [
      'Full-grain leather and suede overlays.',
      'Molded EVA midsole for cushioning.',
      'Rubber outsole for traction.',
      'Retro running silhouette.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Brooks+Chariot+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Brooks+Chariot+Back',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Brooks+Chariot+Detail',
    ],
  },

  // Saucony products
  {
    id: 'saucony-jazz-original',
    brand: 'Saucony',
    name: 'Saucony Jazz Original',
    price: 1399.0,
    image: 'https://placehold.co/400x300/F3F4F6/6B7280?text=Saucony+Jazz+Front',
    description:
      'A true classic since 1981, the Jazz Original combines comfort, style, and a lightweight design.',
    features: [
      'Suede and nylon upper for long-lasting durability.',
      'Padded collar and tongue for a comfortable fit.',
      'Shock-absorbing EVA midsole.',
      'Durable rubber traction outsole.',
    ],
    otherImages: [
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Saucony+Jazz+Side',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Saucony+Jazz+Top',
      'https://placehold.co/400x300/F3F4F6/6B7280?text=Saucony+Jazz+Logo',
    ],
  },
];
