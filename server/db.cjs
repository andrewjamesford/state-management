const { Pool } = require("pg");
const types = require("pg").types;

// Database connection pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.DATABASE_URL
		? {
				rejectUnauthorized: false,
			}
		: false,
});

function query(text, params, callback) {
	return pool.query(text, params, callback);
}

function end() {
	return pool.end();
}

module.exports = {
	query,
	end,
};
