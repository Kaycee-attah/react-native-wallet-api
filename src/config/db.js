import {neon} from '@neondatabase/serverless';
import "dotenv/config";

// Creates a Neon SQL connection using the DATABASE_URL from environment variables
export const sql = neon(process.env.DATABASE_URL);

async function connectToDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        // DECIMAL(10, 2) allows for amounts up to 99999999.99
        // meaning 10 digits in total, with 2 digits after the decimal point.
        // The table will be created if it does not already exist.
        // so: the maximum amount that can be stored is 99999999.99

        console.log("Database connected successfully!");
        
    } catch (error) {
        console.log("Error connecting to the database:", error);
        process.exit(1) // Status code 1 indicates an error, 0 indicates success    
        
    }
}
 export { connectToDatabase };