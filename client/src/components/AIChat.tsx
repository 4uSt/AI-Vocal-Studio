import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  initialMessages?: Message[];
}

export function AIChat({ initialMessages = [] }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'll analyze your vocal recording and suggest specific settings. Based on the sibilance detected around 6-8kHz, I recommend adding a de-esser targeting that frequency range.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);

    console.log('Message sent:', input);
  };

  const quickActions = [
    "Explain this chain",
    "Make it brighter",
    "Add more space",
    "Reduce sibilance"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">AI Mixing Assistant</span>
        <Badge variant="secondary" className="ml-auto text-xs">GPT-4</Badge>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-md p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-card-border'
                }`}
                data-testid={`message-${message.role}`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-card border border-card-border rounded-md p-3 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setInput(action);
                console.log('Quick action:', action);
              }}
              data-testid={`button-quick-${action.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {action}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about mixing techniques..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            data-testid="input-chat"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
