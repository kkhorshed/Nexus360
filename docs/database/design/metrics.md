# Database Metrics Summary

## Table Structure Overview

### Core Tables (3)
```
1. Companies (24 fields)
   - Basic Info: id, name, domain, website
   - Location: country_id, state_id, city_id
   - Business: industry_id, revenue, employees
   - Settings: billing_type, account_type
   - Metadata: created_at, updated_at

2. Contacts (25 fields)
   - Basic Info: id, first_name, last_name, email
   - Professional: company_id, job_role, department
   - Location: country_id, state_id, city_id
   - Status: lifecycle_stage, lead_status
   - Metadata: created_at, updated_at

3. Deals (15 fields)
   - Basic Info: id, name, amount
   - Relations: company_id, contact_id
   - Status: stage, close_date
   - Metadata: created_at, updated_at
```

### Reference Tables (7)
```
1. Countries (4 fields)
   - id, name, iso_code, is_active

2. States (5 fields)
   - id, country_id, name, code, is_active

3. Cities (4 fields)
   - id, state_id, name, is_active

4. Industries (5 fields)
   - id, parent_id, name, description, is_active

5. Job_Roles (4 fields)
   - id, name, category, is_active

6. Lifecycle_Stages (4 fields)
   - id, name, sequence, is_active

7. Activity_Types (4 fields)
   - id, name, category, is_active
```

### Activity Tables (2)
```
1. Contact_Activities (6 fields)
   - id, contact_id, type_id
   - activity_date, description
   - created_at

2. Deal_Activities (6 fields)
   - id, deal_id, type_id
   - activity_date, description
   - created_at
```

### History Tables (2)
```
1. Company_History (7 fields)
   - id, company_id, field_name
   - old_value, new_value
   - change_date, user_id

2. Contact_History (7 fields)
   - id, contact_id, field_name
   - old_value, new_value
   - change_date, user_id
```

## Relationship Count
```
Total Relationships: 15

One-to-Many (11):
- Countries → States
- States → Cities
- Companies → Contacts
- Companies → Deals
- Contacts → Deals
- Companies → Company_History
- Contacts → Contact_Activities
- Contacts → Contact_History
- Deals → Deal_Activities
- Industries → Industries (self)
- Job_Roles → Contacts

Reference (4):
- Companies → Industries
- Contacts → Job_Roles
- Contacts → Lifecycle_Stages
- Activities → Activity_Types
```

## Index Distribution
```
Primary Keys: 14 (all tables)

Foreign Keys: 20
- Companies: 4
- Contacts: 6
- Deals: 2
- States: 1
- Cities: 1
- Activities: 4
- History: 2

Additional Indexes: 10
- Companies: name, domain
- Contacts: email, phone
- Deals: close_date, amount
- Activities: activity_date
- History: change_date
```

## Data Types Used
```
Numeric:
- BIGINT (main table IDs)
- INT (reference table IDs)
- DECIMAL (monetary values)

String:
- VARCHAR(255) (emails, URLs)
- VARCHAR(100) (names)
- TEXT (descriptions)

Date/Time:
- TIMESTAMP (audit dates)
- DATE (business dates)

Other:
- BOOLEAN (flags)
- ENUM (fixed values)
```

## Storage Estimates

### Per Record Size
```
Companies: ~500 bytes
Contacts: ~750 bytes
Deals: ~400 bytes
Activities: ~300 bytes
History: ~400 bytes
Reference: ~200 bytes
```

### Sample Dataset (10,000 companies)
```
Companies: 5 MB
Contacts (5/company): 37.5 MB
Deals (3/company): 12 MB
Activities (10/contact): 150 MB
History (100/entity): 400 MB
Reference data: 1 MB

Total estimate: ~605.5 MB
```

## Performance Considerations

### Indexing Impact
```
Index overhead: ~20% of data size
Total with indexes: ~726.6 MB

Key indexes:
- Primary keys: ~14 MB
- Foreign keys: ~40 MB
- Search indexes: ~20 MB
```

### Query Optimization
```
Optimized for:
- Company lookups
- Contact searches
- Activity tracking
- History queries
```

For implementation details, see [../implementation/guide.md](../implementation/guide.md)
