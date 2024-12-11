import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface SalesRecord {
    employee: string;
    sales: number;
    quota: number;
    achievement: number;
    commission: number;
}

const App: React.FC = () => {
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
            <PageWrapper
                title="Nexus360 Sales Compensation"
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
        </Router>
    );
};

export default App;
