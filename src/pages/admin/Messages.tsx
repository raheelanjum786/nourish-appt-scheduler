
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock data
const conversationsData = [
  {
    id: 1,
    user: "Emma Thompson",
    email: "emma.t@example.com",
    lastMessage: "Thank you for your time. I'll see you at our next appointment.",
    time: "11:30 AM",
    unread: false,
    messages: [
      { sender: "user", content: "Hello, I'd like to discuss my anxiety issues before our appointment tomorrow.", time: "10:15 AM" },
      { sender: "admin", content: "Of course, Emma. What specific concerns do you have about your anxiety?", time: "10:20 AM" },
      { sender: "user", content: "I've been having trouble sleeping and it's affecting my work.", time: "10:25 AM" },
      { sender: "admin", content: "I understand. We'll address that in detail during our session. In the meantime, try the breathing exercise we discussed last time.", time: "10:28 AM" },
      { sender: "user", content: "Thank you for your time. I'll see you at our next appointment.", time: "11:30 AM" },
    ]
  },
  {
    id: 2,
    user: "Michael Chen",
    email: "michael.c@example.com",
    lastMessage: "Is it possible to reschedule my appointment for next week?",
    time: "Yesterday",
    unread: true,
    messages: [
      { sender: "user", content: "Hello, I was wondering if you have any resources on stress management.", time: "Yesterday, 2:15 PM" },
      { sender: "admin", content: "Hi Michael, yes I do. I'll share some PDFs with you shortly.", time: "Yesterday, 2:20 PM" },
      { sender: "user", content: "Thank you! Also, is it possible to reschedule my appointment for next week?", time: "Yesterday, 2:45 PM" },
    ]
  },
  {
    id: 3,
    user: "Sophia Williams",
    email: "sophia.w@example.com",
    lastMessage: "The techniques you suggested are really helping with my sleep issues.",
    time: "Yesterday",
    unread: false,
    messages: [
      { sender: "user", content: "I wanted to give you an update on my progress.", time: "Yesterday, 9:05 AM" },
      { sender: "admin", content: "Hi Sophia, I'd love to hear how things are going.", time: "Yesterday, 9:10 AM" },
      { sender: "user", content: "The techniques you suggested are really helping with my sleep issues.", time: "Yesterday, 9:15 AM" },
    ]
  },
  {
    id: 4,
    user: "James Johnson",
    email: "james.j@example.com",
    lastMessage: "I've attached my journal entries as you requested.",
    time: "2 days ago",
    unread: false,
    messages: [
      { sender: "admin", content: "James, how has your journaling exercise been going?", time: "2 days ago, 1:00 PM" },
      { sender: "user", content: "It's been challenging but insightful. I've noticed some patterns in my thinking.", time: "2 days ago, 1:30 PM" },
      { sender: "admin", content: "That's excellent progress. Would you be comfortable sharing some entries before our next session?", time: "2 days ago, 1:45 PM" },
      { sender: "user", content: "I've attached my journal entries as you requested.", time: "2 days ago, 2:15 PM" },
    ]
  },
  {
    id: 5,
    user: "Olivia Brown",
    email: "olivia.b@example.com",
    lastMessage: "I'll need to cancel tomorrow's appointment due to a family emergency.",
    time: "3 days ago",
    unread: true,
    messages: [
      { sender: "user", content: "Hello, I hope you're doing well.", time: "3 days ago, 11:20 AM" },
      { sender: "admin", content: "Hi Olivia, I am, thank you. How can I help you today?", time: "3 days ago, 11:25 AM" },
      { sender: "user", content: "I'll need to cancel tomorrow's appointment due to a family emergency.", time: "3 days ago, 11:30 AM" },
    ]
  }
];

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState("all");

  // Filter conversations based on search term and active tab
  const filteredConversations = conversationsData.filter(conversation => {
    const matchesSearch = 
      conversation.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      conversation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && conversation.unread;
    
    return matchesSearch;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    toast({
      title: "Message Sent",
      description: `Your message to ${selectedConversation.user} has been sent`,
    });

    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-2">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-auto h-[calc(100vh-310px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/20 ${
                  selectedConversation?.id === conversation.id ? 'bg-muted/30' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium flex items-center">
                    {conversation.user}
                    {conversation.unread && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{conversation.time}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{conversation.email}</div>
                <div className="text-sm mt-1 truncate">{conversation.lastMessage}</div>
              </div>
            ))}

            {filteredConversations.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 border rounded-lg overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b bg-muted/20">
                <div className="font-medium">{selectedConversation.user}</div>
                <div className="text-sm text-muted-foreground">{selectedConversation.email}</div>
              </div>

              <div className="overflow-auto h-[calc(100vh-330px)] p-4 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'admin' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">{message.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t bg-muted/10">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <Button type="submit" size="icon" className="mt-auto">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
