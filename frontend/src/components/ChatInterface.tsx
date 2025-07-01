import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, PhoneCall, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CallInterface from "./CallInterface";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

interface ChatInterfaceProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
  appointmentId: string;
}

const ChatInterface = ({
  userName,
  userEmail,
  isAdmin = false,
  appointmentId,
}: ChatInterfaceProps) => {
  const { messages, isLoading, fetchMessages, sendMessage, initiateCall } =
    useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [activeCall, setActiveCall] = useState<"video" | "voice" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (appointmentId) {
      fetchMessages(appointmentId);
    }
  }, [appointmentId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(appointmentId, newMessage, "text");
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startVideoCall = async () => {
    try {
      await initiateCall(appointmentId, "video");
      setActiveCall("video");
      toast({
        title: "Starting Video Call",
        description: "Connecting to video call...",
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Could not start video call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startVoiceCall = async () => {
    try {
      await initiateCall(appointmentId, "voice");
      setActiveCall("voice");
      toast({
        title: "Starting Voice Call",
        description: "Connecting to voice call...",
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Could not start voice call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    setActiveCall(null);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        Loading messages...
      </div>
    );
  }

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
          <h3 className="font-medium">
            {isAdmin ? userName : "Dr. Sarah Johnson"}
          </h3>
          <p className="text-xs text-white/80">
            {isAdmin ? userEmail : "Dietitian & Nutritionist"}
          </p>
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
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-4 flex ${
                msg.sender._id === (isAdmin ? user?._id : user?._id)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender._id === (isAdmin ? user?._id : user?._id)
                    ? "bg-nutrition-primary text-white"
                    : "bg-white border"
                }`}
              >
                <p>{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender._id === (isAdmin ? user?._id : user?._id)
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
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
