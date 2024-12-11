import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface ForecastData {
    product: string;
    currentSales: number;
    forecastedSales: number;
    growth: number;
    confidence: number;
}

const App: React.FC = () => {
    const columns: ColumnsType<ForecastData> = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            sorter: (a, b) => a.product.localeCompare(b.product)
        },
        {
            title: 'Current Sales',
            dataIndex: 'currentSales',
            key: 'currentSales',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.currentSales - b.currentSales
        },
        {
            title: 'Forecasted Sales',
            dataIndex: 'forecastedSales',
            key: 'forecastedSales',
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.forecastedSales - b.forecastedSales
        },
        {
            title: 'Growth',
            dataIndex: 'growth',
            key: 'growth',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.growth - b.growth
        },
        {
            title: 'Confidence',
            dataIndex: 'confidence',
            key: 'confidence',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.confidence - b.confidence
        }
    ];

    const forecastData: ForecastData[] = [
        {
            product: 'Product A',
            currentSales: 500000,
            forecastedSales: 600000,
            growth: 20,
            confidence: 85
        },
        {
            product: 'Product B',
            currentSales: 300000,
            forecastedSales: 390000,
            growth: 30,
            confidence: 78
        },
        {
            product: 'Product C',
            currentSales: 450000,
            forecastedSales: 495000,
            growth: 10,
            confidence: 92
        }
    ];

    return (
        <Router>
            <PageWrapper
                title="Nexus360 Forecasting"
                description="Sales Forecasting & Analysis"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <DataCard
                        title="Total Forecasted Sales"
                        value="$1.49M"
                        trend={{
                            value: 20,
                            direction: 'up'
                        }}
                        className="bg-white shadow-md rounded-lg p-4"
                    />
                    <DataCard
                        title="Average Growth"
                        value="20%"
                        trend={{
                            value: 5,
                            direction: 'up'
                        }}
                        className="bg-white shadow-md rounded-lg p-4"
                    />
                    <DataCard
                        title="Forecast Confidence"
                        value="85%"
                        trend={{
                            value: 3,
                            direction: 'up'
                        }}
                        className="bg-white shadow-md rounded-lg p-4"
                    />
                </div>

                <div className="p-4">
                    <DataTable<ForecastData>
                        data={forecastData}
                        columns={columns}
                        rowKey="product"
                        className="bg-white shadow-md rounded-lg"
                    />
                </div>
            </PageWrapper>
        </Router>
    );
};

export default App;
