"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const db = (0, node_postgres_1.drizzle)("postgres://postgres:password@localhost:5432/postgres");
exports.db = db;
