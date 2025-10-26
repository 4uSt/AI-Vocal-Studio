import { AIChat } from '../AIChat';

export default function AIChatExample() {
  const initialMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I\'m your AI mixing assistant. Upload a vocal recording and I\'ll help you build the perfect processing chain.',
      timestamp: new Date()
    }
  ];

  return (
    <div className="h-[600px]">
      <AIChat initialMessages={initialMessages} />
    </div>
  );
}
