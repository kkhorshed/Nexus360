import { Router, Request, Response } from 'express';
import { Lead, ILead } from '../models/Lead';
import { createAuditMiddleware } from '@nexus360/shared/audit/auditMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  originalDocument?: any;
}

const router = Router();
const auditMiddleware = createAuditMiddleware({
  serviceName: 'crm-service',
  serviceUrl: process.env.AUDIT_SERVICE_URL || 'http://localhost:3001/api/audit'
});

// Get all leads
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json({ success: true, data: leads });
}));

// Get lead by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new AppError(404, 'Lead not found');
  }
  res.json({ success: true, data: lead });
}));

// Create new lead
router.post('/',
  auditMiddleware.trackChanges('lead'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User ID required');
    }

    const lead = new Lead({
      ...req.body,
      createdBy: userId,
      updatedBy: userId
    });

    await lead.save();
    res.status(201).json({ success: true, data: lead });
  })
);

// Update lead
router.put('/:id',
  auditMiddleware.trackChanges('lead'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User ID required');
    }

    // Store original document for audit
    const originalLead = await Lead.findById(req.params.id);
    if (!originalLead) {
      throw new AppError(404, 'Lead not found');
    }
    req.originalDocument = originalLead.toObject();

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      throw new AppError(404, 'Lead not found');
    }

    res.json({ success: true, data: lead });
  })
);

// Delete lead
router.delete('/:id',
  auditMiddleware.trackDeletion('lead'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Store original document for audit
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      throw new AppError(404, 'Lead not found');
    }
    req.originalDocument = lead.toObject();

    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted successfully' });
  })
);

export default router;
