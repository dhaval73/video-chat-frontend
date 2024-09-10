import React from 'react'
export  const StreamContext = React.createContext(null)
export const useStream = () => {
    return React.useContext(StreamContext)
}