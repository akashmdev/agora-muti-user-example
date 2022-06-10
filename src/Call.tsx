import React, {useEffect, useState} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import './Call.css';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

function Call() {
  const [ appid, setAppid ] = useState('ea1dbfc4feab4310ad5a494d48fcee07');
  const [ token, setToken ] = useState('006ea1dbfc4feab4310ad5a494d48fcee07IAAG/dUKIxHba/BKje5IoLWyEFLfWDo4rWvdlu2y73iAdoAO3FUAAAAAEABUm4+spjukYgEAAQCmO6Ri');
  const [ channel, setChannel ] = useState('demo1');
  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers
  } = useAgora(client);
  useEffect(()=>{
    if(!appid || !token || !channel) return;
    join(appid, channel, token);
  },[])

  return (
    <div className='call'>
      <form className='call-form'>
        <label>
          AppID:
          <input type='text' name='appid' value={appid} onChange={(event) => { setAppid(event.target.value) }}/>
        </label>
        <label>
          Token(Optional):
          <input type='text' name='token' value={token} onChange={(event) => { setToken(event.target.value) }} />
        </label>
        <label>
          Channel:
          <input type='text' name='channel' value={channel} onChange={(event) => { setChannel(event.target.value) }} />
        </label>
        <div className='button-group'>
          <button id='join' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {join(appid, channel, token)}}>Join</button>
          <button id='leave' type='button' className='btn btn-primary btn-sm' disabled={!joinState} onClick={() => {leave()}}>Leave</button>
        </div>
      </form>
      <div className='player-container'>
        <div className='local-player-wrapper'>
          <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
          <button onClick={()=> {console.log(localVideoTrack)}}>{'Print video track'}</button>
          <button onClick={()=> {console.log(localAudioTrack)}}>{'Print audio track'}</button>
          <button onClick={()=> {localVideoTrack?.setEnabled(false)}}>{"Video Turn off"}</button>
          <button onClick={()=> {localVideoTrack?.setEnabled(true)}}>{"Video Turn on"}</button>
          <button onClick={()=> {localAudioTrack?.setEnabled(false)}}>{"Audio Turn off"}</button>
          <button onClick={()=> {localAudioTrack?.setEnabled(true)}}>{"Audio Turn on"}</button>
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
            <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
          </div>))}
      </div>
    </div>
  );
}

export default Call;
