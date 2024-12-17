# Nexus360 Platform URLs

## Main Entry Points

- **Platform Entry URL**: http://localhost:3006/api/auth/login
  - This is the main entry point for the Nexus360 platform
  - Handles Microsoft authentication
  - Redirects to app switcher after successful authentication

- **App Switcher**: http://localhost:3000
  - Central hub for accessing all platform applications
  - Available after authentication
  - Displays user profile and available applications

## Application URLs

- **CRM**: http://localhost:3010
  - Customer relationship management application

- **Sales Compensation**: http://localhost:3030
  - Commission and incentive tracking

- **Admin**: http://localhost:3060
  - Platform administration and user management

## Authentication Flow

1. Users access platform via http://localhost:3006/api/auth/login
2. After successful authentication, redirected to app switcher (http://localhost:3000)
3. From app switcher, users can navigate to any platform application
4. Authentication state is preserved across application switches
