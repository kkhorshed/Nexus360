import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import Companies from './features/companies/Companies';
import Contacts from './features/contacts/Contacts';
import Products from './features/products/Products';
import Leads from './features/leads/Leads';
import Opportunities from './features/opportunities/Opportunities';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import Tasks from './features/tasks/Tasks';
import AuditTrail from './features/audit/AuditTrail';

// Use the existing components from the CRM app
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="products" element={<Products />} />
        <Route path="leads" element={<Leads />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
