const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "roomify";

async function initializeDatabase() {
  let connection;
  try {
    console.log("🔗 Connecting to MySQL server...");
    
    // First, connect without specifying database to create it
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log("✅ Connected to MySQL server");

    // Create database if it doesn't exist
    console.log(`📦 Creating database '${DB_NAME}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`✅ Database '${DB_NAME}' is ready`);

    // Close and reconnect to the new database
    await connection.end();

    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📊 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        // Ignore errors for IF NOT EXISTS statements
        if (!err.message.includes("already exists")) {
          console.warn("⚠️  SQL Error (may be harmless):", err.message);
        }
      }
    }

    console.log("✅ Database schema initialized successfully");

    // Verify tables exist
    const [tables] = await connection.query(`SHOW TABLES`);
    console.log(`\n📋 Tables in database: ${tables.length}`);
    tables.forEach((table, index) => {
      const tableName = table[`Tables_in_${DB_NAME}`];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log("\n✨ Database initialization complete!");

  } catch (error) {
    console.error("❌ Database initialization failed:");
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initializeDatabase();
