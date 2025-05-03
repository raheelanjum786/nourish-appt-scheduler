
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneCall } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CallInterfaceProps {
  userName: string;
  remoteUserName: string;
  callType: "video" | "voice";
  onEndCall: () => void;
}

const CallInterface = ({
  userName,
  remoteUserName,
  callType,
  onEndCall,
}: CallInterfaceProps) => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // In a real app, we would use WebRTC or a service like Twilio/Agora
  // This is a simplified demonstration version
  useEffect(() => {
    // Simulate getting user media
    const setupMediaStream = async () => {
      try {
        // Only request video if this is a video call
        const constraints = {
          audio: true,
          video: callType === "video"
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Display local stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // In a real app, we would connect to the remote peer here
        // For now, simulate a remote connection with a timeout
        setTimeout(() => {
          toast({
            title: "Connected",
            description: `You are now connected with ${remoteUserName}`,
          });
          
          // In a real app, we would receive the remote stream here
          // For demo purposes, we'll just mirror the local stream after a delay
          if (callType === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        }, 1000);
        
        return () => {
          // Clean up the media stream when component unmounts
          stream.getTracks().forEach(track => track.stop());
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
  }, [callType, onEndCall, remoteUserName]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    // In a real implementation, we would mute the actual audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // Toggle the current state
      });
    }
    
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you",
    });
  };

  const toggleVideo = () => {
    setIsVideoOff(prev => !prev);
    
    // In a real implementation, we would disable the actual video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff; // Toggle the current state
      });
    }
    
    toast({
      title: isVideoOff ? "Video Turned On" : "Video Turned Off",
      description: isVideoOff ? "Others can now see you" : "Others cannot see you",
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    
    // Stop all tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
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
          <p className="text-xs text-white/80">{callType === "video" ? "Video Call" : "Voice Call"}</p>
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
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            
            {/* Local video (picture-in-picture) */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute bottom-4 right-4 w-1/4 h-auto object-cover rounded-lg border-2 border-white ${isVideoOff ? 'hidden' : ''}`}
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
                {callType === "voice" ? "Voice Call" : "Video Call (Camera Off)"}
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
      
      {/* Call controls */}
      <div className="bg-white p-4 flex justify-center space-x-4">
        {callType === "video" && (
          <Button
            onClick={toggleVideo}
            size="icon"
            variant={isVideoOff ? "destructive" : "outline"}
            className="rounded-full h-12 w-12"
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
        )}
        
        <Button
          onClick={toggleMute}
          size="icon"
          variant={isMuted ? "destructive" : "outline"}
          className="rounded-full h-12 w-12"
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        
        <Button
          onClick={handleEndCall}
          size="icon"
          variant="destructive"
          className="rounded-full h-12 w-12"
        >
          <PhoneCall className="transform rotate-135" />
        </Button>
      </div>
    </div>
  );
};

export default CallInterface;
