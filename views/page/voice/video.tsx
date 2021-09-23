
// import react
import ReactPlayer from 'react-player';
import { OverlayTrigger, Tooltip } from '@dashup/ui';
import React, { useState, useEffect } from 'react';

// page voice video
const PageVoiceVideo = (props = {}) => {
  // muted
  const [muted, setMuted] = useState(false);
  const [watched, setWatched] = useState(true);

  // is video
  const isVideo = () => {
    // enable
    if (props.mine) {
      return props.stream?.isVideoOn();
    } else {
      return watched;
    }
  };

  // is audio
  const isAudio = () => {
    // enable
    if (props.mine) {
      return props.stream?.isAudioOn();
    } else {
      return !muted;
    }
  };

  // toggle video
  const onToggleVideo = (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // is muted
    if (isVideo()) {
      // enable
      if (props.mine) {
        props.stream.muteVideo();
      } else {
        setWatched(false);
      }
    } else {
      // enable
      if (props.mine) {
        props.stream.unmuteVideo();
      } else {
        setWatched(true);
      }
    }

    // set updated
    props.voice.emit('update');
  };

  // on toggle muted
  const onToggleMuted = (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // is muted
    if (isAudio()) {
      // enable
      if (props.mine) {
        props.stream.muteAudio();
      } else {
        setMuted(true);
      }
    } else {
      // enable
      if (props.mine) {
        props.stream.unmuteAudio();
      } else {
        setMuted(false);
      }
    }

    // set updated
    props.voice.emit('update');
  };

  // return jsx
  return (
    <div className={ `video-wrapper bg-secondary h-100 w-100${props.conn && props.conn.active ? ' border border-success' : ''}` }>
      <div className={ `${isVideo() ? '' : ' d-none'}` }>
        <ReactPlayer url={ props.stream?.stream } className={ `w-100 h-100` } playing muted={ muted || props.mine } />
      </div>
      { (props.fullSize || !props.mine) && (
        <div className="video-buttons d-flex justify-content-center">
          <OverlayTrigger
            overlay={
              <Tooltip>
                { isAudio() ? 'Mute' : 'Unmute' }
              </Tooltip>
            }
            placement="top"
          >
            <button className={ `btn btn-primary rounded-circle mx-1${props.fullSize ? ' btn-lg' : ''}` } onClick={ (e) => onToggleMuted(e) }>
              <i className={ `fa fa-fw fa-${props.mine ? `microphone${isAudio() ? '' : '-slash'}` : `volume${isAudio() ? '-up' : '-slash'}`}` } />
            </button>
          </OverlayTrigger>
          
          <OverlayTrigger
            overlay={
              <Tooltip>
                { isVideo() ? 'Off Video' : 'On Video' }
              </Tooltip>
            }
            placement="top"
          >
            <button className={ `btn btn-primary rounded-circle mx-1${props.fullSize ? ' btn-lg' : ''}` } onClick={ (e) => onToggleVideo(e) }>
              <i className={ `fa fa-fw fa-video${isVideo() ? '' : '-slash'}` } />
            </button>
          </OverlayTrigger>
        </div>
      ) }
    </div>
  );
};

// export default
export default PageVoiceVideo;