# Nexus360 Database Documentation

## Overview

The Nexus360 platform uses multiple PostgreSQL databases to maintain data isolation between applications while ensuring efficient data access and management.

## Database Organization

### Platform Databases
1. **Integration DB** - Integration configurations and logs
2. **Analytics DB** - Platform-wide analytics and metrics

### Application Databases
1. **CRM DB** - Customer relationship management
2. **Chat DB** - AI chat conversations and knowledge base
3. **Sales DB** - Sales compensation and forecasting
4. **Marketing DB** - Marketing campaigns and leads

## Schema Details

### CRM Database
```sql
CREATE TABLE companies (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    website VARCHAR(255),
    industry_id INT,
    country_id INT,
    annual_revenue DECIMAL(15,2),
    number_of_employees INT,
    billing_type VARCHAR(50),
    account_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industries(id),
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE contacts (
    id BIGINT PRIMARY KEY,
    company_id BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    job_role_id INT,
    lifecycle_stage_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id)
);

CREATE TABLE deals (
    id BIGINT PRIMARY KEY,
    company_id BIGINT,
    name VARCHAR(255),
    amount DECIMAL(15,2),
    stage_id INT,
    owner_id BIGINT,
    close_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Chat Database
```sql
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    conversation_id BIGINT,
    content TEXT,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE TABLE knowledge_base (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sales Database
```sql
CREATE TABLE commissions (
    id BIGINT PRIMARY KEY,
    deal_id BIGINT,
    amount DECIMAL(15,2),
    status VARCHAR(50),
    payout_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(id)
);

CREATE TABLE forecasts (
    id BIGINT PRIMARY KEY,
    period_start DATE,
    period_end DATE,
    forecast_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2),
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Marketing Database
```sql
CREATE TABLE campaigns (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(100),
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id BIGINT PRIMARY KEY,
    campaign_id BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50),
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

## Performance Considerations

### Indexing Strategy
```sql
-- CRM indexes
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_deals_company ON deals(company_id);

-- Chat indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);

-- Sales indexes
CREATE INDEX idx_commissions_deal ON commissions(deal_id);
CREATE INDEX idx_forecasts_period ON forecasts(period_start, period_end);

-- Marketing indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_leads_campaign ON leads(campaign_id);
CREATE INDEX idx_leads_email ON leads(email);
```

### Storage Estimates
- Average record sizes:
  - Companies: ~500B
  - Contacts: ~750B
  - Deals: ~400B
  - Messages: ~1KB
  - Knowledge Base: ~2KB
  - Leads: ~600B

### Performance Optimization
1. **Partitioning**
   - Time-based partitioning for historical data
   - Range partitioning for large tables

2. **Caching Strategy**
   - Redis caching for frequently accessed data
   - Cache invalidation on updates

3. **Query Optimization**
   - Materialized views for complex reports
   - Regular VACUUM and analysis
   - Query plan monitoring

## Backup and Recovery

### Backup Strategy
1. **Daily Full Backups**
   - Stored in secure cloud storage
   - 30-day retention

2. **Continuous WAL Archiving**
   - 5-minute intervals
   - 7-day retention

### Recovery Procedures
1. Point-in-time recovery capability
2. Automated restore testing
3. Disaster recovery documentation

## Maintenance

### Regular Tasks
1. **Daily**
   - Index maintenance
   - Statistics updates
   - Backup verification

2. **Weekly**
   - Full VACUUM
   - Performance analysis
   - Storage monitoring

3. **Monthly**
   - Capacity planning
   - Query optimization review
   - Index strategy review

For detailed implementation guides and best practices, see the [implementation guide](implementation/guide.md).
