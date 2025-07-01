import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneCall } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useChat } from "@/context/ChatContext";

interface CallInterfaceProps {
  userName: string;
  remoteUserName: string;
  callType: "video" | "voice";
  onEndCall: () => void;
  appointmentId?: string;
}

const CallInterface = ({
  userName,
  remoteUserName,
  callType,
  onEndCall,
  appointmentId,
}: CallInterfaceProps) => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const { endCall: endCallApi, sendIceCandidate } = useChat();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // In a real app, we would use WebRTC or a service like Twilio/Agora
  useEffect(() => {
    // Setup WebRTC connection
    const setupMediaStream = async () => {
      try {
        // Only request video if this is a video call
        const constraints = {
          audio: true,
          video: callType === "video",
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Display local stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Setup peer connection
        if (appointmentId) {
          const peerConnection = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              // Add your TURN servers here if needed
            ],
          });

          peerConnectionRef.current = peerConnection;

          // Add local stream to peer connection
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          // Handle ICE candidates
          peerConnection.onicecandidate = async (event) => {
            if (event.candidate && appointmentId) {
              try {
                await sendIceCandidate(appointmentId, event.candidate);
              } catch (error) {
                console.error("Error sending ICE candidate:", error);
              }
            }
          };

          // Handle remote stream
          peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };
        } else {
          // For demo purposes without appointmentId, we'll just mirror the local stream
          setTimeout(() => {
            toast({
              title: "Connected",
              description: `You are now connected with ${remoteUserName}`,
            });

            if (callType === "video" && remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          }, 1000);
        }

        return () => {
          // Clean up the media stream when component unmounts
          stream.getTracks().forEach((track) => track.stop());
          if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
          }
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast({
          title: "Error",
          description: "Could not access camera or microphone",
          variant: "destructive",
        });
        onEndCall();
      }
    };

    setupMediaStream();
  }, [callType, onEndCall, remoteUserName, appointmentId, sendIceCandidate]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted; // Toggle the current state
      });
    }

    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted
        ? "Others can now hear you"
        : "Others cannot hear you",
    });
  };

  const toggleVideo = () => {
    setIsVideoOff((prev) => !prev);

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff; // Toggle the current state
      });
    }

    toast({
      title: isVideoOff ? "Video Turned On" : "Video Turned Off",
      description: isVideoOff
        ? "Others can now see you"
        : "Others cannot see you",
    });
  };

  const handleEndCall = async () => {
    setIsCallActive(false);

    // Stop all tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((track) => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // End call via API if appointmentId is provided
    if (appointmentId) {
      try {
        await endCallApi(appointmentId);
      } catch (error) {
        console.error("Error ending call via API:", error);
      }
    }

    toast({
      title: "Call Ended",
      description: `Your call with ${remoteUserName} has ended`,
    });

    onEndCall();
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <div className="bg-nutrition-primary p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-medium">Call with {remoteUserName}</h3>
          <p className="text-xs text-white/80">
            {callType === "video" ? "Video Call" : "Voice Call"}
          </p>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-900">
        {callType === "video" && (
          <>
            {/* Remote video (full screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${
                isVideoOff ? "hidden" : ""
              }`}
            />

            {/* Local video (picture-in-picture) */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute bottom-4 right-4 w-1/4 h-auto object-cover rounded-lg border-2 border-white ${
                isVideoOff ? "hidden" : ""
              }`}
            />
          </>
        )}

        {/* For voice calls or when video is off */}
        {(callType === "voice" || isVideoOff) && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-nutrition-primary flex items-center justify-center text-white text-3xl mb-4">
                {remoteUserName.charAt(0).toUpperCase()}
              </div>
              <p className="text-white text-xl">{remoteUserName}</p>
              <p className="text-white/70">
                {callType === "voice"
                  ? "Voice Call"
                  : "Video Call (Camera Off)"}
              </p>
              {callType === "voice" && (
                <div className="mt-4 flex justify-center items-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-4 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${
            isMuted ? "bg-red-500 text-white" : "bg-white"
          }`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        {callType === "video" && (
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${
              isVideoOff ? "bg-red-500 text-white" : "bg-white"
            }`}
            onClick={toggleVideo}
          >
            {isVideoOff ? (
              <VideoOff className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
          </Button>
        )}

        <Button
          variant="destructive"
          size="icon"
          className="rounded-full bg-red-500 hover:bg-red-600"
          onClick={handleEndCall}
        >
          <PhoneCall className="h-5 w-5 rotate-135" />
        </Button>
      </div>
    </div>
  );
};

export default CallInterface;
