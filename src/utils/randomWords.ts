// Curated list of interesting, high-value words for random exploration
// Categories: Technology, Science, Art, Philosophy, Business, Nature, Psychology, etc.

const RANDOM_WORDS = [
  // Technology & Innovation
  "algorithm",
  "quantum",
  "blockchain",
  "artificial",
  "neural",
  "digital",
  "virtual",
  "innovation",
  "automation",
  "cybersecurity",
  "biotechnology",
  "nanotechnology",
  "robotics",
  "machine",

  // Science & Discovery
  "evolution",
  "gravity",
  "consciousness",
  "molecule",
  "ecosystem",
  "genetics",
  "astronomy",
  "physics",
  "chemistry",
  "biology",
  "research",
  "discovery",
  "experiment",
  "hypothesis",

  // Art & Creativity
  "imagination",
  "inspiration",
  "creativity",
  "expression",
  "aesthetic",
  "design",
  "beauty",
  "music",
  "painting",
  "sculpture",
  "poetry",
  "literature",
  "performance",
  "storytelling",

  // Philosophy & Ideas
  "wisdom",
  "knowledge",
  "truth",
  "justice",
  "freedom",
  "ethics",
  "morality",
  "existence",
  "reality",
  "perception",
  "consciousness",
  "meaning",
  "purpose",
  "identity",
  "philosophy",

  // Business & Economics
  "entrepreneur",
  "innovation",
  "strategy",
  "leadership",
  "collaboration",
  "investment",
  "market",
  "economy",
  "profit",
  "value",
  "brand",
  "customer",
  "service",
  "quality",

  // Nature & Environment
  "ocean",
  "forest",
  "mountain",
  "river",
  "wildlife",
  "climate",
  "environment",
  "sustainability",
  "biodiversity",
  "conservation",
  "renewable",
  "organic",
  "natural",
  "earth",
  "planet",

  // Psychology & Human Behavior
  "emotion",
  "motivation",
  "personality",
  "behavior",
  "cognition",
  "memory",
  "learning",
  "relationship",
  "communication",
  "empathy",
  "resilience",
  "growth",
  "mindfulness",
  "habit",

  // Society & Culture
  "community",
  "culture",
  "tradition",
  "diversity",
  "inclusion",
  "society",
  "civilization",
  "heritage",
  "language",
  "communication",
  "education",
  "democracy",
  "progress",
  "change",

  // Health & Wellness
  "health",
  "wellness",
  "nutrition",
  "exercise",
  "meditation",
  "balance",
  "energy",
  "healing",
  "therapy",
  "medicine",
  "fitness",
  "mental",
  "physical",
  "spiritual",

  // Abstract Concepts
  "pattern",
  "system",
  "structure",
  "process",
  "transformation",
  "connection",
  "relationship",
  "complexity",
  "simplicity",
  "harmony",
  "balance",
  "rhythm",
  "flow",
  "emergence",
];

/**
 * Get a random word from the curated list
 * Ensures no immediate repeats by avoiding the last selected word
 */
export function getRandomWord(excludeWord?: string): string {
  let availableWords = RANDOM_WORDS;

  // Filter out the excluded word if provided
  if (excludeWord) {
    availableWords = RANDOM_WORDS.filter(
      (word) => word.toLowerCase() !== excludeWord.toLowerCase()
    );
  }

  // Return a random word from the available list
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex];
}

/**
 * Get multiple random words for potential future features
 */
export function getRandomWords(
  count: number,
  excludeWords: string[] = []
): string[] {
  const excludeSet = new Set(excludeWords.map((word) => word.toLowerCase()));
  const availableWords = RANDOM_WORDS.filter(
    (word) => !excludeSet.has(word.toLowerCase())
  );

  const selectedWords: string[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < Math.min(count, availableWords.length); i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * availableWords.length);
    } while (usedIndices.has(randomIndex));

    usedIndices.add(randomIndex);
    selectedWords.push(availableWords[randomIndex]);
  }

  return selectedWords;
}
