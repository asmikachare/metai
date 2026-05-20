// Mock data for Met Gala AI Stylist - 2026 "Fashion as Art" theme

export const CURRENT_THEME = {
  year: 2026,
  title: "Fashion as Art",
  description: "The intersection of haute couture and artistic expression, where garments transcend utility to become wearable sculpture, performance, and conceptual statements.",
  dimensions: [
    {
      name: "Silhouette",
      description: "Sculptural, architectural forms that challenge traditional body-fabric relationships",
      keywords: ["structural", "avant-garde", "geometric", "fluid"]
    },
    {
      name: "Material",
      description: "Innovative use of unconventional materials—technology, found objects, experimental textiles",
      keywords: ["3D-printed", "reflective", "transparent", "metallic", "digital"]
    },
    {
      name: "Artistic Movement",
      description: "Clear references to art history—Surrealism, Cubism, Pop Art, Contemporary installation",
      keywords: ["Mondrian", "Warhol", "Kusama", "Banksy", "installation art"]
    },
    {
      name: "Conceptual Depth",
      description: "The look tells a story about art's role in culture, identity, or society",
      keywords: ["narrative", "commentary", "symbolism", "meta-reference"]
    }
  ]
};

export const CELEBRITY_LOOKS = [
  {
    id: 1,
    celebrity: "Lisa",
    group: "BLACKPINK",
    designer: "Experimental Collective",
    imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=900&fit=crop",
    score: 98,
    verdict: "Perfect",
    analysis: "Lisa's 3D-printed headgear and bodypiece with hands as structural elements embodies 'technology as art' and 'sculpture as fashion.' The piece doesn't just reference art—it IS wearable sculpture. The hands create both structure and symbolism, questioning the relationship between creator and creation.",
    dimensions: {
      silhouette: 10,
      material: 10,
      artisticMovement: 9,
      conceptualDepth: 10
    },
    tags: ["3D-printed", "sculptural", "conceptual", "wearable tech"]
  },
  {
    id: 2,
    celebrity: "Bi",
    designer: "Custom Mirror Atelier",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop",
    score: 95,
    verdict: "Exceptional",
    analysis: "The mirror dress with integrated film roll is brilliantly conceptual: cinema is art, the mirror material reflects fashion reflecting culture. The film roll element adds a meta-narrative about documentation and memory. Strong execution of theme across material and meaning.",
    dimensions: {
      silhouette: 8,
      material: 10,
      artisticMovement: 10,
      conceptualDepth: 9
    },
    tags: ["reflective", "cinema reference", "conceptual", "mirror"]
  },
  {
    id: 3,
    celebrity: "Kim Kardashian",
    designer: "Balenciaga",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=900&fit=crop",
    score: 78,
    verdict: "Solid",
    analysis: "Not the most innovative interpretation, but committed to the aesthetic. The silhouette is architectural, materials are refined. Lacks the conceptual punch of top-tier looks but demonstrates understanding of 'fashion as art' through form and presentation.",
    dimensions: {
      silhouette: 8,
      material: 7,
      artisticMovement: 7,
      conceptualDepth: 6
    },
    tags: ["architectural", "monochromatic", "minimalist"]
  },
  {
    id: 4,
    celebrity: "Jenny",
    designer: "Chanel",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop",
    score: 42,
    verdict: "Missed the Brief",
    analysis: "Generic campaign look. Beautiful, yes. On-theme, no. This could appear in any Chanel ad—it doesn't engage with 'Fashion as Art' beyond being expensive fashion. Chanel has shown art-forward archive pieces that would have nailed this brief.",
    dimensions: {
      silhouette: 5,
      material: 4,
      artisticMovement: 3,
      conceptualDepth: 2
    },
    tags: ["classic", "commercial", "safe"]
  },
  {
    id: 5,
    celebrity: "Kendall Jenner",
    designer: "Gap",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=600&h=900&fit=crop",
    score: 35,
    verdict: "Off-Theme",
    analysis: "Gap is not a Met Gala brand. The look reads as commercial, not artistic. While minimalism can be artistic, this lacks the conceptual rigor or material innovation to justify that interpretation. A fundamental misunderstanding of the assignment.",
    dimensions: {
      silhouette: 3,
      material: 3,
      artisticMovement: 2,
      conceptualDepth: 2
    },
    tags: ["commercial", "minimal", "off-brand"]
  },
  {
    id: 6,
    celebrity: "Rosé",
    designer: "Yves Saint Laurent",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=900&fit=crop",
    score: 48,
    verdict: "Missed Opportunity",
    analysis: "YSL has a legendary art history—the Mondrian dress, Warhol collaborations, Opium era avant-garde. None of that rich archive showed up here. This is a pretty dress, but it doesn't engage with YSL's artistic legacy or the Met Gala theme.",
    dimensions: {
      silhouette: 5,
      material: 5,
      artisticMovement: 4,
      conceptualDepth: 3
    },
    tags: ["elegant", "traditional", "missed potential"]
  }
];

export const DESIGNER_ALTERNATIVES = [
  {
    celebrity: "Jenny",
    currentDesigner: "Chanel",
    currentScore: 42,
    alternatives: [
      {
        designer: "Chanel",
        collection: "Fall 2023 Haute Couture",
        lookNumber: 47,
        imageUrl: "https://images.unsplash.com/photo-1558882224-dda166733046?w=600&h=900&fit=crop",
        projectedScore: 89,
        reasoning: "This archive piece features geometric cage structures and transparent materials—pure wearable architecture. It references constructivism and spatial art while maintaining Chanel's DNA.",
        year: 2023
      },
      {
        designer: "Chanel",
        collection: "Spring 2022 Haute Couture",
        lookNumber: 23,
        imageUrl: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=900&fit=crop",
        projectedScore: 85,
        reasoning: "Sculptural shoulders, origami-inspired pleating, and a monochromatic palette that reads as contemporary installation art. Fashion as form.",
        year: 2022
      }
    ]
  },
  {
    celebrity: "Rosé",
    currentDesigner: "Yves Saint Laurent",
    currentScore: 48,
    alternatives: [
      {
        designer: "Yves Saint Laurent",
        collection: "Archive - Mondrian Collection 1965",
        lookNumber: 12,
        imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=900&fit=crop",
        projectedScore: 96,
        reasoning: "The ICONIC Mondrian dress—literal art history on fabric. Direct homage to Piet Mondrian's De Stijl movement. This IS fashion as art.",
        year: 1965
      },
      {
        designer: "Yves Saint Laurent",
        collection: "Fall 2020 Haute Couture",
        lookNumber: 34,
        imageUrl: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=600&h=900&fit=crop",
        projectedScore: 88,
        reasoning: "Deconstructed tailoring meets abstract expressionism. Bold color blocking, architectural shapes, and a nod to contemporary art movements.",
        year: 2020
      }
    ]
  },
  {
    celebrity: "Kendall Jenner",
    currentDesigner: "Gap",
    currentScore: 35,
    alternatives: [
      {
        designer: "Iris van Herpen",
        collection: "Spring 2024 Couture - Earthrise",
        lookNumber: 8,
        imageUrl: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=900&fit=crop",
        projectedScore: 97,
        reasoning: "3D-printed bio-resin structures that blur the line between fashion and sculpture. Iris van Herpen is THE designer for 'fashion as art'—her work lives in museums.",
        year: 2024
      },
      {
        designer: "Schiaparelli",
        collection: "Spring 2023 Haute Couture",
        lookNumber: 15,
        imageUrl: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&h=900&fit=crop",
        projectedScore: 93,
        reasoning: "Surrealist DNA runs through Schiaparelli. This piece features trompe l'oeil elements and sculptural gold leafing—direct art references executed with couture precision.",
        year: 2023
      }
    ]
  }
];

export const EMERGING_BRANDS = [
  {
    name: "Section8",
    origin: "London",
    aesthetic: "Digital Surrealism",
    tags: ["3D-printed", "tech-forward", "surrealism", "wearable sculpture"],
    description: "Merging digital fabrication with traditional couture techniques. Known for impossible geometries and material innovation.",
    standoutLooks: [
      {
        collection: "SS25 - Digital Dreams",
        imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=600&h=900&fit=crop",
        themeScore: 94
      }
    ]
  },
  {
    name: "Chromat",
    origin: "New York",
    aesthetic: "Architectural Feminism",
    tags: ["structural", "body-positive", "engineering", "performance"],
    description: "Fashion meets engineering. Creates structural garments that celebrate diverse bodies through mathematical precision and innovative materials.",
    standoutLooks: [
      {
        collection: "SS26 - Force Fields",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=900&fit=crop",
        themeScore: 91
      }
    ]
  },
  {
    name: "Palomo Spain",
    origin: "Seville",
    aesthetic: "Neo-Baroque Performance",
    tags: ["theatrical", "gender-fluid", "art history", "maximalist"],
    description: "Fashion as theater. References Velázquez, flamenco, and Spanish baroque while queering traditional couture.",
    standoutLooks: [
      {
        collection: "FW25 - Painting in Motion",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop",
        themeScore: 89
      }
    ]
  },
  {
    name: "Vaquera",
    origin: "New York",
    aesthetic: "Conceptual Deconstruction",
    tags: ["conceptual", "commentary", "deconstructed", "irreverent"],
    description: "Fashion as social commentary. Deconstructs luxury codes and fashion itself—meta, self-aware, and deeply conceptual.",
    standoutLooks: [
      {
        collection: "SS25 - The Emperor's New Clothes",
        imageUrl: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&h=900&fit=crop",
        themeScore: 87
      }
    ]
  }
];

export const HISTORICAL_THEMES = [
  {
    year: 2024,
    title: "The Garden of Time",
    interpretation: "Exploration of nature, decay, renewal, and temporality through organic forms and time-based narratives",
    topLooks: ["Zendaya in Maison Margiela archive", "Bad Bunny in floral Jacquemus"],
    bestBrands: ["Maison Margiela", "Iris van Herpen", "Harris Reed"]
  },
  {
    year: 2023,
    title: "Karl Lagerfeld: A Line of Beauty",
    interpretation: "Tribute to Lagerfeld's design legacy—precision tailoring, rock-and-roll edge, maximalist detail",
    topLooks: ["Doja Cat in Chanel towel dress", "Lil Nas X in pearled Versace"],
    bestBrands: ["Chanel", "Fendi", "Balmain"]
  },
  {
    year: 2022,
    title: "In America: An Anthology of Fashion",
    interpretation: "American fashion history through gilded glamour, old Hollywood, and forgotten narratives",
    topLooks: ["Blake Lively's transforming Versace", "Billie Eilish in upcycled Gucci"],
    bestBrands: ["Thom Browne", "Pyer Moss", "Ralph Lauren"]
  },
  {
    year: 2021,
    title: "In America: A Lexicon of Fashion",
    interpretation: "Defining American fashion vocabulary—sportswear, nostalgia, optimism, diversity",
    topLooks: ["Rihanna's Balenciaga volume", "Kim Petras in all-black Versace"],
    bestBrands: ["Balenciaga", "Coach", "Telfar"]
  },
  {
    year: 2019,
    title: "Camp: Notes on Fashion",
    interpretation: "Susan Sontag's definition of camp—irony, exaggeration, theatricality, artifice",
    topLooks: ["Lady Gaga's 4-look transformation", "Billy Porter as sun god"],
    bestBrands: ["Moschino", "Schiaparelli", "Jeremy Scott"]
  },
  {
    year: 2018,
    title: "Heavenly Bodies: Fashion and the Catholic Imagination",
    interpretation: "Religious iconography, devotional objects, and sacred vestments reimagined through couture",
    topLooks: ["Rihanna as pope", "Zendaya in Joan of Arc armor"],
    bestBrands: ["Versace", "Dolce & Gabbana", "Atelier Versace"]
  }
];
