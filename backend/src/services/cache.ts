import Redis from 'ioredis';
import { config } from '../config/environment';

export class CacheService {
  private static instance: CacheService;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis(config.cache.redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('error', (err) => {
      console.warn('Redis connection error:', err.message);
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Generate a cache key for fluency table
   */
  private getFluencyTableKey(roleTitle: string, industry: string): string {
    return `fluency_table:${roleTitle.toLowerCase().replace(/\s+/g, '_')}:${industry.toLowerCase()}`;
  }

  /**
   * Generate a cache key for resource recommendations
   */
  private getResourceRecommendationsKey(roleTitle: string, industry: string, level: string): string {
    return `resources:${roleTitle.toLowerCase().replace(/\s+/g, '_')}:${industry.toLowerCase()}:${level.toLowerCase()}`;
  }

  /**
   * Generate a cache key for learning path
   */
  private getLearningPathKey(roleTitle: string, industry: string, currentLevel: string, targetLevel: string): string {
    return `learning_path:${roleTitle.toLowerCase().replace(/\s+/g, '_')}:${industry.toLowerCase()}:${currentLevel.toLowerCase()}:${targetLevel.toLowerCase()}`;
  }

  /**
   * Get cached fluency table
   */
  async getFluencyTable(roleTitle: string, industry: string): Promise<any | null> {
    try {
      const key = this.getFluencyTableKey(roleTitle, industry);
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  /**
   * Cache fluency table
   */
  async setFluencyTable(roleTitle: string, industry: string, data: any): Promise<void> {
    try {
      const key = this.getFluencyTableKey(roleTitle, industry);
      await this.redis.setex(key, config.cache.ttl, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Get cached resource recommendations
   */
  async getResourceRecommendations(roleTitle: string, industry: string, level: string): Promise<any | null> {
    try {
      const key = this.getResourceRecommendationsKey(roleTitle, industry, level);
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  /**
   * Cache resource recommendations
   */
  async setResourceRecommendations(roleTitle: string, industry: string, level: string, data: any): Promise<void> {
    try {
      const key = this.getResourceRecommendationsKey(roleTitle, industry, level);
      await this.redis.setex(key, config.cache.ttl, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Get cached learning path
   */
  async getLearningPath(roleTitle: string, industry: string, currentLevel: string, targetLevel: string): Promise<any | null> {
    try {
      const key = this.getLearningPathKey(roleTitle, industry, currentLevel, targetLevel);
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  /**
   * Cache learning path
   */
  async setLearningPath(roleTitle: string, industry: string, currentLevel: string, targetLevel: string, data: any): Promise<void> {
    try {
      const key = this.getLearningPathKey(roleTitle, industry, currentLevel, targetLevel);
      await this.redis.setex(key, config.cache.ttl, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    try {
      await this.redis.flushall();
      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    connected: boolean;
  }> {
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      
      return {
        totalKeys: keys,
        memoryUsage: this.parseMemoryUsage(info),
        connected: this.redis.status === 'ready'
      };
    } catch (error) {
      console.warn('Cache stats error:', error);
      return {
        totalKeys: 0,
        memoryUsage: 'Unknown',
        connected: false
      };
    }
  }

  private parseMemoryUsage(info: string): string {
    const lines = info.split('\n');
    const usedMemory = lines.find(line => line.startsWith('used_memory_human:'))?.split(':')[1]?.trim();
    return usedMemory || 'Unknown';
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('✅ Redis connection closed');
    } catch (error) {
      console.warn('Redis close error:', error);
    }
  }
}
