function handler() {
  return {
    tastingNotes: {
      cabernet: {
        aroma: ["Black cherry", "Cassis", "Cedar", "Tobacco"],
        palate: ["Full-bodied", "Firm tannins", "Dark fruit", "Oak"],
        finish: "Long and structured",
      },
      chardonnay: {
        aroma: ["Apple", "Pear", "Vanilla", "Butter"],
        palate: ["Medium to full-bodied", "Creamy", "Stone fruit", "Oak"],
        finish: "Rich and lingering",
      },
      pinotNoir: {
        aroma: ["Red cherry", "Raspberry", "Earth", "Spice"],
        palate: [
          "Light to medium-bodied",
          "Silky tannins",
          "Red fruit",
          "Herbs",
        ],
        finish: "Elegant and smooth",
      },
    },
    foodPairings: {
      redWine: {
        cabernet: ["Ribeye steak", "Lamb chops", "Hard aged cheeses"],
        pinotNoir: ["Grilled salmon", "Mushroom risotto", "Roasted chicken"],
      },
      whiteWine: {
        chardonnay: ["Lobster", "Creamy pasta", "Roasted poultry"],
        sauvignonBlanc: ["Goat cheese", "Asparagus", "Light seafood"],
      },
      sparklingWine: ["Oysters", "Caviar", "Light appetizers", "Brunch dishes"],
    },
    storageRecommendations: {
      temperature: "45-65°F (7-18°C)",
      humidity: "70-80%",
      position: "Store bottles horizontally",
      light: "Avoid direct sunlight",
      vibration: "Minimize movement and vibration",
      tips: [
        "Keep temperature consistent",
        "Store away from strong odors",
        "Avoid temperature fluctuations",
        "Use wine racks or wine refrigerators",
      ],
    },
    servingTemperatures: {
      sparklingWine: "38-45°F (3-7°C)",
      lightWhiteWine: "44-50°F (7-10°C)",
      fullBodiedWhite: "50-55°F (10-13°C)",
      lightRedWine: "55-60°F (13-16°C)",
      fullBodiedRed: "60-65°F (16-18°C)",
      dessertWine: "43-47°F (6-8°C)",
    },
    wineGlossary: {
      acidity:
        "The tart or sharp taste in wine that gives it a crisp, fresh character",
      body: "The weight and fullness of wine in your mouth",
      bouquet: "The complex aromas in aged wines",
      finish: "The taste and sensations that linger after swallowing",
      legs: "The streams of wine that flow down the glass after swirling",
      nose: "The aroma or smell of a wine",
      tannins: "Natural compounds that create a dry, puckering sensation",
      terroir: "The environmental factors affecting a wine's character",
      vintage: "The year the grapes were harvested",
      varietal: "A wine made primarily from a single grape variety",
    },
  };
}