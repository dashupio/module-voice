
// import react
import Ratio from 'react-ratio';
import ReactPlayer from 'react-player';
import React, { useState, useEffect } from 'react';
import { Box, Card, IconButton, Icon, Tooltip, CircularProgress } from '@dashup/ui';

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
    <Card variant="outlined" sx={ {
      ...props.sx,

      position    : 'relative',
      borderColor : props.conn?.active ? 'success.main' : undefined,
    } }>
      <Ratio ratio={ 16 / 9 }>
        <Box width="100%" height="100%" sx={ {
          '& .stream' : {
            width  : '100%!important',
            height : '100%!important',
          }
        } }>
          { isVideo() && (
            props.stream ? (
              <ReactPlayer url={ props.stream?.stream } className="stream" playing muted={ muted || props.mine } />
            ) : (
              <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            )
          ) }
        </Box>
      </Ratio>
      <Box position="absolute" bottom={ 0 } left={ 0 } right={ 0 } py={ 2 } display="flex" flexDirection="row" justifyContent="center">
        <Tooltip title={ isAudio() ? 'Mute' : 'Unmute' }>
          <IconButton onClick={ (e) => onToggleMuted(e) }>
            { props.mine ? (
              <Icon type="fas" icon={ `microphone${isAudio() ? '' : '-slash' }` } />
            ) : (
              <Icon type="fas" icon={ `volume${isAudio() ? '-up' : '-slash'}` } />
            ) }
          </IconButton>
        </Tooltip>
        <Tooltip title={ isVideo() ? 'Video Off' : 'Video On' }>
          <IconButton onClick={ (e) => onToggleVideo(e) }>
            <Icon type="fas" icon={ `video${isVideo() ? '' : '-slash'}` } />
          </IconButton>
        </Tooltip>
      </Box>
      <Box />
    </Card>
  );
};

// export default
export default PageVoiceVideo;