-- Applications table to track platform apps
CREATE TABLE applications (
    id INT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert core applications
INSERT INTO applications (id, name, display_name, description) VALUES
(1, 'xrm', 'XRM', 'Extended Relationship Management application'),
(2, 'sales_compensation', 'Sales Compensation', 'Sales compensation and commission management');

-- User application access
CREATE TABLE user_app_access (
    user_id BIGINT,
    app_id INT,
    granted_by BIGINT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, app_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (app_id) REFERENCES applications(id),
    FOREIGN KEY (granted_by) REFERENCES users(id)
);

-- Application-specific roles
CREATE TABLE app_roles (
    id INT PRIMARY KEY,
    app_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (app_id, name),
    FOREIGN KEY (app_id) REFERENCES applications(id)
);

-- Insert default roles for XRM
INSERT INTO app_roles (id, app_id, name, description) VALUES
(1, 1, 'xrm_admin', 'Full access to XRM features'),
(2, 1, 'xrm_user', 'Basic XRM user access'),
(3, 1, 'xrm_viewer', 'Read-only access to XRM');

-- Insert default roles for Sales Compensation
INSERT INTO app_roles (id, app_id, name, description) VALUES
(4, 2, 'comp_admin', 'Full access to Sales Compensation features'),
(5, 2, 'comp_manager', 'Manage team compensations'),
(6, 2, 'comp_user', 'View own compensation data');

-- User application roles
CREATE TABLE user_app_roles (
    user_id BIGINT,
    app_role_id INT,
    granted_by BIGINT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, app_role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (app_role_id) REFERENCES app_roles(id),
    FOREIGN KEY (granted_by) REFERENCES users(id)
);

-- Application permissions
CREATE TABLE app_permissions (
    id INT PRIMARY KEY,
    app_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (app_id, name),
    FOREIGN KEY (app_id) REFERENCES applications(id)
);

-- Insert XRM permissions
INSERT INTO app_permissions (id, app_id, name, description) VALUES
(1, 1, 'xrm.view', 'View XRM data'),
(2, 1, 'xrm.create', 'Create XRM records'),
(3, 1, 'xrm.edit', 'Edit XRM records'),
(4, 1, 'xrm.delete', 'Delete XRM records'),
(5, 1, 'xrm.admin', 'Administer XRM settings');

-- Insert Sales Compensation permissions
INSERT INTO app_permissions (id, app_id, name, description) VALUES
(6, 2, 'comp.view_own', 'View own compensation'),
(7, 2, 'comp.view_team', 'View team compensation'),
(8, 2, 'comp.manage', 'Manage compensation rules'),
(9, 2, 'comp.approve', 'Approve compensation'),
(10, 2, 'comp.admin', 'Administer compensation settings');

-- Application role permissions
CREATE TABLE app_role_permissions (
    app_role_id INT,
    permission_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (app_role_id, permission_id),
    FOREIGN KEY (app_role_id) REFERENCES app_roles(id),
    FOREIGN KEY (permission_id) REFERENCES app_permissions(id)
);

-- Map XRM role permissions
INSERT INTO app_role_permissions (app_role_id, permission_id) VALUES
-- XRM Admin
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
-- XRM User
(2, 1), (2, 2), (2, 3),
-- XRM Viewer
(3, 1);

-- Map Sales Compensation role permissions
INSERT INTO app_role_permissions (app_role_id, permission_id) VALUES
-- Compensation Admin
(4, 6), (4, 7), (4, 8), (4, 9), (4, 10),
-- Compensation Manager
(5, 6), (5, 7), (5, 8), (5, 9),
-- Compensation User
(6, 6);

-- Indexes
CREATE INDEX idx_user_app_access_user ON user_app_access(user_id);
CREATE INDEX idx_user_app_access_app ON user_app_access(app_id);
CREATE INDEX idx_user_app_roles_user ON user_app_roles(user_id);
CREATE INDEX idx_app_roles_app ON app_roles(app_id);
CREATE INDEX idx_app_permissions_app ON app_permissions(app_id);
