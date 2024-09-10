import {  useCallback, useEffect, useState } from 'react';
import { StreamContext } from './Stream';

function StreamProvider({ children }) {
    const [localStream, setLocalStream] = useState(null);
    const getLocalStrim = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        console.log("set stream" , stream)
        setLocalStream(stream)
      }, [])
      
      useEffect(() => {
        getLocalStrim()
      }, [getLocalStrim])
      
      console.log("stream" , localStream)
    return (
        <StreamContext.Provider value={localStream}>
            {children}
        </StreamContext.Provider>
    );
}

export default StreamProvider;
