
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, User, Bot } from 'lucide-react';
import { chatWithEmergencyAssistant, type EmergencyChatInput } from '@/ai/flows/emergency-chat-flow';
import type { BloodType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AiChatAssistantProps {
  currentBloodTypeFilter: BloodType | 'all';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function AiChatAssistant({ currentBloodTypeFilter }: AiChatAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      // Add a welcome message from AI when chat opens, if no messages yet
      if (messages.length === 0) {
        setMessages([{ 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: "Hello! I'm Lifeline's AI Emergency Assistant. How can I help you with blood needs or donation questions today?",
          timestamp: new Date()
        }]);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiInput: EmergencyChatInput = {
        message: userMessage.text,
        currentBloodTypeFilter: currentBloodTypeFilter,
      };
      const aiResponse = await chatWithEmergencyAssistant(aiInput);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I'm having trouble connecting right now. Please try again later or use the 'Request Blood Urgently' button for immediate alerts.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "AI Assistant Error",
        description: "Could not connect to the AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="fixed bottom-20 right-6 md:static md:bottom-auto md:right-auto shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        AI Emergency Helper
      </Button>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[450px] md:max-w-[600px] flex flex-col h-[70vh] max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="h-6 w-6 mr-2 text-primary" /> AI Emergency Assistant
            </DialogTitle>
            <DialogDescription>
              Ask for urgent blood needs or general donation questions.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow border rounded-md p-1 bg-muted/30" ref={scrollAreaRef}>
            <div className="p-3 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <AvatarIcon sender={msg.sender} />
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                 {msg.sender === 'user' && (
                  <AvatarIcon sender={msg.sender} />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-2">
                <AvatarIcon sender="ai" />
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI is typing...</span>
              </div>
            )}
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                aria-label="Chat message input"
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} aria-label="Send chat message">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AvatarIcon({sender}: {sender: 'user' | 'ai'}) {
  if (sender === 'ai') {
    return <Bot className="h-7 w-7 p-1 rounded-full bg-primary text-primary-foreground shadow"/>;
  }
  return <User className="h-7 w-7 p-1 rounded-full bg-secondary text-secondary-foreground shadow"/>;
}
