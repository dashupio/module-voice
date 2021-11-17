// import react
import voice from '../voice';
import React, { useState, useEffect } from 'react';
import { Page, Box, Container, Tooltip, Grid, Button, Typography, IconButton, Icon } from '@dashup/ui';

// voice video
import VoiceVideo from './voice/video';

// scss
import './voice.scss';

// URL Page
const PageVoice = (props = {}) => {
  // state
  const [share, setShare] = useState(false);
  const [config, setConfig] = useState(false);
  const [joined, setJoined] = useState(false);
  const [updated, setUpdated] = useState(new Date());
  const [connections, setConnections] = useState([]);

  // on update
  const onUpdate = () => {
    // set updated
    setUpdated(new Date());
    setConnections(voice.connections());
  };

  // is video
  const isVideo = () => {
    // return is on
    return voice.media?.isVideoOn();
  };

  // is audio
  const isAudio = () => {
    // return is on
    return voice.media?.isAudioOn();
  };

  // toggle video
  const onToggleVideo = (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // is muted
    if (isVideo()) {
      // enable
      voice.media?.muteVideo();
    } else {
      // disable
      voice.media?.unmuteVideo();
    }

    // set updated
    voice.emit('update');
  };

  // on toggle muted
  const onToggleMuted = (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // is muted
    if (isAudio()) {
      // enable
      voice.media?.muteAudio();
    } else {
      // disable
      voice.media?.unmuteAudio();
    }

    // set updated
    voice.emit('update');
  };

  // init voice
  useEffect(() => {
    // voice init
    voice.init({ props });
    voice.on('update', onUpdate);

    // joined
    if (joined) {
      // joined
      voice.join({ props });
    }

    // return change
    return () => {
      // remove
      voice.removeListener('update', onUpdate);
      voice.leave({ props });
    };
  }, [props.page && props.page.get('_id'), joined]);

  // return jsx
  return (
    <Page { ...props } bodyClass="flex-column">
      <Page.Share show={ share } onHide={ (e) => setShare(false) } />
      <Page.Config show={ config } onHide={ (e) => setConfig(false) } />
      <Page.Menu onConfig={ () => setConfig(true) } presence={ props.presence } onShare={ () => setShare(true) } />
      <Page.Body>
        <Box flex={ 1 } position="relative" display="flex">
          { joined ? (
            <Container>
              <Grid container sx={ {
                justifyContent : 'center',
              } }>
                { !!voice && (
                  connections.map((conn, i) => {
                    // return jsx
                    return (
                      <Grid item xs={ connections.length === 1 ? 10 : (connections.length === 2 ? 6 : 4) }>
                        <VoiceVideo voice={ voice } stream={ conn.stream } conn={ conn } />
                      </Grid>
                    );
                  })
                ) }
              </Grid>
              
              <Box position="absolute" left={ 0 } right={ 0 } bottom={ 0 } pb={ 3 } display="flex" justifyContent="center">
                <Tooltip title={ isAudio() ? 'Mute' : 'Unmute' }>
                  <IconButton onClick={ (e) => onToggleMuted(e) }>
                    <Icon type="fas" icon={ `microphone${isAudio() ? '' : '-slash'}` } />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Leave Call">
                  <IconButton onClick={ (e) => setJoined(null) }>
                    <Icon type="fas" icon="phone-slash" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={ isVideo() ? 'Camera Off' : 'Camera On' }>
                  <IconButton onClick={ (e) => onToggleVideo(e) }>
                    <Icon type="fas" icon={ `video${isVideo() ? '' : '-slash'}` } />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box position="absolute" left={ 0 } bottom={ 0 } pl={ 3 } pb={ 3 }>
                <VoiceVideo voice={ voice } mine={ true } stream={ voice.media } sx={ {
                  width : 360,
                } } />
              </Box>
            </Container>
          ) : (
            <Box flex={ 1 } alignItems="center" display="flex">
              <Container>
                <Grid spacing={ 2 } container>
                  <Grid item xs={ 7 }>
                    <VoiceVideo voice={ voice } mine={ true } fullSize stream={ voice?.media } />
                  </Grid>
                  <Grid item xs={ 5 } alignItems="center" display="flex">
                    <Box width="100%" textAlign="center">
                      <Typography variant="h4" sx={ {
                        mb : 3,
                      } }>
                        Ready to join?
                      </Typography>
                      <Button variant="contained" color="primary" size="large" onClick={ () => setJoined(true) }>
                        Join Now
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          ) }
        </Box>
      </Page.Body>
    </Page>
  );
};

// export default
export default PageVoice;