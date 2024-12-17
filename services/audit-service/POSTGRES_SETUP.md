# PostgreSQL Setup Instructions using pgAdmin 4

1. Open pgAdmin 4 (it should have been installed with PostgreSQL)

2. Reset Password:
   - Right-click on "PostgreSQL [version]" in the browser tree
   - Select "Connect Server"
   - Enter your current password if prompted
   - Right-click on "Login/Group Roles"
   - Select "Properties"
   - Go to the "Definition" tab
   - Enter "postgres" in the Password field
   - Click "Save"

3. Create Database:
   - Right-click on "Databases"
   - Select "Create" > "Database"
   - Enter "nexus360_audit" as the database name
   - Click "Save"

4. Verify Connection:
   - Right-click on "nexus360_audit"
   - Select "Connect"
   - You should see the database structure

The .env file is already configured with these settings:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nexus360_audit
```

After completing these steps, we can proceed with starting the audit service.
