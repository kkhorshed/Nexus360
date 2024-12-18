import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface MessageContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

interface MessageState {
  open: boolean;
  message: string;
  severity: AlertColor;
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
  const [messageState, setMessageState] = useState<MessageState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleClose = () => {
    setMessageState(prev => ({ ...prev, open: false }));
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setMessageState({
      open: true,
      message,
      severity
    });
  };

  const value: MessageContextType = {
    success: (message: string) => showMessage(message, 'success'),
    error: (message: string) => showMessage(message, 'error'),
    info: (message: string) => showMessage(message, 'info'),
    warning: (message: string) => showMessage(message, 'warning')
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <Snackbar
        open={messageState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={messageState.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {messageState.message}
        </Alert>
      </Snackbar>
    </MessageContext.Provider>
  );
};

export default MessageContext;
