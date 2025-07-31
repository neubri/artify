"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords for demo users
    const hashedPassword = bcrypt.hashSync("password123", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          username: "collector_john",
          email: "john@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: "vintage_sarah",
          email: "sarah@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          username: "antique_mike",
          email: "mike@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          username: "art_lover",
          email: "artlover@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          username: "treasure_hunter",
          email: "treasure@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Reset sequence for PostgreSQL
    await queryInterface.sequelize.query(
      "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
