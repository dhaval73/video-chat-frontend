
import ReactPlayer from 'react-player'

function Video({ stream, muted }) {
  return (
    <ReactPlayer
      url={stream}
      muted={muted}
      playing
    />
  )
}

export default Video