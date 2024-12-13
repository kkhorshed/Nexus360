import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout, PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface User {
    name?: string;
    email?: string;
    avatar?: string;
}

interface SalesRecord {
    employee: string;
    sales: number;
    quota: number;
    achievement: number;
    commission: number;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const menuItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Performance', path: '/performance' },
        { name: 'Commission', path: '/commission' },
        { name: 'Reports', path: '/reports' },
        { name: 'Settings', path: '/settings' }
    ];

    useEffect(() => {
        // Check if we have auth token in URL params (redirected from auth service)
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('token');
        const userParam = urlParams.get('user');

        if (!authToken && !userParam) {
            window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
            return;
        }

        if (userParam) {
            try {
                const userData = JSON.parse(userParam);
                setUser({
                    name: userData.displayName,
                    email: userData.userPrincipalName,
                    avatar: userData.avatar
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear auth token and user data
        window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
    };

    const columns: ColumnsType<SalesRecord> = [
        {
            title: 'Employee',
            dataIndex: 'employee',
            key: 'employee',
            sorter: (a, b) => a.employee.localeCompare(b.employee)
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.sales - b.sales
        },
        {
            title: 'Quota',
            dataIndex: 'quota',
            key: 'quota',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.quota - b.quota
        },
        {
            title: 'Achievement',
            dataIndex: 'achievement',
            key: 'achievement',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.achievement - b.achievement
        },
        {
            title: 'Commission',
            dataIndex: 'commission',
            key: 'commission',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.commission - b.commission
        }
    ];

    const salesData: SalesRecord[] = [
        {
            employee: 'John Smith',
            sales: 250000,
            quota: 200000,
            achievement: 125,
            commission: 25000
        },
        {
            employee: 'Sarah Johnson',
            sales: 180000,
            quota: 200000,
            achievement: 90,
            commission: 15000
        },
        {
            employee: 'Michael Brown',
            sales: 300000,
            quota: 250000,
            achievement: 120,
            commission: 30000
        }
    ];

    return (
        <Router>
            <AppLayout
                appName="Sales Compensation"
                menuItems={menuItems}
                user={user || undefined}
                onLogout={handleLogout}
            >
                <PageWrapper
                    title="Dashboard"
                    description="Sales Performance & Commission Tracking"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                        <DataCard
                            title="Total Sales"
                            value="$730K"
                            trend={{
                                value: 18,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="Average Achievement"
                            value="112%"
                            trend={{
                                value: 5,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="Total Commission"
                            value="$70K"
                            trend={{
                                value: 12,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                    </div>

                    <div className="p-4">
                        <DataTable<SalesRecord>
                            data={salesData}
                            columns={columns}
                            rowKey="employee"
                            className="bg-white shadow-md rounded-lg"
                        />
                    </div>
                </PageWrapper>
            </AppLayout>
        </Router>
    );
};

export default App;
