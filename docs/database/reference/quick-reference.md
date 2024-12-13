# Nexus360 Database Quick Reference

## Connection Details

```bash
Host: localhost (development) / nexus360-db.postgres.database.azure.com (production)
Port: 5432
Default User: nexus360admin
```

## Databases

| Database Name | Service | Description |
|--------------|---------|-------------|
| nexus360_auth | Auth Service | User authentication and authorization |
| nexus360_contacts | Contact Service | Contact and company management |
| nexus360_sales | Sales Service | Deal pipeline and sales tracking |
| nexus360_leads | Lead Service | Lead management and tracking |
| nexus360_tasks | Task Service | Task and activity management |
| nexus360_analytics | Analytics Service | Reporting and analytics |
| nexus360_integration | Integration Service | Third-party integrations |
| nexus360_notifications | Notification Service | System notifications |

## Common Queries

### Authentication

```sql
-- Get user details
SELECT * FROM users WHERE email = 'user@example.com';

-- Get user roles
SELECT r.name 
FROM roles r 
JOIN user_roles ur ON r.id = ur.role_id 
WHERE ur.user_id = 1;

-- Get user permissions
SELECT p.name 
FROM permissions p 
JOIN role_permissions rp ON p.id = rp.permission_id 
JOIN user_roles ur ON rp.role_id = ur.role_id 
WHERE ur.user_id = 1;
```

### Contacts

```sql
-- Get contact with company
SELECT c.*, co.name as company_name 
FROM contacts c 
LEFT JOIN companies co ON c.company_id = co.id 
WHERE c.email = 'contact@example.com';

-- Get contact activities
SELECT ca.*, at.name as activity_type 
FROM contact_activities ca 
JOIN activity_types at ON ca.activity_type_id = at.id 
WHERE ca.contact_id = 1;
```

### Deals

```sql
-- Get deals by company
SELECT d.*, ps.name as stage_name 
FROM deals d 
JOIN pipeline_stages ps ON d.pipeline_stage_id = ps.id 
WHERE d.company_id = 1;

-- Get deal activities
SELECT da.*, at.name as activity_type 
FROM deal_activities da 
JOIN activity_types at ON da.activity_type_id = at.id 
WHERE da.deal_id = 1;
```

### Tasks

```sql
-- Get user's tasks
SELECT t.*, u.email as assignee_email 
FROM tasks t 
JOIN users u ON t.assignee_id = u.id 
WHERE t.assignee_id = 1 AND t.status != 'Completed';

-- Get tasks by related entity
SELECT * FROM tasks 
WHERE related_to_type = 'Deal' AND related_to_id = 1;
```

### Leads

```sql
-- Get leads by owner
SELECT l.*, ls.name as status_name 
FROM leads l 
JOIN lead_statuses ls ON l.status_id = ls.id 
WHERE l.owner_id = 1;

-- Get leads by status
SELECT * FROM leads 
WHERE status_id = 1;
```

## Common Joins

### Contact Information
```sql
SELECT 
    c.*,
    co.name as company_name,
    jr.name as job_role,
    ls.name as lifecycle_stage,
    cnt.name as country,
    st.name as state,
    ct.name as city
FROM contacts c
LEFT JOIN companies co ON c.company_id = co.id
LEFT JOIN job_roles jr ON c.job_role_id = jr.id
LEFT JOIN lifecycle_stages ls ON c.lifecycle_stage_id = ls.id
LEFT JOIN countries cnt ON c.country_id = cnt.id
LEFT JOIN states st ON c.state_id = st.id
LEFT JOIN cities ct ON c.city_id = ct.id;
```

### Deal Information
```sql
SELECT 
    d.*,
    co.name as company_name,
    c.email as contact_email,
    ps.name as pipeline_stage,
    u.email as owner_email
FROM deals d
JOIN companies co ON d.company_id = co.id
LEFT JOIN contacts c ON d.contact_id = c.id
JOIN pipeline_stages ps ON d.pipeline_stage_id = ps.id
JOIN users u ON d.owner_id = u.id;
```

## Indexes

### Key Performance Indexes
```sql
-- Companies
idx_companies_name
idx_companies_domain

-- Contacts
idx_contacts_email
idx_contacts_company
idx_contacts_name

-- Deals
idx_deals_company
idx_deals_contact
idx_deals_stage
idx_deals_owner
idx_deals_status

-- Tasks
idx_tasks_assignee
idx_tasks_creator
idx_tasks_due_date
idx_tasks_status
idx_tasks_related

-- Leads
idx_leads_email
idx_leads_owner
idx_leads_status
idx_leads_name
```

## Best Practices

1. Always use parameterized queries to prevent SQL injection
2. Include WHERE clauses on indexed columns for better performance
3. Use appropriate JOIN types (LEFT, INNER) based on data requirements
4. Include pagination for large result sets
5. Use transactions for multi-table operations
6. Add appropriate indexes for frequently used queries
7. Regular VACUUM and ANALYZE for optimal performance

## Maintenance Queries

### Table Statistics
```sql
SELECT 
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables;
```

### Index Usage
```sql
SELECT 
    schemaname,
    relname,
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes;
```

### Connection Status
```sql
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    backend_start,
    state
FROM pg_stat_activity;
```

## Backup Commands

```bash
# Backup single database
pg_dump -h localhost -U nexus360admin -d nexus360_contacts > backup.sql

# Backup all databases
pg_dumpall -h localhost -U nexus360admin > full_backup.sql

# Restore database
psql -h localhost -U nexus360admin -d nexus360_contacts < backup.sql
