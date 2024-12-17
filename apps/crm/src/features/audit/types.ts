/**
 * Represents a single change in an audit log entry
 */
export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

/**
 * Represents the type of action performed in an audit log
 */
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * Represents a complete audit log entry
 */
export interface AuditLog {
  entityId: string;
  entityType: string;
  action: AuditAction;
  changes: AuditChange[];
  userId: string;
  userType: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Filter parameters for audit logs
 */
export interface AuditLogFilters {
  entityType: string;
  searchTerm: string;
  actionType: string;
  timeRange: string;
}
