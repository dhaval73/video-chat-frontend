import  { useCallback, useEffect, useState } from 'react'
import {  useSocket } from '../providers/socket'
import { useNavigate } from 'react-router-dom'



function HomePage() {
  const [roomId,setRoomId]=useState("")
  const [userId,setUserId]=useState("")
  const socket  = useSocket()
  const navigate = useNavigate()

  const roomJoined = useCallback(async(data) => {
    console.log('room join successfully :' , data.userId)
    navigate(`/room/${roomId}`)
  }, [navigate,roomId])
  
  useEffect(() => {
    socket.on('joined-room', roomJoined)
    return ()=>{
      socket.off('joined-room', roomJoined)
    }
  }, [roomJoined,socket])

  const handelSubmit = ()=>{
    socket.emit('join-room',{roomId,userId})
  }

  return (
    <div className='home-container'>
        <input type="text" 
          value={userId} 
          onChange={(e)=>setUserId(e.target.value)}
          placeholder='UserId'
        />
        <input type="text" 
          value={roomId} 
          onChange={(e)=>setRoomId(e.target.value)}
          placeholder='RoomId'
        />
        <button type='button' onClick={()=>handelSubmit()}>Submit</button>
    </div>
  )
}

export default HomePage