import { useMemo, useCallback, useEffect } from 'react';
import { PeerContext } from './peer';

function PeerProvider({ children }) {
    const peer = useMemo(
        () =>
            new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    },
                ],
            }),
        []
    );

    // Handle ICE candidates
    useEffect(() => {
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate);
                // Send candidate to the remote peer here
            }
        };
    }, [peer]);

    const createOffer = useCallback(async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Failed to create offer:', error);
        }
    }, [peer]);

    const createAnswer = useCallback(
        async (offer) => {
            try {
                await peer.setRemoteDescription(offer);
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                return answer;
            } catch (error) {
                console.error('Failed to create answer:', error);
            }
        },
        [peer]
    );

    const setRemoteAns = useCallback(
        async (answer) => {
            try {
                await peer.setRemoteDescription(answer);
            } catch (error) {
                console.error('Failed to set remote answer:', error);
            }
        },
        [peer]
    );

    return (
        <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAns }}>
            {children}
        </PeerContext.Provider>
    );
}

export default PeerProvider;
