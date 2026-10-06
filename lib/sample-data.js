export const SAMPLE_PRODUCTS = [
  {
    _id: "prod-001",
    name: "Premium Oversized Hoodie",
    slug: "premium-oversized-hoodie",
    description: "Constructed from 480 GSM organic french terry fleece. Features dropped shoulders, a double-layered hood without drawstrings for an ultra-clean architectural aesthetic, and ribbed cuffs engineered to hold their shape throughout winter.",
    details: [
      "480 GSM Heavyweight French Terry Cotton",
      "Signature double-layered seamless hood",
      "Dropped shoulders & boxy oversized drape",
      "Pre-shrunk to maintain silhouette after wash",
      "Crafted in Dhaka, Bangladesh"
    ],
    material: "100% Combed Organic Cotton Fleece",
    price: 1490,
    oldPrice: 1890,
    category: "Hoodies",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Black", "Cream", "Brown"],
    sizes: ["M", "L", "XL"],
    stock: 28,
    featured: true,
    newArrival: true,
    createdAt: new Date("2026-09-15T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-002",
    name: "Heavyweight Crewneck",
    slug: "heavyweight-crewneck",
    description: "An everyday luxury layer designed with heavy ribbing at the neck, hem, and cuffs. The minimalist chest profile pairs seamlessly under winter coats or over raw-hem tees.",
    details: [
      "450 GSM Heavy loopback fleece",
      "Reinforced neckband that will never stretch",
      "Relaxed chest with fitted waist rib",
      "Garment-dyed for depth of color"
    ],
    material: "95% Organic Cotton, 5% Elastane Rib",
    price: 1690,
    oldPrice: 2090,
    category: "Sweatshirts",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Washed Charcoal", "Off-White", "Earth Brown"],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    featured: true,
    newArrival: true,
    createdAt: new Date("2026-09-18T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-003",
    name: "Essential Winter Sweatshirt",
    slug: "essential-winter-sweatshirt",
    description: "Minimalist sweatshirt tailored for everyday warmth. Subtle tonal branding near the lower hem and tailored sleeve paneling for modern urban comfort.",
    details: [
      "400 GSM brushed interior lining",
      "Clean tonal flatlock stitching",
      "Engineered for sub-15°C urban climates",
      "Soft brushed feel inside"
    ],
    material: "100% Brushed Fleece Cotton",
    price: 1490,
    oldPrice: null,
    category: "Sweatshirts",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Deep Black", "Oatmeal Heather", "Slate Grey"],
    sizes: ["M", "L", "XL"],
    stock: 35,
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-09-20T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-004",
    name: "Classic Knit Sweater",
    slug: "classic-knit-sweater",
    description: "Chunky ribbed knit pullover featuring an exaggerated crew collar and an open dropped shoulder. Delivers tactile warmth without excessive weight.",
    details: [
      "7-gauge heavyweight rib knit",
      "Anti-pilling treatment",
      "Breathable thermal heat retention",
      "Relaxed contemporary drape"
    ],
    material: "60% Merino Wool Blend, 40% Acrylic",
    price: 1890,
    oldPrice: 2290,
    category: "Sweaters",
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Oatmeal", "Charcoal Melange", "Forest Green"],
    sizes: ["S", "M", "L", "XL"],
    stock: 19,
    featured: true,
    newArrival: false,
    createdAt: new Date("2026-09-10T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-005",
    name: "Urban Puffer Jacket",
    slug: "urban-puffer-jacket",
    description: "Architectural boxy puffer insulated with eco-down filling. Featuring waterproof reverse-coil zips, fleece-lined welt pockets, and an internal shockcord hem to adjust your crop.",
    details: [
      "Water-repellent matte nylon shell",
      "High thermal synthetic insulation down-alternative",
      "Heavy-duty matte black YKK dual zipper",
      "Interior zip stash pocket for smartphone & cards"
    ],
    material: "Shell: 100% Matte Ripstop Nylon; Fill: Eco-Down Polyfill",
    price: 2990,
    oldPrice: 3590,
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Matte Black", "Graphite Grey", "Sand"],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 15,
    featured: true,
    newArrival: true,
    createdAt: new Date("2026-09-22T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-006",
    name: "Minimal Wool Sweater",
    slug: "minimal-wool-sweater",
    description: "Finely spun wool blend with a velvety handfeel and clean tubular trims. The ultimate editorial staple for layered styling with outerwear.",
    details: [
      "Fine 12-gauge gauge knit",
      "Seamless collar transition",
      "Naturally moisture-wicking and odor resistant",
      "Tailored modern cut"
    ],
    material: "70% Virgin Wool, 30% Fine Cashmere Acrylic",
    price: 2490,
    oldPrice: 2890,
    category: "Sweaters",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Pitch Black", "Camel", "Concrete Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    featured: true,
    newArrival: false,
    createdAt: new Date("2026-09-08T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-007",
    name: "Relaxed Winter Jacket",
    slug: "relaxed-winter-jacket",
    description: "Workwear-inspired chore coat cut from heavy cotton canvas with a soft quilted diamond-stitched interior. Features heavy metal hardware and four utility pockets.",
    details: [
      "12 oz Heavyweight cotton duck canvas",
      "Quilted insulated diamond lining",
      "Fold-down corduroy collar accent",
      "Reinforced bartacks at stress points"
    ],
    material: "100% Heavy Cotton Canvas with Polyfill Quilt",
    price: 2490,
    oldPrice: 2990,
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Washed Black", "Olive Drab", "Desert Tan"],
    sizes: ["M", "L", "XL"],
    stock: 18,
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-09-24T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-008",
    name: "Essential Beanie",
    slug: "essential-beanie",
    description: "Double-cuffed fisherman beanie knitted in a dense circular rib. Snug fit designed to adapt to your head shape without losing tension.",
    details: [
      "Full circular 1x1 rib knit",
      "Foldover cuff with minimal woven tag",
      "Breathable thermal yarns",
      "One size fits all"
    ],
    material: "100% Cashmere-Feel Acrylic",
    price: 690,
    oldPrice: 890,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Black", "Chalk White", "Olive", "Mustard"],
    sizes: ["One Size"],
    stock: 45,
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-09-25T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-009",
    name: "Premium Winter Scarf",
    slug: "premium-winter-scarf",
    description: "Extra long, oversized fringed muffler scarf made from an ultra-soft brushed wool blend. Sized generously for dramatic styling and extreme warmth on cold evenings.",
    details: [
      "220cm x 45cm oversized proportion",
      "10cm hand-twisted raw fringe edges",
      "Brushed tactile cloud-soft finish",
      "Deep color fastness"
    ],
    material: "80% Brushed Acrylic Wool, 20% Alpaca Blend",
    price: 990,
    oldPrice: 1290,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Heather Charcoal", "Dark Cocoa", "Ivory"],
    sizes: ["One Size"],
    stock: 30,
    featured: false,
    newArrival: false,
    createdAt: new Date("2026-09-12T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-010",
    name: "Oversized Streetwear Hoodie",
    slug: "oversized-streetwear-hoodie",
    description: "Our boldest silhouette with exaggerated drape, extended drop sleeves, and raw clean hems. Screenprinted with tonal technical typography on the back collar.",
    details: [
      "500 GSM Ultra-heavy cotton fleece",
      "Curved kangaroo pocket with reinforced openings",
      "Acid-washed treatment for vintage hand",
      "Custom branded matte eyelets"
    ],
    material: "100% Heavy Combed Cotton",
    price: 1690,
    oldPrice: 2190,
    category: "Hoodies",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Vintage Acid Black", "Mocha", "Bone"],
    sizes: ["M", "L", "XL"],
    stock: 24,
    featured: true,
    newArrival: true,
    createdAt: new Date("2026-09-28T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-011",
    name: "Everyday Cargo Pants",
    slug: "everyday-cargo-pants",
    description: "Wide-leg streetwear cargo pants constructed from durable heavyweight ripstop cotton. Features 6 deep functional pockets, knee articulation darts, and toggle cuffs.",
    details: [
      "Heavyweight 320 GSM cotton ripstop",
      "Articulated pleats at knees for mobility",
      "Deep accordion cargo pockets with hidden snaps",
      "Adjustable bungee cinch cords at hem"
    ],
    material: "100% High-Density Cotton Ripstop",
    price: 1890,
    oldPrice: 2390,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Onyx Black", "Olive Drab", "Slate Grey"],
    sizes: ["S (30)", "M (32)", "L (34)", "XL (36)"],
    stock: 20,
    featured: true,
    newArrival: false,
    createdAt: new Date("2026-09-14T10:00:00Z").toISOString(),
  },
  {
    _id: "prod-012",
    name: "Classic Winter Shirt",
    slug: "classic-winter-shirt",
    description: "Heavy brushed flannel overshirt tailored to be worn open as an outer layer or buttoned up under an overcoat. Reinforced collar and double flap chest pockets.",
    details: [
      "300 GSM Brushed twill flannel",
      "Custom matte resin buttons",
      "Twin flap utility chest pockets",
      "Curved hemline with side seam gusset"
    ],
    material: "100% Brushed Cotton Twill",
    price: 1490,
    oldPrice: 1790,
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: ["Shadow Plaid Black", "Monochrome Grey", "Earth Plaid"],
    sizes: ["M", "L", "XL"],
    stock: 26,
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-09-29T10:00:00Z").toISOString(),
  }
];
