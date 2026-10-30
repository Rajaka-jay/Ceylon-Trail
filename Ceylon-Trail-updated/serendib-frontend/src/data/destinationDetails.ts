export type DestinationSection = {
  heading: string;
  paragraphs: string[];
};

export type DestinationDetail = {
  destinationId: number;
  title: string;
  shortDescription: string;
  sections: DestinationSection[];
  seoDescription: string;
};

export const destinationDetails: DestinationDetail[] = [
  {
    destinationId: 1,
    title: "Sigiriya: The Lion Rock Fortress of Sri Lanka",

    shortDescription:
      "Rising nearly two hundred metres above the forests of central Sri Lanka, Sigiriya is an ancient rock fortress and royal garden city. Built in the fifth century by King Kashyapa, it blends engineering, art and landscape design on a remarkable scale.",

    sections: [
      {
        heading: "A Rock Above the Plains",
        paragraphs: [
          "In the early morning, the rock appears first as a dark shape above the trees. Then the light reaches it. The weathered stone turns from grey to amber, and the forest canopy below fills with the sound of birds.",

          "Sigiriya stands alone on the plains of central Sri Lanka, a vast column of rock rising roughly 200 metres above the surrounding land. At its base lie the remains of gardens, pools and walls that were once part of a royal city.",

          "This combination of natural monument and designed landscape is what makes Sigiriya so distinctive. It is one of the best-preserved examples of ancient urban planning in South Asia."
        ],
      },

      {
        heading: "The King and the Rock",
        paragraphs: [
          "The story of Sigiriya's royal period begins in the fifth century CE. According to the Culavamsa, King Kashyapa seized the throne and later moved his court to Sigiriya.",

          "The chronicles suggest that he feared the return of Moggallana, the rightful heir. Historians treat these accounts as valuable but not unquestioned sources.",

          "What archaeology confirms is that Sigiriya was developed on a grand scale during Kashyapa's reign. After his defeat, the royal capital moved back to Anuradhapura and Sigiriya was given over to Buddhist monks."
        ],
      },

      {
        heading: "Gardens, Water, and Stone",
        paragraphs: [
          "At the foot of the rock, the royal gardens follow a careful symmetrical design. Rectangular pools, islands and straight water channels stretch away from the rock in an ordered pattern.",

          "Beyond the symmetrical gardens, large boulders are scattered across the slopes. Ancient builders shaped pathways, terraces and shelters around them instead of clearing the natural stone.",

          "Higher up, the path reaches the Lion Platform. Today only the great lion's paws remain, carved from the rock on either side of the stairway."
        ],
      },

      {
        heading: "Paintings and Voices on the Wall",
        paragraphs: [
          "Along the western face of the rock are the famous Sigiriya frescoes. They show graceful female figures painted in warm tones on the plastered stone.",

          "Nearby runs the Mirror Wall, once polished so smoothly that it may have reflected passing visitors. Its surface contains hundreds of verses written by visitors over many centuries.",

          "These inscriptions offer a rare record of how ordinary visitors responded to the site long after the royal court had gone."
        ],
      },

      {
        heading: "A Landscape That Holds the Story",
        paragraphs: [
          "Sigiriya cannot be separated from its setting. The rock rises from a dry-zone plain surrounded by woodland that softens the edges of the ruins.",

          "The relationship between stone, water and forest remains central to the atmosphere of the place. The landscape was part of the design, not merely a background to it."
        ],
      },

      {
        heading: "Legend, Memory, and Meaning",
        paragraphs: [
          "Many stories have gathered around Sigiriya. Some describe Kashyapa as a king haunted by guilt, while others describe a palace in the sky built to rival the homes of the gods.",

          "These stories are not all supported by historical evidence, but they are part of the site's long cultural life.",

          "Before Kashyapa's time, caves around the rock were used by Buddhist monks. After his death, the rock returned to monastic use."
        ],
      },

      {
        heading: "Sigiriya Today",
        paragraphs: [
          "Today, Sigiriya is part of a living region. Villages and farmland surround the rock, and nearby communities regard it as both a local landmark and a source of national pride.",

          "For Sri Lankans and international visitors alike, Sigiriya is a meeting point of archaeology, landscape and living culture."
        ],
      },

      {
        heading: "An Enduring Presence",
        paragraphs: [
          "Kings, monks, poets and travellers have all left something of themselves at Sigiriya, yet the rock has outlasted every one of them.",

          "Sigiriya is not only a monument to one king's ambition. It is a place where the work of many generations still rests beneath the same wide sky."
        ],
      },
    ],

    seoDescription:
      "Explore Sigiriya, Sri Lanka's ancient Lion Rock fortress. Discover its royal history, water gardens, frescoes, Mirror Wall and enduring cultural legacy.",
  },
];
