import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog } from '../models/AuditLog';
import { AuditService } from '../services/AuditService';
import { AppError } from '../utils/errors';

export class AuditController {
  private auditService: AuditService;

  constructor() {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    this.auditService = new AuditService(auditLogRepository);
  }

  logChange = async (req: Request, res: Response) => {
    try {
      const auditData = req.body;
      
      // Add request metadata
      auditData.ipAddress = req.ip;
      auditData.userAgent = req.headers['user-agent'];
      
      const auditLog = await this.auditService.logChange(auditData);
      
      res.status(201).json({
        success: true,
        data: auditLog
      });
    } catch (error) {
      throw new AppError(500, `Failed to create audit log: ${error}`);
    }
  };

  getAuditLogs = async (req: Request, res: Response) => {
    try {
      const {
        entityId,
        entityType,
        userId,
        action,
        startDate,
        endDate,
        limit,
        offset
      } = req.query;

      const filters = {
        entityId: entityId as string,
        entityType: entityType as string,
        userId: userId as string,
        action: action as 'CREATE' | 'UPDATE' | 'DELETE',
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      };

      const auditLogs = await this.auditService.getAuditLogs(filters);
      
      res.json({
        success: true,
        data: auditLogs
      });
    } catch (error) {
      throw new AppError(500, `Failed to retrieve audit logs: ${error}`);
    }
  };

  getAuditLogById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const auditLog = await this.auditService.getAuditLogById(id);
      
      if (!auditLog) {
        throw new AppError(404, 'Audit log not found');
      }
      
      res.json({
        success: true,
        data: auditLog
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, `Failed to retrieve audit log: ${error}`);
    }
  };

  getEntityHistory = async (req: Request, res: Response) => {
    try {
      const { entityId, entityType } = req.params;
      const history = await this.auditService.getEntityHistory(entityId, entityType);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      throw new AppError(500, `Failed to retrieve entity history: ${error}`);
    }
  };

  getUserActivity = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;
      
      const activity = await this.auditService.getUserActivity(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      throw new AppError(500, `Failed to retrieve user activity: ${error}`);
    }
  };
}
