
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, PhoneCall, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CallInterface from "./CallInterface";

interface ChatInterfaceProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: Date;
}

const ChatInterface = ({ userName, userEmail, isAdmin = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "doctor",
      text: `Hello ${userName}! Thank you for booking an appointment. This is your chat interface where we can communicate before and after your appointment. Feel free to ask any questions you may have.`,
      timestamp: new Date(),
    },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [activeCall, setActiveCall] = useState<"video" | "voice" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message with correct typing
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: isAdmin ? "doctor" : "user",
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: isAdmin ? "user" : "doctor",
        text: "Thank you for your message. I'll get back to you soon.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startVideoCall = () => {
    setActiveCall("video");
    toast({
      title: "Starting Video Call",
      description: "Connecting to video call...",
    });
  };

  const startVoiceCall = () => {
    setActiveCall("voice");
    toast({
      title: "Starting Voice Call",
      description: "Connecting to voice call...",
    });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  // Handle active call
  if (activeCall) {
    return (
      <CallInterface 
        userName={userName}
        remoteUserName={isAdmin ? userName : "Dr. Sarah Johnson"} 
        callType={activeCall} 
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-nutrition-primary p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-medium">{isAdmin ? userName : "Dr. Sarah Johnson"}</h3>
          <p className="text-xs text-white/80">{isAdmin ? userEmail : "Dietitian & Nutritionist"}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={startVoiceCall}
          >
            <PhoneCall className="h-5 w-5" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={startVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender === (isAdmin ? "doctor" : "user") ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === (isAdmin ? "doctor" : "user")
                  ? "bg-nutrition-primary text-white"
                  : "bg-white border"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === (isAdmin ? "doctor" : "user") ? "text-white/70" : "text-gray-500"
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t bg-white flex">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2 bg-nutrition-primary hover:bg-nutrition-primary/90"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
