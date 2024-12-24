import { Pool } from "pg";
import { config } from "dotenv";

// Database connection pool
export const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	port: process.env.PGPORT ? Number.parseInt(process.env.PGPORT) : 5432,
});

// export const pool = new Pool({
// 	user: "postgres",
// 	host: "localhost",
// 	password: "password",
// 	database: "postgres",
// 	port: 5432,
// });
