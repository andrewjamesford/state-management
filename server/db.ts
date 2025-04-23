import pg from "pg";
import pgCamelCase from "pg-camelcase";

// Initialize pg-camelcase - this will automatically transform snake_case to camelCase
// Set false to disable auto-transformation (preserves original snake_case from database)
pgCamelCase.inject(pg, { preserveCase: true });

const { Pool } = pg;

// Database connection pool
export const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	port: process.env.PGPORT ? Number.parseInt(process.env.PGPORT) : 5432,
});

// Parse numeric types correctly
pg.types.setTypeParser(20, (val) =>
	val === null ? null : Number.parseInt(val, 10),
); // int8
pg.types.setTypeParser(1700, (val) =>
	val === null ? null : Number.parseFloat(val),
); // numeric
