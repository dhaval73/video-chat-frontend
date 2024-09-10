import React from 'react'
export  const PeerContext = React.createContext(null)
export const usePeer = () => {
    return React.useContext(PeerContext)
}