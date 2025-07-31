"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Calculate end times (24 hours from now for active auctions)
    const now = new Date();
    const endTime24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endTime48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const endTime72h = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    await queryInterface.bulkInsert(
      "items",
      [
        {
          id: 1,
          name: "George Condo - Lost in Time (2024)",
          description:
            "A hallmark of Condo's distinctive interpretation of Cubism and figurative art, Prismatic Head Composition creates a striking contrast between beauty and the grotesque. The figure, clearly unsettled, wrestles with a blend of both familiar and strange emotions simultaneously. With eyes misaligned on a distorted face and several rows of teeth, the piece prompts one to ponder how many personalities exist within a single individual.",
          startingPrice: 500000000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/6492e057f8e00b2c5cb1f27fbe084a46p/guyhepner-george-condo-lost-in-time-2024.png",
          isSold: false,
          endTime: endTime24h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Banksy - Girl with Balloon (2004)",
          description:
            "Girl with Balloon is a screen print released by Pictures on Walls as a signed edition of 150, an unsigned edition of 600 and 88 APs in Blue, Gold, Pink and Purple. Girl with Balloon is Banksy’s most popular motif and is recognized the world over for its charm and simple beauty. In a poll conducted in the UK in 2017, that artwork was voted Britain’s favourite artwork highlighting its broad and timeless appeal. The work, like many Banksy motifs, has multiple interpretations The work, which originally appeared across London as a series of murals, was accompanied by the text There is always hope.",
          startingPrice: 18500000000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/5dbea3ca24718aa425f5baf2f7df057bp/guyhepner-banksy-girl-with-balloon-signed-2004.png",
          isSold: false,
          endTime: endTime48h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Yayoi Kusama - Flowers (2005)",
          description:
            "While Yayoi Kusama is widely recognized for her immersive installations and polka-dotted environments, her nature-oriented prints, particularly those featuring fruits and flowers, offer a distinct facet of her artistic repertoire. Kusama's prints often exude a whimsical and fantastical quality, where vibrant colors and intricate patterns intertwine to create a sense of surreal beauty. These nature-themed works showcase her meticulous attention to detail and a harmonious blend of organic forms with her signature repetitive patterns. Kusama's exploration of nature in her prints is a manifestation of her unique perspective, inviting viewers into a world where the boundaries between the natural and the fantastical blur, and where the essence of life is expressed through kaleidoscopic visions of flora and fauna.",
          startingPrice: 300200000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/bb99a1f564e6cd7c3ad011afa2c4d01fp/guyhepner-yayoi-kusama-flowers-c-2005.png",
          isSold: false,
          endTime: endTime72h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Grayson Perry - Vote for Me (2023)",
          description:
            "A thought-provoking woodcut print by contemporary artist Grayson Perry. This piece features Perry's signature style, blending intricate patterns with social commentary. The print is part of a limited edition series and is signed by the artist.",
          startingPrice: 12000000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/188e647985d2732ff7e60153ac648471j/guyhepner-grayson-perry-vote-for-me-woodcut-2023.jpg",
          isSold: false,
          endTime: endTime24h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Keith Haring - Lucky Strike (1987)",
          description:
            "A vibrant and iconic screen print by Keith Haring, known for his bold lines and energetic figures. This piece captures Haring's signature style, blending social activism with playful imagery. The print is part of a limited edition series and is signed by the artist.",
          startingPrice: 100500000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/ba95b6a321c894b46b628316760bcda3p/guyhepner-keith-haring-lucky-strike-3-littmann-pp.-78-1987.png",
          isSold: false,
          endTime: endTime48h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Yoshitomo Nara - Balance Girl (2014)",
          description:
            "A captivating and whimsical painting by contemporary artist Yoshitomo Nara. This piece features Nara's signature style, blending innocence with a hint of rebellion. The artwork is part of a limited edition series and is signed by the artist.",
          startingPrice: 2000500000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/740a1bad52c9493b8e903baba78a1ae9p/guyhepner-yoshitomo-nara-balance-girl-2014.png",
          isSold: false,
          endTime: endTime72h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Yoshitomo Nara - After the Acid Rain (2010)",
          description:
            "A thought-provoking painting by contemporary artist Yoshitomo Nara. This piece features Nara's signature style, blending innocence with a hint of rebellion. The artwork is part of a limited edition series and is signed by the artist.",
          startingPrice: 150000000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/83b54fe9a1331c6f356530b799099fdfp/guyhepner-yoshitomo-nara-after-the-acid-rain-night-2010.png",
          isSold: false,
          endTime: endTime24h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "Yoshitomo Nara - What's Going On (1999)",
          description:
            "A captivating and thought-provoking painting by contemporary artist Yoshitomo Nara. This piece features Nara's signature style, blending innocence with a hint of rebellion. The artwork is part of a limited edition series and is signed by the artist.",
          startingPrice: 2005000000.0,
          imageUrl:
            "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/ddc0a19f41c56c3bd303cdda72281290p/guyhepner-yoshitomo-nara-what-s-going-on-1999.png",
          isSold: false,
          endTime: endTime48h,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Reset sequence for PostgreSQL
    await queryInterface.sequelize.query(
      "SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
