import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatInterface from "./ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

const ChatModal = ({
  isOpen,
  onClose,
  appointmentId,
  userName,
  userEmail,
  isAdmin = false,
}: ChatModalProps) => {
  const { user } = useAuth();
  const { fetchMessages } = useChat();

  // Use the authenticated user's info if not provided
  const displayName = userName || user?.name || "User";
  const displayEmail = userEmail || user?.email || "";

  // Fetch messages when the modal opens
  useState(() => {
    if (isOpen && appointmentId) {
      fetchMessages(appointmentId);
    }
  }, [isOpen, appointmentId, fetchMessages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[700px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userName={displayName}
            userEmail={displayEmail}
            isAdmin={isAdmin}
            appointmentId={appointmentId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
