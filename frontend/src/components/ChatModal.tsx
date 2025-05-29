import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Video, Phone, X } from "lucide-react";
import api from "@/services/api";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

const ChatModal = ({ isOpen, onClose, appointmentId }: ChatModalProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "active"
  >("idle");
  const [callType, setCallType] = useState<"video" | "voice" | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (appointmentId) {
      fetchMessages();
    }
  }, [appointmentId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await api.chat.getMessages(appointmentId);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await api.chat.sendMessage(appointmentId, {
        message: newMessage,
        type: "text",
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setCallStatus("idle");
    setCallType(null);
  };

  const initiateCall = async (type: "video" | "voice") => {
    try {
      setCallStatus("connecting");
      setCallType(type);

      const response = await api.chat.initiateCall(appointmentId, {
        callType: type,
      });
      const { offer, iceCandidates } = response.data;

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          // Add your TURN servers here if needed
        ],
      });
      peerConnectionRef.current = peerConnection;

      // Set up local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      setLocalStream(stream);

      // Add local stream to connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Set remote description
      await peerConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer back to server
      await api.chat.sendAnswer(appointmentId, answer);

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          api.chat.sendIceCandidate(appointmentId, event.candidate);
        }
      };

      // Add received ICE candidates
      iceCandidates.forEach((candidate: RTCIceCandidateInit) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setCallStatus("active");
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "disconnected") {
          cleanupCall();
        }
      };
    } catch (error) {
      console.error("Error initiating call:", error);
      cleanupCall();
    }
  };

  const endCall = () => {
    cleanupCall();
    api.chat.endCall(appointmentId);
  };

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          cleanupCall();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>

        {/* Call UI */}
        {callStatus !== "idle" && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">
                {callType === "video" ? "Video Call" : "Voice Call"} -{" "}
                {callStatus}
              </div>
              <Button variant="destructive" onClick={endCall}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {callType === "video" && (
              <div className="flex-1 relative">
                {/* Remote video */}
                {remoteStream && (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}

                {/* Local video preview */}
                {localStream && (
                  <div className="absolute bottom-4 right-4 w-1/4 h-1/4">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover rounded-lg border-2 border-white"
                    />
                  </div>
                )}
              </div>
            )}

            {callType === "voice" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-2xl font-medium">
                  {callStatus === "connecting"
                    ? "Connecting..."
                    : "Call in progress"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat UI */}
        {callStatus === "idle" && (
          <>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 rounded ${
                    msg.sender._id === user._id
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100 mr-auto"
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => initiateCall("voice")}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => initiateCall("video")}>
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
