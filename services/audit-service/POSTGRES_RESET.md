# Reset PostgreSQL Password When Current Password is Unknown

1. Locate and Edit pg_hba.conf:
   - Navigate to PostgreSQL data directory (typically `C:\Program Files\PostgreSQL\15\data`)
   - Open `pg_hba.conf` in a text editor as administrator
   - Find the line that starts with `host all all 127.0.0.1/32`
   - Change the authentication method from `scram-sha-256` or `md5` to `trust`
   - Save the file

2. Restart PostgreSQL Service:
   - Open Services (Win + R, type `services.msc`)
   - Find "PostgreSQL [version]"
   - Right-click and select "Restart"

3. Reset Password:
   - Open Command Prompt as Administrator
   - Run:
     ```cmd
     "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
     ```
   - In psql prompt, run:
     ```sql
     ALTER USER postgres WITH PASSWORD 'postgres';
     ```
   - Type `\q` to exit

4. Restore Security:
   - Edit `pg_hba.conf` again
   - Change the authentication method back to `scram-sha-256` (or what it was before)
   - Save the file
   - Restart PostgreSQL service again

5. Create Database:
   - Open Command Prompt as Administrator
   - Run:
     ```cmd
     "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
     ```
   - Enter the new password when prompted
   - In psql prompt, run:
     ```sql
     CREATE DATABASE nexus360_audit;
     ```
   - Type `\q` to exit

After completing these steps, the database will be ready for the audit service to use.
