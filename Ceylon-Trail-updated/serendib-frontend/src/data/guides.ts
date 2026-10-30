export type Guide = {
  id: number;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  content: string[];
};

export const guides: Guide[] = [
  {
    id: 1,
    title: "How to take the train through tea country",
    slug: "train-through-tea-country",
    category: "Field notes",
    readTime: "8 min read",
    excerpt:
      "Everything you need to know for one of the world's most beautiful railway journeys.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
    content: [
      "Sri Lanka's hill-country train journey is one of the best ways to experience the island slowly.",
      "The route winds through tea plantations, misty valleys and small mountain stations.",
      "Choose a window seat, keep your camera ready and leave room for an unexpected conversation.",
    ],
  },
  {
    id: 2,
    title: "A slower weekend in Galle",
    slug: "slower-weekend-in-galle",
    category: "Coast",
    readTime: "6 min read",
    excerpt:
      "Walk the old walls, find a quiet courtyard and let the southern coast set the pace.",
    image:
      "https://images.unsplash.com/photo-1586613835647-31d8a5e2c33e?auto=format&fit=crop&w=1200&q=85",
    content: [
      "Galle is best explored on foot, especially in the softer light of morning and late afternoon.",
      "Start inside the historic fort, then follow the walls toward the sea.",
      "Leave time for small galleries, local cafés and long conversations under the palms.",
    ],
  },
  {
    id: 3,
    title: "What to pack for Sri Lanka",
    slug: "what-to-pack-for-sri-lanka",
    category: "Practical",
    readTime: "5 min read",
    excerpt:
      "A simple packing list for beaches, temples, trains and misty mountain mornings.",
    image:
      "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1200&q=85",
    content: [
      "Pack light and choose clothing that works across warm coastal days and cooler evenings in the hills.",
      "A lightweight scarf is useful for visiting temples and for protection from the sun.",
      "Comfortable walking shoes, insect repellent and a reusable water bottle are all worth bringing.",
    ],
  },
];
