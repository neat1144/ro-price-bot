import sqlite3 from "sqlite3";

const sqlite3Verbose = sqlite3.verbose();

// Open a database handle to an in-memory database
const db = new sqlite3Verbose.Database("mydatabase.db");

export default db;