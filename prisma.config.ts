/**
 * Prisma configuration file for migrate and CLI.
 *
 * This file provides connection URLs for datasource(s) (Prisma 7+ style).
 * Ensure `DATABASE_URL` is set in your environment when running migrations or the CLI.
 * See: https://pris.ly/d/config-datasource
 */
import dotenv from "dotenv";
dotenv.config();

const config = {
  migrate: {
    datasources: {
      db: {
        url: process.env.DATABASE_URL ?? "",
      },
    },
  },
};

export default config;
