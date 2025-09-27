import sqlite3 from 'sqlite3';
import path from 'path';

export interface FluencyTableRecord {
  id?: number;
  roleTitle: string;
  industry: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceRecommendationRecord {
  id?: number;
  roleTitle: string;
  industry: string;
  currentLevel: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPathRecord {
  id?: number;
  roleTitle: string;
  industry: string;
  currentLevel: string;
  targetLevel: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}

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
      const createTables = () => {
        // Create fluency_tables table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS fluency_tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roleTitle TEXT NOT NULL,
            industry TEXT NOT NULL,
            response TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(roleTitle, industry)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating fluency_tables:', err);
            reject(err);
            return;
          }

          // Create resource_recommendations table
          this.db.run(`
            CREATE TABLE IF NOT EXISTS resource_recommendations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              roleTitle TEXT NOT NULL,
              industry TEXT NOT NULL,
              currentLevel TEXT NOT NULL,
              response TEXT NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(roleTitle, industry, currentLevel)
            )
          `, (err) => {
            if (err) {
              console.error('Error creating resource_recommendations:', err);
              reject(err);
              return;
            }

            // Create learning_paths table
            this.db.run(`
              CREATE TABLE IF NOT EXISTS learning_paths (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roleTitle TEXT NOT NULL,
                industry TEXT NOT NULL,
                currentLevel TEXT NOT NULL,
                targetLevel TEXT NOT NULL,
                response TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(roleTitle, industry, currentLevel, targetLevel)
              )
            `, (err) => {
              if (err) {
                console.error('Error creating learning_paths:', err);
                reject(err);
              } else {
                console.log('✅ Database initialized successfully');
                resolve();
              }
            });
          });
        });
      };

      createTables();
    });
  }

  // Fluency Table Methods
  async getFluencyTable(roleTitle: string, industry: string): Promise<FluencyTableRecord | null> {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT * FROM fluency_tables WHERE roleTitle = ? AND industry = ?',
        [roleTitle, industry],
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

  async saveFluencyTable(roleTitle: string, industry: string, response: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO fluency_tables (roleTitle, industry, response, updatedAt) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [roleTitle, industry, response],
        (err) => {
          if (err) {
            console.error('Error saving fluency table:', err);
            reject(err);
          } else {
            console.log(`✅ Saved fluency table for ${roleTitle} in ${industry}`);
            resolve();
          }
        }
      );
    });
  }

  // Resource Recommendations Methods
  async getResourceRecommendations(
    roleTitle: string, 
    industry: string, 
    currentLevel: string
  ): Promise<ResourceRecommendationRecord | null> {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT * FROM resource_recommendations WHERE roleTitle = ? AND industry = ? AND currentLevel = ?',
        [roleTitle, industry, currentLevel],
        (err, row) => {
          if (err) {
            console.error('Error getting resource recommendations:', err);
            resolve(null);
          } else {
            resolve(row as ResourceRecommendationRecord | null);
          }
        }
      );
    });
  }

  async saveResourceRecommendations(
    roleTitle: string, 
    industry: string, 
    currentLevel: string, 
    response: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO resource_recommendations (roleTitle, industry, currentLevel, response, updatedAt) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [roleTitle, industry, currentLevel, response],
        (err) => {
          if (err) {
            console.error('Error saving resource recommendations:', err);
            reject(err);
          } else {
            console.log(`✅ Saved resource recommendations for ${roleTitle} in ${industry} at ${currentLevel}`);
            resolve();
          }
        }
      );
    });
  }

  // Learning Path Methods
  async getLearningPath(
    roleTitle: string, 
    industry: string, 
    currentLevel: string, 
    targetLevel: string
  ): Promise<LearningPathRecord | null> {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT * FROM learning_paths WHERE roleTitle = ? AND industry = ? AND currentLevel = ? AND targetLevel = ?',
        [roleTitle, industry, currentLevel, targetLevel],
        (err, row) => {
          if (err) {
            console.error('Error getting learning path:', err);
            resolve(null);
          } else {
            resolve(row as LearningPathRecord | null);
          }
        }
      );
    });
  }

  async saveLearningPath(
    roleTitle: string, 
    industry: string, 
    currentLevel: string, 
    targetLevel: string, 
    response: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO learning_paths (roleTitle, industry, currentLevel, targetLevel, response, updatedAt) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [roleTitle, industry, currentLevel, targetLevel, response],
        (err) => {
          if (err) {
            console.error('Error saving learning path:', err);
            reject(err);
          } else {
            console.log(`✅ Saved learning path for ${roleTitle} in ${industry} from ${currentLevel} to ${targetLevel}`);
            resolve();
          }
        }
      );
    });
  }

  // Database Statistics
  async getDatabaseStats(): Promise<{
    fluencyTables: number;
    resourceRecommendations: number;
    learningPaths: number;
    totalRecords: number;
  }> {
    return new Promise((resolve) => {
      let fluencyCount = 0;
      let resourceCount = 0;
      let learningCount = 0;
      let completed = 0;

      const checkComplete = () => {
        completed++;
        if (completed === 3) {
          resolve({
            fluencyTables: fluencyCount,
            resourceRecommendations: resourceCount,
            learningPaths: learningCount,
            totalRecords: fluencyCount + resourceCount + learningCount
          });
        }
      };

      this.db.get('SELECT COUNT(*) as count FROM fluency_tables', (err, row: any) => {
        if (!err && row) {
          fluencyCount = row.count;
        }
        checkComplete();
      });

      this.db.get('SELECT COUNT(*) as count FROM resource_recommendations', (err, row: any) => {
        if (!err && row) {
          resourceCount = row.count;
        }
        checkComplete();
      });

      this.db.get('SELECT COUNT(*) as count FROM learning_paths', (err, row: any) => {
        if (!err && row) {
          learningCount = row.count;
        }
        checkComplete();
      });
    });
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      let completed = 0;
      const total = 3;

      const checkComplete = (err?: Error) => {
        if (err) {
          reject(err);
          return;
        }
        completed++;
        if (completed === total) {
          console.log('✅ Cleared all database data');
          resolve();
        }
      };

      this.db.run('DELETE FROM fluency_tables', checkComplete);
      this.db.run('DELETE FROM resource_recommendations', checkComplete);
      this.db.run('DELETE FROM learning_paths', checkComplete);
    });
  }

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