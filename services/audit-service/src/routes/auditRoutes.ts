import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const auditController = new AuditController();

// Create audit log
router.post(
  '/logs',
  asyncHandler(auditController.logChange)
);

// Get audit logs with filters
router.get(
  '/logs',
  asyncHandler(auditController.getAuditLogs)
);

// Get specific audit log by ID
router.get(
  '/logs/:id',
  asyncHandler(auditController.getAuditLogById)
);

// Get entity history
router.get(
  '/entity/:entityType/:entityId/history',
  asyncHandler(auditController.getEntityHistory)
);

// Get user activity
router.get(
  '/user/:userId/activity',
  asyncHandler(auditController.getUserActivity)
);

export default router;
