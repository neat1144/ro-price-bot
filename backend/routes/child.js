import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'customers' table
db.run(`CREATE TABLE IF NOT EXISTS customers
      (id        INTEGER PRIMARY KEY AUTOINCREMENT, 
       include   TEXT, 
       exclude   TEXT, 
       set_price REAL, 
       new_price REAL,
       nofi_time TEXT)`);
