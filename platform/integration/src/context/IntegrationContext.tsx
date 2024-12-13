import React, { createContext, useContext, useState, useCallback } from 'react';

interface IntegrationStatus {
    isConnected: boolean;
    lastSync?: Date;
    error?: string;
}

interface IntegrationContextType {
    status: Record<string, IntegrationStatus>;
    connect: (service: string) => Promise<void>;
    disconnect: (service: string) => Promise<void>;
    sync: (service: string) => Promise<void>;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

interface IntegrationProviderProps {
    children: React.ReactNode;
}

export const IntegrationProvider: React.FC<IntegrationProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<Record<string, IntegrationStatus>>({
        hubspot: { isConnected: false },
        salesforce: { isConnected: false },
        zendesk: { isConnected: false }
    });

    const connect = useCallback(async (service: string) => {
        // In development, simulate connection
        if (process.env.NODE_ENV === 'development') {
            setStatus(prev => ({
                ...prev,
                [service]: {
                    isConnected: true,
                    lastSync: new Date()
                }
            }));
        }
        // In production, this would call the integration service
    }, []);

    const disconnect = useCallback(async (service: string) => {
        setStatus(prev => ({
            ...prev,
            [service]: {
                isConnected: false
            }
        }));
    }, []);

    const sync = useCallback(async (service: string) => {
        try {
            // In development, simulate sync
            if (process.env.NODE_ENV === 'development') {
                setStatus(prev => ({
                    ...prev,
                    [service]: {
                        ...prev[service],
                        lastSync: new Date()
                    }
                }));
            }
            // In production, this would call the integration service
        } catch (error) {
            setStatus(prev => ({
                ...prev,
                [service]: {
                    ...prev[service],
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            }));
        }
    }, []);

    const value = {
        status,
        connect,
        disconnect,
        sync
    };

    return (
        <IntegrationContext.Provider value={value}>
            {children}
        </IntegrationContext.Provider>
    );
};

export const useIntegration = () => {
    const context = useContext(IntegrationContext);
    if (context === undefined) {
        throw new Error('useIntegration must be used within an IntegrationProvider');
    }
    return context;
};

export default IntegrationContext;
