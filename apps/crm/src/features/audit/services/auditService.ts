/**
 * Service for handling audit-related API calls
 */
import { AuditLog } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/audit';

export const auditService = {
  /**
   * Fetches audit logs based on entity type
   * @param entityType - Type of entity to filter by, or 'all' for no filtering
   * @returns Promise containing the audit logs
   */
  async fetchAuditLogs(entityType: string): Promise<AuditLog[]> {
    try {
      const url = `${API_BASE_URL}/logs${
        entityType !== 'all' ? `?entityType=${entityType}` : ''
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
};
