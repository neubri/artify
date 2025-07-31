"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create some sample bids to make the auction more realistic
    const now = new Date();

    await queryInterface.bulkInsert(
      "bids",
      [
        // Bids for Leica Camera (Item 1)
        {
          id: 1,
          amount: 5200000.0,
          userId: 1, // collector_john
          itemId: 1,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          id: 2,
          amount: 5500000.0,
          userId: 2, // vintage_sarah
          itemId: 1,
          createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
          updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        },
        {
          id: 3,
          amount: 5750000.0,
          userId: 3, // antique_mike
          itemId: 1,
          createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
        },

        // Bids for Gibson Les Paul (Item 2)
        {
          id: 4,
          amount: 8800000.0,
          userId: 4, // art_lover
          itemId: 2,
          createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        },
        {
          id: 5,
          amount: 9200000.0,
          userId: 5, // treasure_hunter
          itemId: 2,
          createdAt: new Date(now.getTime() - 90 * 60 * 1000), // 1.5 hours ago
          updatedAt: new Date(now.getTime() - 90 * 60 * 1000),
        },

        // Bids for Star Wars Figures (Item 3)
        {
          id: 6,
          amount: 3350000.0,
          userId: 1, // collector_john
          itemId: 3,
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        },
        {
          id: 7,
          amount: 3600000.0,
          userId: 3, // antique_mike
          itemId: 3,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },

        // Bids for Rolex Submariner (Item 4)
        {
          id: 8,
          amount: 12500000.0,
          userId: 2, // vintage_sarah
          itemId: 4,
          createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
          updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        },
        {
          id: 9,
          amount: 13000000.0,
          userId: 4, // art_lover
          itemId: 4,
          createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        },
        {
          id: 10,
          amount: 13800000.0,
          userId: 5, // treasure_hunter
          itemId: 4,
          createdAt: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
          updatedAt: new Date(now.getTime() - 45 * 60 * 1000),
        },

        // Bids for Pokemon Cards (Item 5)
        {
          id: 11,
          amount: 2950000.0,
          userId: 3, // antique_mike
          itemId: 5,
          createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        },
        {
          id: 12,
          amount: 3100000.0,
          userId: 1, // collector_john
          itemId: 5,
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        },

        // Bids for Apple-1 Computer (Item 8)
        {
          id: 13,
          amount: 26000000.0,
          userId: 2, // vintage_sarah
          itemId: 8,
          createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
          updatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        },
        {
          id: 14,
          amount: 28500000.0,
          userId: 4, // art_lover
          itemId: 8,
          createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        },
        {
          id: 15,
          amount: 30000000.0,
          userId: 5, // treasure_hunter
          itemId: 8,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
      ],
      {}
    );

    // Reset sequence for PostgreSQL
    await queryInterface.sequelize.query(
      "SELECT setval('bids_id_seq', (SELECT MAX(id) FROM bids));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bids", null, {});
  },
};
