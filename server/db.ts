import { Pool, QueryResult, QueryResultRow } from 'pg';
import { types } from 'pg';

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? {
              rejectUnauthorized: false,
          }
        : false,
});

function query<T extends QueryResultRow>(
    text: string,
    params: any[] = []
): Promise<QueryResult<T>> {
    return pool.query(text, params);
}

function end(): Promise<void> {
    return pool.end();
}

export {
    query,
    end
};
