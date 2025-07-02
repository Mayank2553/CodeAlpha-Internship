import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';

const ConferenceRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRefs = useRef([]);
  const [peers, setPeers] = useState([]);
  const [screenShareActive, setScreenShareActive] = useState(false);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        // Create RTCPeerConnection for each peer
        socketRef.current.emit('join-room', roomId, socketRef.current.id);
      })
      .catch(err => console.error('Error accessing media devices:', err));

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      // Replace local video stream with screen share stream
      localVideoRef.current.srcObject = stream;
      setScreenShareActive(true);
      
      // Update peer connections with new stream
      peers.forEach(peer => {
        const sender = peer.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(stream.getVideoTracks()[0]);
        }
      });
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  const stopScreenShare = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setScreenShareActive(false);
    // Re-enable camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        // Update peer connections
        peers.forEach(peer => {
          const sender = peer.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
      });
  };

  return (
    <Container>
      <VideoGrid>
        <LocalVideo>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          />
        </LocalVideo>
        {remoteVideoRefs.current.map((ref, index) => (
          <RemoteVideo key={index}>
            <video
              ref={ref}
              autoPlay
              playsInline
            />
          </RemoteVideo>
        ))}
      </VideoGrid>
      <Controls>
        <button onClick={handleScreenShare} disabled={screenShareActive}>
          Start Screen Share
        </button>
        <button onClick={stopScreenShare} disabled={!screenShareActive}>
          Stop Screen Share
        </button>
      </Controls>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const LocalVideo = styled.div`
  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoteVideo = styled.div`
  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Controls = styled.div`
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.8);
  button {
    padding: 0.5rem 1rem;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

export default ConferenceRoom;
