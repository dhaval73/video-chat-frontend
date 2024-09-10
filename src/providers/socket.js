import React from 'react'
export  const SocketContext = React.createContext(null)
export const useSocket = () => {
    // console.log(React.useContext(SocketContext));
    return React.useContext(SocketContext)
}
