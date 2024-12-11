# CRM Database ASCII Model

```
+------------------+     +-------------------+     +----------------+
|    COUNTRIES     |     |      STATES      |     |     CITIES     |
+------------------+     +-------------------+     +----------------+
| PK id           |<-+  | PK id            |<-+  | PK id         |
|    name         |  |  | FK country_id    |  |  | FK state_id   |
|    iso_code     |  +--| name             |  +--| name          |
|    is_active    |     | state_code       |     +----------------+
+------------------+     +-------------------+

+------------------+     +-------------------+     +----------------+
|    COMPANIES     |     |     CONTACTS     |     |     DEALS      |
+------------------+     +-------------------+     +----------------+
| PK id           |<-+  | PK id            |<-+  | PK id         |
|    name         |  |  | FK company_id    |  |  | FK company_id |
|    domain       |  +--| first_name       |  +--| FK contact_id |
|    website      |     | last_name        |     | name          |
| FK country_id   |     | email            |     | amount        |
| FK state_id     |     | phone            |     | close_date    |
| FK city_id      |     | FK country_id    |     | status        |
| FK industry_id  |     | FK state_id      |     +----------------+
+------------------+     | FK city_id       |
         ^              | FK job_role_id    |
         |              | FK lifecycle_id   |
         |              +-------------------+
         |
+------------------+
|   INDUSTRIES     |
+------------------+
| PK id           |
| FK parent_id    |
|    name         |
|    description  |
+------------------+

+------------------+     +-------------------+     +----------------+
|    JOB_ROLES     |     |  LIFECYCLE_STAGES |     | ACTIVITY_TYPES |
+------------------+     +-------------------+     +----------------+
| PK id           |     | PK id            |     | PK id         |
|    name         |     |    name          |     |    name       |
|    category     |     |    sequence      |     |    category   |
+------------------+     +-------------------+     +----------------+
         ^                        ^                       ^
         |                        |                       |
+------------------+     +-------------------+     +----------------+
|CONTACT_ACTIVITIES|     |  DEAL_ACTIVITIES  |     |COMPANY_HISTORY|
+------------------+     +-------------------+     +----------------+
| PK id           |     | PK id            |     | PK id         |
| FK contact_id   |     | FK deal_id       |     | FK company_id |
| FK type_id      |     | FK type_id       |     |    field_name |
|    activity_date|     |    activity_date |     |    old_value  |
|    description  |     |    description   |     |    new_value  |
+------------------+     +-------------------+     |    change_date|
                                                 +----------------+

Legend:
-------
PK = Primary Key
FK = Foreign Key
<-+ = One-to-Many Relationship
 ^ = Reference Relationship
```

## Key Components

### Core Entities
1. Companies
   - Central business entity
   - Contains business details
   - Links to locations

2. Contacts
   - Individual records
   - Connected to companies
   - Professional details

3. Deals
   - Business opportunities
   - Links to companies/contacts
   - Value tracking

### Reference Data
1. Location Hierarchy
   - Countries
   - States
   - Cities

2. Business Classifications
   - Industries
   - Job Roles
   - Lifecycle Stages

### Activity Tracking
1. Contact Activities
   - Interaction records
   - Timestamped events
   - Categorized actions

2. Deal Activities
   - Deal progress
   - Status changes
   - Value updates

### History Tracking
- Company changes
- Field modifications
- Audit trail

## Relationships Explained

### Hierarchical
1. Location Chain
   ```
   Countries → States → Cities
   ```

2. Industry Structure
   ```
   Industries → Sub-Industries
   ```

### Business
1. Company Relationships
   ```
   Companies → Contacts
   Companies → Deals
   ```

2. Contact Relationships
   ```
   Contacts → Activities
   Contacts → Job Roles
   ```

### Reference
1. Location References
   ```
   Companies → Countries/States/Cities
   Contacts → Countries/States/Cities
   ```

2. Classification References
   ```
   Companies → Industries
   Contacts → Job Roles
   ```

## Implementation Notes

1. Primary Keys
   - BIGINT for main entities
   - INT for reference data
   - Auto-incrementing

2. Foreign Keys
   - Proper indexing
   - Cascade rules
   - Null handling

3. Audit Trail
   - History tables
   - Timestamps
   - User tracking

For detailed schema information, see [schema.md](schema.md)
