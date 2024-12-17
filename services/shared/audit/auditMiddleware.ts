import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

interface AuditConfig {
  serviceUrl?: string;
  serviceName: string;
}

interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

interface AuditPayload {
  entityId: string;
  entityType: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: AuditChange[];
  userId: string;
  userType: string;
  metadata?: Record<string, any>;
}

export const createAuditMiddleware = (config: AuditConfig) => {
  const auditServiceUrl = config.serviceUrl || 'http://localhost:3001/api/audit';

  const logAuditEvent = async (payload: AuditPayload) => {
    try {
      await axios.post(`${auditServiceUrl}/logs`, payload);
    } catch (error) {
      console.error(`[Audit Service] Failed to log audit event:`, error);
      // Don't throw error to prevent disrupting the main request flow
    }
  };

  return {
    // Middleware for tracking changes in request body
    trackChanges: (entityType: string) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.json;
        const userId = (req as any).user?.id;
        const userType = (req as any).user?.role;

        if (!userId) {
          console.warn('[Audit Service] No user ID found in request');
          return next();
        }

        res.json = function (data: any) {
          // Capture the response data before sending
          const changes: AuditChange[] = [];
          
          if (req.method === 'POST') {
            // For creation, log all fields as new values
            Object.entries(req.body).forEach(([field, value]) => {
              changes.push({
                field,
                oldValue: null,
                newValue: value
              });
            });
          } else if (req.method === 'PUT' || req.method === 'PATCH') {
            // For updates, log changed fields
            Object.entries(req.body).forEach(([field, value]) => {
              changes.push({
                field,
                oldValue: (req as any).originalDocument?.[field],
                newValue: value
              });
            });
          }

          if (changes.length > 0) {
            const auditPayload: AuditPayload = {
              entityId: data.id || req.params.id,
              entityType,
              action: req.method === 'POST' ? 'CREATE' : 'UPDATE',
              changes,
              userId,
              userType,
              metadata: {
                serviceName: config.serviceName,
                path: req.path,
                method: req.method
              }
            };

            logAuditEvent(auditPayload);
          }

          return originalSend.call(res, data);
        };

        next();
      };
    },

    // Middleware for tracking deletions
    trackDeletion: (entityType: string) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        const userType = (req as any).user?.role;

        if (!userId) {
          console.warn('[Audit Service] No user ID found in request');
          return next();
        }

        const originalSend = res.json;

        res.json = function (data: any) {
          const changes: AuditChange[] = [{
            field: '*',
            oldValue: (req as any).originalDocument,
            newValue: null
          }];

          const auditPayload: AuditPayload = {
            entityId: req.params.id,
            entityType,
            action: 'DELETE',
            changes,
            userId,
            userType,
            metadata: {
              serviceName: config.serviceName,
              path: req.path,
              method: req.method
            }
          };

          logAuditEvent(auditPayload);
          return originalSend.call(res, data);
        };

        next();
      };
    }
  };
};
