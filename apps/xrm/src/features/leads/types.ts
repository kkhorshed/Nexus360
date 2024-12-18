import { LEAD_SOURCES, LEAD_STATUSES } from './constants';

export type LeadSource = typeof LEAD_SOURCES[number];
export type LeadStatus = typeof LEAD_STATUSES[number];

// Required fields for a lead
export interface LeadBase {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
}

// Optional fields that can be added to a lead
export interface LeadOptional {
  requirements?: string;
  notes?: string;
}

// Complete lead type with ID and optional fields
export interface Lead extends LeadBase, LeadOptional {
  id: number;
  [key: string]: string | number | undefined; // For DataFilter compatibility
}

// Form data type without ID but with all other fields
export type LeadFormData = LeadBase & LeadOptional;
