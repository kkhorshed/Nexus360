import React from 'react';
import { Box } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import PageWrapper from '../../components/common/PageWrapper';
import { useAuditLogs } from './hooks/useAuditLogs';
import { AuditLogFilters } from './components/AuditLogFilters';
import { AuditLogItem } from './components/AuditLogItem';

/**
 * Main component for displaying the audit trail
 * Shows a timeline of all changes made to entities in the system
 */
const AuditTrail: React.FC = () => {
  const {
    auditLogs,
    loading,
    filters,
    setEntityType,
    setSearchTerm,
    setActionType,
    setTimeRange,
    formatTimestamp,
    formatValue,
  } = useAuditLogs();

  return (
    <PageWrapper
      title="Audit Trail"
      description="Track all changes made to entities in the system"
    >
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <AuditLogFilters
          entityType={filters.entityType}
          searchTerm={filters.searchTerm}
          actionType={filters.actionType}
          timeRange={filters.timeRange}
          onEntityTypeChange={setEntityType}
          onSearchTermChange={setSearchTerm}
          onActionTypeChange={setActionType}
          onTimeRangeChange={setTimeRange}
        />

        {loading ? (
          <Box sx={{ p: 2 }}>Loading audit logs...</Box>
        ) : auditLogs.length === 0 ? (
          <Box sx={{ p: 2 }}>No audit logs found</Box>
        ) : (
          <Timeline>
            {auditLogs.map((log, index) => (
              <AuditLogItem
                key={index}
                log={log}
                formatTimestamp={formatTimestamp}
                formatValue={formatValue}
              />
            ))}
          </Timeline>
        )}
      </Box>
    </PageWrapper>
  );
};

export default AuditTrail;
