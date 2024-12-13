import React, { createContext, useContext } from 'react';
import { message } from 'antd';

interface MessageContextType {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
    info: (content: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const value: MessageContextType = {
        success: (content) => messageApi.success(content),
        error: (content) => messageApi.error(content),
        warning: (content) => messageApi.warning(content),
        info: (content) => messageApi.info(content),
    };

    return (
        <MessageContext.Provider value={value}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};
