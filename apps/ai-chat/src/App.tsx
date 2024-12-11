import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageWrapper, DataCard } from '@nexus360/ui';

const App: React.FC = () => {
    const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [inputValue, setInputValue] = React.useState('');

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'This is a simulated AI response. The actual AI integration will be implemented later.'
            }]);
        }, 1000);
        setInputValue('');
    };

    return (
        <Router>
            <PageWrapper
                title="Nexus360 AI Chat"
                description="Intelligent Conversational Interface"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <div className="md:col-span-2">
                        <div className="bg-white shadow-md rounded-lg p-4 h-[600px] flex flex-col">
                            <div className="flex-1 overflow-y-auto mb-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 p-3 rounded-lg ${
                                            message.role === 'user'
                                                ? 'bg-blue-100 ml-auto max-w-[80%]'
                                                : 'bg-gray-100 mr-auto max-w-[80%]'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <DataCard
                            title="Messages Today"
                            value="127"
                            trend={{
                                value: 23,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="Response Time"
                            value="1.2s"
                            trend={{
                                value: 15,
                                direction: 'down'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                        <DataCard
                            title="User Satisfaction"
                            value="94%"
                            trend={{
                                value: 5,
                                direction: 'up'
                            }}
                            className="bg-white shadow-md rounded-lg p-4"
                        />
                    </div>
                </div>
            </PageWrapper>
        </Router>
    );
};

export default App;
