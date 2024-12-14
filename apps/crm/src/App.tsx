import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import Companies from './features/companies/Companies';
import Contacts from './features/contacts/Contacts';
import Products from './features/products/Products';
import Leads from './features/leads/Leads';
import Opportunities from './features/opportunities/Opportunities';
import Reports from './features/reports/Reports';
import UserManagement from './features/settings/components/UserManagement';
import TeamManagement from './features/settings/components/TeamManagement';
import Security from './features/settings/components/Security';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings/users" element={<UserManagement />} />
        <Route path="/settings/teams" element={<TeamManagement />} />
        <Route path="/settings/security" element={<Security />} />
      </Route>
    </Routes>
  );
}
