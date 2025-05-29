import { useState, useEffect, useRef } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Video, Phone, PhoneOff, VideoOff } from "lucide-react";
import api from "@/services/api";

const AdminChatPage = () => {
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "in-call">(
    "idle"
  );
  const [callType, setCallType] = useState<"video" | "voice" | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const { appointments } = useAppointments();

  const getTurnConfig = async () => {
    try {
      const response = await api.get("/api/webrtc/turn-config");
      return {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          ...response.data.iceServers,
        ],
      };
    } catch (error) {
      console.error("Failed to get TURN config:", error);
      return {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
    }
  };

  // Initialize peer connection
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add your TURN server credentials here if needed
      ],
    });
    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        api.chat.sendIceCandidate(activeChat?._id, {
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return () => {
      pc.close();
    };
  }, []);

  // Handle incoming messages and calls
  useEffect(() => {
    if (!activeChat) return;

    const socket = new WebSocket(
      `ws://localhost:3001?appointmentId=${activeChat._id}&userId=admin`
    );

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        await handleOffer(data.offer);
      } else if (data.type === "answer") {
        await handleAnswer(data.answer);
      } else if (data.type === "ice-candidate") {
        await handleIceCandidate(data.candidate);
      } else if (data.type === "call-initiated") {
        setCallStatus("calling");
        setCallType(data.callType);
      } else if (data.type === "call-accepted") {
        setCallStatus("in-call");
      } else if (data.type === "call-ended") {
        endCall();
      }
    };

    return () => {
      socket.close();
    };
  }, [activeChat]);

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    api.chat.sendAnswer(activeChat._id, { answer });
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnection.current) return;
    await peerConnection.current.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };

  const [callState, setCallState] = useState<{
    status: "idle" | "calling" | "ringing" | "in-call" | "ended";
    type?: "video" | "voice";
    error?: string;
  }>({ status: "idle" });

  // Update call status handling
  const startCall = async (type: "video" | "voice") => {
    setCallState({ status: "calling", type });
    try {
      // Get local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Create offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      api.chat.initiateCall(activeChat._id, {
        callType: type,
        offer,
      });
    } catch (error) {
      setCallState({
        status: "ended",
        type,
        error: "Failed to start call. Please try again.",
      });
      setTimeout(() => setCallState({ status: "idle" }), 3000);
    }
  };

  // Add to render method
  {
    callState.error && (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
        {callState.error}
      </div>
    );
  }

  {
    callState.status === "calling" && (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Calling...
      </div>
    );
  }
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        sender.track?.stop();
      });
    }

    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setCallStatus("idle");
    setCallType(null);
    api.chat.endCall(activeChat._id);
  };

  const acceptCall = async () => {
    if (!peerConnection.current || !callType) return;
    setCallStatus("in-call");

    // Get local stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // Add tracks to peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat]);

  const fetchMessages = async (appointmentId: string) => {
    try {
      const response = await api.chat.getMessages(appointmentId);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const response = await api.chat.sendMessage(activeChat._id, {
        message: newMessage,
        type: "text",
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const initiateCall = async (callType: "video" | "voice") => {
    if (!activeChat) return;

    try {
      await api.chat.initiateCall(activeChat._id, { callType });
      alert(`Initiating ${callType} call with ${activeChat.user.name}`);
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat with Clients</h1>

      {/* Call UI */}
      {(callStatus === "calling" || callStatus === "in-call") && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            {callType === "video" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-64 bg-gray-800 rounded"
                />
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-full h-64 bg-gray-800 rounded"
                />
              </div>
            )}

            <div className="flex justify-center gap-4">
              {callStatus === "calling" && (
                <Button
                  onClick={acceptCall}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Accept Call
                </Button>
              )}
              <Button onClick={endCall} className="bg-red-500 hover:bg-red-600">
                {callType === "video" ? (
                  <VideoOff className="h-5 w-5" />
                ) : (
                  <PhoneOff className="h-5 w-5" />
                )}
                End Call
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the chat UI remains the same */}
      <div className="flex gap-6">
        <div className="w-1/3 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Active Appointments</h2>
          <div className="space-y-2">
            {appointments
              .filter((appt) => appt.status === "confirmed")
              .map((appt) => (
                <div
                  key={appt._id}
                  className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                    activeChat?._id === appt._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setActiveChat(appt)}
                >
                  <p className="font-medium">{appt.user.name}</p>
                  <p className="text-sm text-gray-600">{appt.service.name}</p>
                </div>
              ))}
          </div>
        </div>

        {activeChat && (
          <div className="flex-1 border rounded-lg p-4 flex flex-col h-[70vh]">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">{activeChat.user.name}</h2>
              <p className="text-sm text-gray-600">{activeChat.service.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 rounded ${
                    msg.sender._id === activeChat.user._id
                      ? "bg-gray-100"
                      : "bg-blue-100 ml-auto"
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
