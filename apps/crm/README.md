# Nexus360 CRM Application

## Overview
The CRM (Customer Relationship Management) application is part of the Nexus360 platform, providing tools for managing customer relationships, deals, and products.

## Features

### Deal Management
- Deal Pipeline Board
- Stage-based Deal Tracking
- Deal Value and Probability Tracking
- Expected Close Date Tracking

### Product Catalog
- Product Listing
- Category Management
- Pricing Information
- Feature Tracking
- Status Management

## Structure

```
src/
├── components/
│   ├── DealBoard.tsx       # Deal pipeline management
│   └── ProductCatalog.tsx  # Product catalog management
├── styles/
│   └── globals.css        # Global styles
├── App.tsx               # Main application layout
└── main.tsx             # Application entry point
```

## Navigation

The CRM application includes the following main sections:
- Dashboard: Overview of key metrics
- Deals: Pipeline view of all deals
- Products: Product catalog management
- Customers: Customer management
- Settings: Application settings

## Development

### Running the Application
```bash
cd apps/crm
pnpm install
pnpm run dev
```

The application will be available at `http://localhost:3010`

### Dependencies
- React
- React Router DOM
- Ant Design
- @ant-design/icons
- @ant-design/cssinjs

## Integration

The CRM app integrates with:
- Authentication Service: For user authentication
- Platform Services: For shared functionality
- Frontend: As a micro-frontend application
