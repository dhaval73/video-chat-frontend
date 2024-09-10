

import { Route, Routes } from 'react-router-dom'
import './App.css'
import SocketProvider from './providers/SocketProvider'
import VideoChat from './components/VideoChat'
import HomePage from './components/HomePage'
import PeerProvider from './providers/PeerProvider'



function App() {
  return (
    <SocketProvider>
      <PeerProvider>
       
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:id" element={<VideoChat />} />
        </Routes>
      
      </PeerProvider>
    </SocketProvider>
  )
}

export default App
