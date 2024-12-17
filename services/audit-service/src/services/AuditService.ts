import { Repository } from 'typeorm';
import { AuditLog } from '../models/AuditLog';
import { AppError } from '../utils/errors';

export interface AuditLogFilters {
  entityId?: string;
  entityType?: string;
  userId?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class AuditService {
  constructor(private auditLogRepository: Repository<AuditLog>) {}

  async logChange(auditData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogRepository.create({
        ...auditData,
        timestamp: new Date()
      });
      
      return await this.auditLogRepository.save(auditLog);
    } catch (error) {
      throw new AppError(500, `Failed to create audit log: ${error}`);
    }
  }

  async getAuditLogs(filters: AuditLogFilters): Promise<AuditLog[]> {
    try {
      const query = this.auditLogRepository.createQueryBuilder('auditLog');

      if (filters.entityId) {
        query.andWhere('auditLog.entityId = :entityId', { entityId: filters.entityId });
      }
      
      if (filters.entityType) {
        query.andWhere('auditLog.entityType = :entityType', { entityType: filters.entityType });
      }
      
      if (filters.userId) {
        query.andWhere('auditLog.userId = :userId', { userId: filters.userId });
      }
      
      if (filters.action) {
        query.andWhere('auditLog.action = :action', { action: filters.action });
      }

      if (filters.startDate || filters.endDate) {
        if (filters.startDate) {
          query.andWhere('auditLog.timestamp >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
          query.andWhere('auditLog.timestamp <= :endDate', { endDate: filters.endDate });
        }
      }

      query.orderBy('auditLog.timestamp', 'DESC');

      if (filters.limit) {
        query.take(filters.limit);
      }
      
      if (filters.offset) {
        query.skip(filters.offset);
      }

      return await query.getMany();
    } catch (error) {
      throw new AppError(500, `Failed to retrieve audit logs: ${error}`);
    }
  }

  async getAuditLogById(id: string): Promise<AuditLog | null> {
    try {
      return await this.auditLogRepository.findOneBy({ id });
    } catch (error) {
      throw new AppError(500, `Failed to retrieve audit log: ${error}`);
    }
  }

  async getEntityHistory(entityId: string, entityType: string): Promise<AuditLog[]> {
    try {
      return await this.auditLogRepository.find({
        where: { entityId, entityType },
        order: { timestamp: 'DESC' }
      });
    } catch (error) {
      throw new AppError(500, `Failed to retrieve entity history: ${error}`);
    }
  }

  async getUserActivity(userId: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    try {
      const query = this.auditLogRepository.createQueryBuilder('auditLog')
        .where('auditLog.userId = :userId', { userId });

      if (startDate) {
        query.andWhere('auditLog.timestamp >= :startDate', { startDate });
      }
      
      if (endDate) {
        query.andWhere('auditLog.timestamp <= :endDate', { endDate });
      }

      query.orderBy('auditLog.timestamp', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new AppError(500, `Failed to retrieve user activity: ${error}`);
    }
  }
}
