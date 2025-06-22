import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params;
        
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `

        res.status(200).json({
            message: "Transactions fetched successfully",
            transactions: transactions // Return the fetched transactions
        });
        
    } catch (error) {
        console.log("Error getting the transactions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createTransaction (req, res) {
    // title, amount, category, user_id
    try {
        const {  title, amount, category, user_id } = req.body;

        if(  !title || amount === undefined || !category || !user_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert the transaction into the database
        const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *
        `;

        console.log(transaction);
        

        res.status(201).json({
            message: "Transaction created successfully",
            transaction: transaction[0] // Return the created transaction
        });

    } catch (error) {
        console.log("Error creating the transaction:", error);
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export async function deleteTransaction (req, res) {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
        
        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            transaction: result[0] // Return the deleted transaction
        });
    } catch (error) {
        console.log("Error deleting the transaction:", error);
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export async function getTransactionSummaryByUserId (req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            message: "Transaction summary fetched successfully",
            summary: {
                balance: parseFloat(balanceResult[0].balance),
                income: parseFloat(incomeResult[0].income),
                expenses: parseFloat(expensesResult[0].expenses)
            }
        });
    } catch (error) {
        console.log("Error getting the transaction summary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}