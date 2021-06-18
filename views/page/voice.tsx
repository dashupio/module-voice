// import react
import voice from '../voice';
import { Page } from '@dashup/ui';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

// voice video
import VoiceVideo from './voice/video';

// scss
import './voice.scss';

// URL Page
const PageVoice = (props = {}) => {
  // state
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
      <Page.Config show={ config } onHide={ (e) => setConfig(false) } />
      <Page.Menu onConfig={ () => setConfig(true) } onShare />
      <Page.Body>
        { joined ? (
          <div className="flex-1 wrapper d-flex align-items-center">
            <div className="w-100">
              <div className="row justify-content-center">
                { !!voice && (
                  connections.map((conn, i) => {
                    // return jsx
                    return (
                      <div key={ conn.id } className={ `col-lg-${connections.length === 1 ? '10' : (connections.length === 2 ? '6' : '4')}` }>
                        <div className={ `card mb-4 bg-secondary text-white` }>
                          <div className="ratio ratio-16x9">
                            <VoiceVideo voice={ voice } stream={ conn.stream } conn={ conn } />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) }
              </div>
            </div>

            <div className="floating-buttons d-flex justify-content-center">
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    { isAudio() ? 'Mute' : 'Unmute' }
                  </Tooltip>
                }
                placement="top"
              >
                <button className={ `btn btn-primary mx-1 btn-lg rounded-circle` } onClick={ (e) => onToggleMuted(e) }>
                  <i className={ `fa fa-fw fa-microphone${isAudio() ? '' : '-slash'}` } />
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    Leave Call
                  </Tooltip>
                }
                placement="top"
              >
                <button className={ `btn btn-danger mx-1 btn-lg rounded-circle` } onClick={ (e) => setJoined(null) }>
                  <i className={ `fa fa-fw fa-phone-slash` } />
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    { isVideo() ? 'Off Camera' : 'On Camera' }
                  </Tooltip>
                }
                placement="top"
              >
                <button className={ `btn btn-primary mx-1 btn-lg rounded-circle` } onClick={ (e) => onToggleVideo(e) }>
                  <i className={ `fa fa-fw fa-video${isVideo() ? '' : '-slash'}` } />
                </button>
              </OverlayTrigger>
            </div>

            <div className="card card-me bg-secondary">
              <div className="ratio ratio-16x9">
                { (!voice || !voice.media) ? (
                  <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <i className="fa h1 fa-spinner fa-spin" />
                  </div>
                ) : (
                  <VoiceVideo voice={ voice } mine={ true } stream={ voice.media } />
                ) }
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 d-flex align-items-center">
            <div className="container-lg mx-auto">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <div className="card card-join bg-secondary">
                    <div className="ratio ratio-16x9">
                      { (!voice || !voice.media) ? (
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                          <i className="fa h1 fa-spinner fa-spin" />
                        </div>
                      ) : (
                        <VoiceVideo voice={ voice } mine={ true } fullSize stream={ voice.media } />
                      ) }
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center">
                  <h2 className="mb-5">
                    Ready to Join?
                  </h2>
                  <button className="btn btn-lg btn-primary" onClick={ () => setJoined(true) }>
                    Join now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) }
      </Page.Body>
    </Page>
  );
};

// export default
export default PageVoice;