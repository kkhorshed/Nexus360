import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout, PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface User {
    name?: string;
    email?: string;
    avatar?: string;
}

interface CampaignData {
    name: string;
    status: string;
    budget: number;
    spent: number;
    leads: number;
    conversion: number;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const menuItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Audience', path: '/audience' },
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

    const columns: ColumnsType<CampaignData> = [
        {
            title: 'Campaign Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-full text-sm ${
                    status === 'Active' ? 'bg-green-100 text-green-800' :
                    status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {status}
                </span>
            )
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.budget - b.budget
        },
        {
            title: 'Spent',
            dataIndex: 'spent',
            key: 'spent',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.spent - b.spent
        },
        {
            title: 'Leads',
            dataIndex: 'leads',
            key: 'leads',
            render: (value) => value.toLocaleString(),
            sorter: (a, b) => a.leads - b.leads
        },
        {
            title: 'Conversion Rate',
            dataIndex: 'conversion',
            key: 'conversion',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.conversion - b.conversion
        }
    ];

    const campaignData: CampaignData[] = [
        {
            name: 'Summer Sale 2024',
            status: 'Active',
            budget: 50000,
            spent: 35000,
            leads: 2500,
            conversion: 3.5
        },
        {
            name: 'Product Launch',
            status: 'Active',
            budget: 75000,
            spent: 25000,
            leads: 1800,
            conversion: 4.2
        },
        {
            name: 'Brand Awareness',
            status: 'Paused',
            budget: 30000,
            spent: 28000,
            leads: 1200,
            conversion: 2.8
        }
    ];

    return (
        <Router>
            <AppLayout
                appName="Marketing"
                menuItems={menuItems}
                user={user || undefined}
                onLogout={handleLogout}
            >
                <PageWrapper
                    title="Dashboard"
                    description="Campaign Management & Analytics"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                        <DataCard
                            title="Total Budget"
                            value="$155K"
                            trend={{
                                value: 15,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="Total Leads"
                            value="5,500"
                            trend={{
                                value: 25,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="Avg. Conversion"
                            value="3.5%"
                            trend={{
                                value: 8,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                    </div>

                    <div className="p-4">
                        <DataTable<CampaignData>
                            data={campaignData}
                            columns={columns}
                            rowKey="name"
                            className="bg-white shadow-md rounded-lg"
                        />
                    </div>
                </PageWrapper>
            </AppLayout>
        </Router>
    );
};

export default App;
