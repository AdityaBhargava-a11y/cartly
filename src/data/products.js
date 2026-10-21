// Seed catalogue — 8 sample products with realistic Indian market prices.
export const LOW_STOCK_THRESHOLD = 5

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
]

export function gradientFor(index) {
  return GRADIENTS[Math.abs(index) % GRADIENTS.length]
}

export const seedProducts = [
  {
    id: 'p1',
    name: 'boAt Airdopes 141 TWS Earbuds',
    description: '42-hour battery, BEAST low-latency mode, IPX4 water resistance.',
    category: 'Audio',
    price: 1099,
    stock: 24,
    emoji: '🎧',
    gradient: gradientFor(0),
  },
  {
    id: 'p2',
    name: 'Mi Smart TV 4A 43-inch Full HD',
    description: 'Android TV with built-in Chromecast and 20W Dolby speakers.',
    category: 'Televisions',
    price: 22999,
    stock: 6,
    emoji: '📺',
    gradient: gradientFor(1),
  },
  {
    id: 'p3',
    name: 'Prestige Granite Non-Stick Kadai 24cm',
    description: '5-layer granite coating, induction-friendly, PFOA free.',
    category: 'Kitchen',
    price: 1749,
    stock: 3,
    emoji: '🍳',
    gradient: gradientFor(2),
  },
  {
    id: 'p4',
    name: 'Wildcraft Dominator 44L Backpack',
    description: 'Padded laptop sleeve, rain cover, ideal for travel and college.',
    category: 'Bags',
    price: 1299,
    stock: 40,
    emoji: '🎒',
    gradient: gradientFor(3),
  },
  {
    id: 'p5',
    name: 'Milton Thermosteel Flask 1 Litre',
    description: '24-hour heat retention, vacuum insulated stainless steel.',
    category: 'Kitchen',
    price: 849,
    stock: 12,
    emoji: '🥤',
    gradient: gradientFor(4),
  },
  {
    id: 'p6',
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    description: 'Responsive Air Zoom cushioning for daily training runs.',
    category: 'Footwear',
    price: 9695,
    stock: 5,
    emoji: '👟',
    gradient: gradientFor(5),
  },
  {
    id: 'p7',
    name: "Levi's 511 Slim Fit Jeans",
    description: 'Stretch denim with a modern slim cut, mid-rise waist.',
    category: 'Fashion',
    price: 2199,
    stock: 18,
    emoji: '👖',
    gradient: gradientFor(6),
  },
  {
    id: 'p8',
    name: 'Duracell AA Batteries (16 Pack)',
    description: 'Long-lasting alkaline power for remotes, toys and clocks.',
    category: 'Electronics',
    price: 499,
    stock: 60,
    emoji: '🔋',
    gradient: gradientFor(7),
  },
]
