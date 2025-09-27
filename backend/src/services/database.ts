import sqlite3 from 'sqlite3';
import path from 'path';

export interface FluencyTableRecord {
  id?: number;
  roleTitle: string;
  industry: string;
  context?: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}

// Note: ResourceRecommendationRecord and LearningPathRecord removed - not used

export class DatabaseService {
  private static instance: DatabaseService;
  private db: sqlite3.Database;
  private dbPath: string;

  private constructor() {
    this.dbPath = path.join(__dirname, '../../data/ai_fluency.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create fluency_tables table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS fluency_tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          roleTitle TEXT NOT NULL,
          industry TEXT NOT NULL,
          context TEXT,
          response TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(roleTitle, industry, context)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating fluency_tables:', err);
          reject(err);
          return;
        }

        // Add migration to add context column if it doesn't exist
        this.db.run(`
          ALTER TABLE fluency_tables ADD COLUMN context TEXT
        `, (migrationErr) => {
          // Ignore error if column already exists
          if (migrationErr && !migrationErr.message.includes('duplicate column name')) {
            console.warn('Migration warning:', migrationErr.message);
          }
          
          // Update unique constraint to include context
          this.db.run(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_fluency_unique 
            ON fluency_tables(roleTitle, industry, context)
          `, (indexErr) => {
            if (indexErr) {
              console.warn('Index creation warning:', indexErr.message);
            }
            
            console.log('✅ Database initialized successfully');
            resolve();
          });
        });
      });
    });
  }

  // Fluency Table Methods
  async getFluencyTable(roleTitle: string, industry: string, context?: string): Promise<FluencyTableRecord | null> {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT * FROM fluency_tables WHERE roleTitle = ? AND industry = ? AND (context = ? OR (context IS NULL AND ? IS NULL))',
        [roleTitle, industry, context || null, context || null],
        (err, row) => {
          if (err) {
            console.error('Error getting fluency table:', err);
            resolve(null);
          } else {
            resolve(row as FluencyTableRecord | null);
          }
        }
      );
    });
  }

  async saveFluencyTable(roleTitle: string, industry: string, response: string, context?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO fluency_tables (roleTitle, industry, context, response, updatedAt) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [roleTitle, industry, context || null, response],
        (err) => {
          if (err) {
            console.error('Error saving fluency table:', err);
            reject(err);
          } else {
            const contextInfo = context ? ` with context "${context.substring(0, 50)}..."` : '';
            console.log(`✅ Saved fluency table for ${roleTitle} in ${industry}${contextInfo}`);
            resolve();
          }
        }
      );
    });
  }

  // Note: Resource recommendations, learning paths, and database management methods removed - not used

  // Close database connection
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
        } else {
          console.log('✅ Database connection closed');
          resolve();
        }
      });
    });
  }
}