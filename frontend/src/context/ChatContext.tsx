import React, { createContext, useContext, useState, useEffect } from "react";
import { chat as chatApi } from "@/services/api";
import { useAuth } from "./AuthContext";

interface Message {
  _id: string;
  appointmentId: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  message: string;
  type: "text" | "image" | "file";
  timestamp: Date;
  read: boolean;
}

interface CallData {
  appointmentId: string;
  callType: "video" | "voice";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  status: "initiating" | "ringing" | "connected" | "ended";
}

interface ChatContextType {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  activeCall: CallData | null;
  fetchMessages: (appointmentId: string) => Promise<void>;
  sendMessage: (
    appointmentId: string,
    message: string,
    type: string
  ) => Promise<void>;
  initiateCall: (
    appointmentId: string,
    callType: "video" | "voice",
    offer?: RTCSessionDescriptionInit
  ) => Promise<void>;
  sendAnswer: (
    appointmentId: string,
    answer: RTCSessionDescriptionInit
  ) => Promise<void>;
  sendIceCandidate: (
    appointmentId: string,
    candidate: RTCIceCandidateInit
  ) => Promise<void>;
  endCall: (appointmentId: string) => Promise<void>;
  getUnreadMessageCount: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<CallData | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch unread message count on mount and when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      getUnreadMessageCount();
    }
  }, [isAuthenticated]);

  const fetchMessages = async (appointmentId: string) => {
    if (!isAuthenticated || !appointmentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.getMessages(appointmentId);
      setMessages(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    appointmentId: string,
    message: string,
    type: string = "text"
  ) => {
    if (!isAuthenticated || !appointmentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.sendMessage(appointmentId, {
        message,
        type,
      });
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      console.error("Error sending message:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateCall = async (
    appointmentId: string,
    callType: "video" | "voice",
    offer?: RTCSessionDescriptionInit
  ) => {
    if (!isAuthenticated || !appointmentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.initiateCall(appointmentId, {
        callType,
        offer,
      });
      setActiveCall({
        appointmentId,
        callType,
        offer,
        status: "initiating",
      });
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to initiate call");
      console.error("Error initiating call:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendAnswer = async (
    appointmentId: string,
    answer: RTCSessionDescriptionInit
  ) => {
    if (!isAuthenticated || !appointmentId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.sendAnswer(appointmentId, { answer });
      setActiveCall((prev) =>
        prev ? { ...prev, answer, status: "connected" } : null
      );
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to send answer");
      console.error("Error sending answer:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendIceCandidate = async (
    appointmentId: string,
    candidate: RTCIceCandidateInit
  ) => {
    if (!isAuthenticated || !appointmentId) return;

    try {
      return await chatApi.sendIceCandidate(appointmentId, { candidate });
    } catch (err: any) {
      console.error("Error sending ICE candidate:", err);
      throw err;
    }
  };

  const endCall = async (appointmentId: string) => {
    if (!isAuthenticated || !appointmentId) return;

    try {
      const response = await chatApi.endCall(appointmentId);
      setActiveCall(null);
      return response;
    } catch (err: any) {
      console.error("Error ending call:", err);
      throw err;
    }
  };

  const getUnreadMessageCount = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await chatApi.getUnreadMessageCount();
      setUnreadCount(response.count);
    } catch (err: any) {
      console.error("Error getting unread message count:", err);
    }
  };

  const value = {
    messages,
    unreadCount,
    isLoading,
    error,
    activeCall,
    fetchMessages,
    sendMessage,
    initiateCall,
    sendAnswer,
    sendIceCandidate,
    endCall,
    getUnreadMessageCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
