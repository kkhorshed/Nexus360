import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  source: string;
  value: number;
  description?: string;
  assignedTo: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  description: String,
  assignedTo: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for common queries
LeadSchema.index({ status: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ company: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
