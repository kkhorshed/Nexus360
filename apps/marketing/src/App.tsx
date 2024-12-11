import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface CampaignData {
    name: string;
    status: string;
    budget: number;
    spent: number;
    leads: number;
    conversion: number;
}

const App: React.FC = () => {
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
            <PageWrapper
                title="Nexus360 Marketing"
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
        </Router>
    );
};

export default App;
