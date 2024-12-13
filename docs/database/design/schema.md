# Nexus360 Database Schema

## Platform Databases

### Authentication Database (nexus360_auth)

#### Users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    azure_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Roles
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP
);
```

#### User_Roles
```sql
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id INT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### Permissions
```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP
);
```

#### Role_Permissions
```sql
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    created_at TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
```

### Integration Database (nexus360_integration)

#### Integration_Configs
```sql
CREATE TABLE integration_configs (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Integration_Logs
```sql
CREATE TABLE integration_logs (
    id BIGINT PRIMARY KEY,
    integration_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES integration_configs(id)
);
```

### Notification Database (nexus360_notifications)

#### Notifications
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Notification_Templates
```sql
CREATE TABLE notification_templates (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Application Databases

### CRM Database (nexus360_crm)

#### Companies
```sql
CREATE TABLE companies (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    website VARCHAR(255),
    industry_id INT,
    country_id INT,
    annual_revenue DECIMAL(15,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Contacts
```sql
CREATE TABLE contacts (
    id BIGINT PRIMARY KEY,
    company_id BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    job_title VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

#### Deals
```sql
CREATE TABLE deals (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL,
    contact_id BIGINT,
    stage_id INT NOT NULL,
    amount DECIMAL(15,2),
    close_date DATE,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
```

### AI Chat Database (nexus360_chat)

#### Conversations
```sql
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Messages
```sql
CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    tokens INT,
    created_at TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

#### Knowledge_Base
```sql
CREATE TABLE knowledge_base (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Sales Compensation Database (nexus360_compensation)

#### Commission_Rules
```sql
CREATE TABLE commission_rules (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    criteria JSONB NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Sales_Performance
```sql
CREATE TABLE sales_performance (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    revenue DECIMAL(15,2) NOT NULL,
    commission DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Sales Forecasting Database (nexus360_forecasting)

#### Forecasts
```sql
CREATE TABLE forecasts (
    id BIGINT PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    forecast_type VARCHAR(50) NOT NULL,
    forecast_value DECIMAL(15,2) NOT NULL,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Forecast_Factors
```sql
CREATE TABLE forecast_factors (
    id BIGINT PRIMARY KEY,
    forecast_id BIGINT NOT NULL,
    factor_name VARCHAR(100) NOT NULL,
    factor_value DECIMAL(15,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (forecast_id) REFERENCES forecasts(id)
);
```

### Marketing Database (nexus360_marketing)

#### Campaigns
```sql
CREATE TABLE campaigns (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Leads
```sql
CREATE TABLE leads (
    id BIGINT PRIMARY KEY,
    campaign_id BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    score INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

## Common Tables

### Reference Tables

#### Countries
```sql
CREATE TABLE countries (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso_code_2 CHAR(2) NOT NULL,
    iso_code_3 CHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### Industries
```sql
CREATE TABLE industries (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

## Indexes

### Platform Indexes
```sql
-- Authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_azure_id ON users(azure_id);

-- Integration
CREATE INDEX idx_integration_logs_created ON integration_logs(created_at);
CREATE INDEX idx_integration_logs_status ON integration_logs(status);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, status);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

### Application Indexes
```sql
-- CRM
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_company ON deals(company_id);

-- AI Chat
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- Sales Compensation
CREATE INDEX idx_performance_user ON sales_performance(user_id);
CREATE INDEX idx_performance_period ON sales_performance(period_start, period_end);

-- Sales Forecasting
CREATE INDEX idx_forecasts_period ON forecasts(period_start, period_end);
CREATE INDEX idx_forecasts_type ON forecasts(forecast_type);

-- Marketing
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_campaign ON leads(campaign_id);
```

## Notes
- All timestamps are stored in UTC
- JSONB used for flexible configuration storage
- Vector type for AI embeddings
- Proper indexing for performance
- Foreign key constraints for data integrity
- Audit trails via timestamps
- Soft deletes via is_active flags
