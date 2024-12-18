import { useState, useEffect, useCallback } from 'react';
import { AuditLog, AuditLogFilters } from '../types';
import { auditService } from '../services/auditService';

// Sample audit logs for development and demonstration
const sampleAuditLogs: AuditLog[] = [
  {
    entityId: '1',
    entityType: 'lead',
    action: 'CREATE',
    changes: [
      { field: 'name', oldValue: null, newValue: 'John Smith' },
      { field: 'email', oldValue: null, newValue: 'john.smith@example.com' },
      { field: 'status', oldValue: null, newValue: 'New' },
    ],
    userId: 'alice.johnson',
    userType: 'sales_rep',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    entityId: '2',
    entityType: 'contact',
    action: 'UPDATE',
    changes: [
      { field: 'phone', oldValue: '+1234567890', newValue: '+1987654321' },
      { field: 'title', oldValue: 'Manager', newValue: 'Senior Manager' },
    ],
    userId: 'bob.wilson',
    userType: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    entityId: '3',
    entityType: 'opportunity',
    action: 'UPDATE',
    changes: [
      { field: 'stage', oldValue: 'Qualification', newValue: 'Proposal' },
      { field: 'value', oldValue: '50000', newValue: '75000' },
      { field: 'probability', oldValue: '50', newValue: '75' },
    ],
    userId: 'carol.brown',
    userType: 'sales_manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    entityId: '4',
    entityType: 'company',
    action: 'CREATE',
    changes: [
      { field: 'name', oldValue: null, newValue: 'Tech Solutions Inc.' },
      { field: 'industry', oldValue: null, newValue: 'Technology' },
      { field: 'size', oldValue: null, newValue: '100-500' },
    ],
    userId: 'david.miller',
    userType: 'sales_rep',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    entityId: '5',
    entityType: 'lead',
    action: 'DELETE',
    changes: [
      { field: 'name', oldValue: 'Sarah Williams', newValue: null },
      { field: 'email', oldValue: 'sarah.w@example.com', newValue: null },
    ],
    userId: 'emma.davis',
    userType: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
  },
  {
    entityId: '6',
    entityType: 'product',
    action: 'UPDATE',
    changes: [
      { field: 'price', oldValue: '999.99', newValue: '1299.99' },
      { field: 'stock', oldValue: '100', newValue: '75' },
      { field: 'description', oldValue: 'Basic plan', newValue: 'Premium plan with additional features' },
    ],
    userId: 'frank.thomas',
    userType: 'product_manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
];

/**
 * Custom hook for managing audit log state and operations
 */
export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogFilters>({
    entityType: 'all',
    searchTerm: '',
    actionType: 'all actions',
    timeRange: 'all time'
  });

  /**
   * Fetches audit logs from the server
   */
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const data = await auditService.fetchAuditLogs(filters.entityType);
      // If no data from API, use sample data
      setAuditLogs(data?.length > 0 ? data : sampleAuditLogs);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      // Use sample data if API fails
      setAuditLogs(sampleAuditLogs);
    } finally {
      setLoading(false);
    }
  }, [filters.entityType]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  /**
   * Updates the entity type filter
   */
  const setEntityType = (entityType: string) => {
    setFilters(prev => ({ ...prev, entityType }));
  };

  /**
   * Updates the search term filter
   */
  const setSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  /**
   * Updates the action type filter
   */
  const setActionType = (actionType: string) => {
    setFilters(prev => ({ ...prev, actionType }));
  };

  /**
   * Updates the time range filter
   */
  const setTimeRange = (timeRange: string) => {
    setFilters(prev => ({ ...prev, timeRange }));
  };

  /**
   * Formats a timestamp into a localized string
   */
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * Formats a value for display
   */
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  /**
   * Filters logs based on current filters
   */
  const getFilteredLogs = useCallback(() => {
    return auditLogs
      .filter(log => {
        // Entity type filter
        if (filters.entityType !== 'all' && log.entityType !== filters.entityType) {
          return false;
        }

        // Action type filter
        if (filters.actionType !== 'all actions' && 
            log.action.toLowerCase() !== filters.actionType) {
          return false;
        }

        // Time range filter
        const logTime = new Date(log.timestamp).getTime();
        const now = Date.now();
        switch (filters.timeRange) {
          case 'last 24 hours':
            if (now - logTime > 24 * 60 * 60 * 1000) return false;
            break;
          case 'last 7 days':
            if (now - logTime > 7 * 24 * 60 * 60 * 1000) return false;
            break;
          case 'last 30 days':
            if (now - logTime > 30 * 24 * 60 * 60 * 1000) return false;
            break;
          case 'last 90 days':
            if (now - logTime > 90 * 24 * 60 * 60 * 1000) return false;
            break;
        }

        // Search term filter
        const searchString = filters.searchTerm.toLowerCase();
        return (
          log.entityType.toLowerCase().includes(searchString) ||
          log.action.toLowerCase().includes(searchString) ||
          log.userId.toLowerCase().includes(searchString) ||
          log.changes.some(change => 
            change.field.toLowerCase().includes(searchString) ||
            formatValue(change.oldValue).toLowerCase().includes(searchString) ||
            formatValue(change.newValue).toLowerCase().includes(searchString)
          )
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditLogs, filters]);

  return {
    auditLogs: getFilteredLogs(),
    loading,
    filters,
    setEntityType,
    setSearchTerm,
    setActionType,
    setTimeRange,
    formatTimestamp,
    formatValue,
  };
};
