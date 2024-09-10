
import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/peer";
import Video from "./Video";
import { useNavigate } from "react-router-dom";

function VideoChat() {
  const socket = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns } = usePeer();
  const [remoteStream, setRemoteStream] = useState(null);
  const [fromUserId, setFromUserId] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const navigate = useNavigate()
  // Get the local media stream
  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log("Local stream set", stream);
      setLocalStream(stream);
    } catch (error) {
      console.error("Error getting local stream:", error);
    }
  }, []);

  useEffect(() => {
    getLocalStream();
  }, [getLocalStream]);

  // Handle new user joining
  const handleNewUserJoined = useCallback(async (data) => {
    console.log('User joined', data.userId);
    setFromUserId(data.userId);
    const offer = await createOffer();
    socket.emit('call-user', { userId: data.userId, offer });
    console.log("Call success");
  }, [createOffer, socket]);

  // Share streams (add tracks to the peer connection)
  useEffect(() => {
    if (localStream && peer) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }
  }, [localStream, peer]);

  // Listen for remote stream
  useEffect(() => {
    if (peer) {
      peer.addEventListener('track', (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        console.log("Received remote stream", remoteStream);
      });
    }
    return () => {
      peer.removeEventListener('track', () => {});
    };
  }, [peer]);

  // Handle incoming call
  const handleIncomingCall = useCallback(async (data) => {
    console.log("Incoming call", data);
    const answer = await createAnswer(data.offer);
    socket.emit('send-answer', { userId: data.from, answer });
    console.log("Answer sent");
  }, [socket, createAnswer]);

  // Handle the answer from the remote user
  const handleAnswerFromUser = useCallback(async (data) => {
    console.log("Answer from user");
    setRemoteAns(data.answer);
  }, [setRemoteAns]);

  // Handle negotiation needed
  const handleNegotiationNeeded = useCallback(async () => {
    console.log("Negotiation needed");
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit('call-user', { userId: fromUserId, offer });
  }, [peer, fromUserId, socket]);
  const handleUserDisconnect = useCallback(async () => {
    console.log("Disconnected");
    navigate(`/`)
  }, [navigate]);

  // Set up socket listeners and peer event listeners
  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined);
    socket.on('incoming-call', handleIncomingCall);
    socket.on('answer-from-user', handleAnswerFromUser);
    socket.on('user-disconnect', handleUserDisconnect);
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      socket.off('user-joined', handleNewUserJoined);
      socket.off('incoming-call', handleIncomingCall);
      socket.off('answer-from-user', handleAnswerFromUser);
      socket.off('user-disconnect', handleUserDisconnect);
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [handleUserDisconnect,handleNewUserJoined, handleIncomingCall, handleAnswerFromUser, handleNegotiationNeeded, peer, socket]);

  return (
    <div className="video-chat-container">
      <div className="video-chat-header">
        <h2>Video Chat</h2>
      </div>
      <div className="video-chat-body">
        <div className="local-video-container">
          <Video stream={localStream || null} muted />
        </div>
        <div className="remote-video-container">
          <Video stream={remoteStream || null} />
        </div>
      </div>
    </div>
  );
}

export default VideoChat;
