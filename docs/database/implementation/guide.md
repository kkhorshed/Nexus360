# Database Implementation Guide

## Setup Steps

1. Create database with UTF8MB4 encoding
2. Execute schema in order:
   - Reference tables first (countries, industries, job_roles)
   - Core tables second (companies, contacts)
   - Activity/history tables last

## Best Practices

### Data Types
- IDs: BIGINT for scalability
- Text: VARCHAR with appropriate lengths
- Dates: TIMESTAMP for audit trails
- Money: DECIMAL(15,2) for precision

### Indexing
- Create indexes after bulk data load
- Monitor index usage and adjust as needed
- Consider partial indexes for large tables

### Performance
- Partition history tables by date
- Batch inserts for bulk operations
- Use prepared statements
- Cache frequently accessed data

### Maintenance
- Regular ANALYZE TABLE operations
- Monitor index fragmentation
- Archive old history records
- Backup strategy: daily full + hourly incremental

## Common Queries

### Company Search
```sql
SELECT c.*, i.name as industry
FROM companies c
JOIN industries i ON c.industry_id = i.id
WHERE c.name LIKE ? OR c.domain LIKE ?
LIMIT 100;
```

### Contact Lookup
```sql
SELECT ct.*, c.name as company_name
FROM contacts ct
JOIN companies c ON ct.company_id = c.id
WHERE ct.email = ?;
```

### Activity Tracking
```sql
SELECT a.*, t.name as activity_type
FROM contact_activities a
JOIN activity_types t ON a.activity_type_id = t.id
WHERE a.contact_id = ?
ORDER BY a.activity_date DESC
LIMIT 50;
```

## Error Handling

- Use transactions for multi-table operations
- Implement retry logic for deadlocks
- Log all database errors with context
- Handle duplicate key violations gracefully

## Security

- Use prepared statements to prevent SQL injection
- Implement row-level security where needed
- Audit sensitive data access
- Encrypt sensitive columns
