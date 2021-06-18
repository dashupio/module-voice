

// import event emitter
import Agora from 'agora-rtc-sdk';
import { EventEmitter } from 'events';

/**
 * phone
 */
class VoiceModule extends EventEmitter {
  /**
   * constructor
   */
  constructor() {
    // run super
    super();
    
    // connections
    this.__id = null;
    this.__connections = new Map();

    // join/leave
    this.join  = this.join.bind(this);
    this.leave = this.leave.bind(this);

    // bind
    this.onStream  = this.onStream.bind(this);
    this.onActive  = this.onActive.bind(this);
    this.onUpdate  = this.onUpdate.bind(this);
    this.offStream = this.offStream.bind(this);
  }


  // ////////////////////////////////////////////////////////////////////////////
  //
  // INIT METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////

  /**
   * init page
   *
   * @param page 
   */
  async init({ props }) {
    // set props
    this.props = props;

    // return
    if (this.client) return;

    // fix logging
    Agora.Logger.setLogLevel(2);

    // create client
    this.client = Agora.createClient({
      mode  : 'live',
      codec : 'h264',
    });

    // init
    this.client.init('d09b1c0c036f48e6820cb198582748ea');

    // get media
    this.media = await this.getMedia();

    // emit update
    this.emit('update');
  }

  /**
   * on join
   *
   * @param param0 
   */
  async join({ props }) {
    // load join
    const { token, id } = await props.page.action('join');

    // set id
    this.__id = id.split(':').pop();

    // join room
    await new Promise((resolve, reject) => {
      // join room
      this.client.join(token, props.page.get('_id'), id, resolve, reject);
    });

    // connected
    this.connected = true;

    // publish my stream
    await this.client.publish(this.media);

    // on signals
    this.client.on('stream-added', (e) => {
      // subscribe
      this.client.subscribe(e.stream, () => {});
    });
    this.client.on('peer-leave', this.offStream);
    this.client.on('stream-removed', this.offStream);
    this.client.on('active-speaker', this.onActive);
    this.client.on('stream-subscribed', this.onStream);
    this.client.on('stream-unpublished', this.offStream);

    // update events
    this.client.on('mute-audio', this.onUpdate);
    this.client.on('unmute-audio', this.onUpdate);
    this.client.on('mute-video', this.onUpdate);
    this.client.on('unmute-audio', this.onUpdate);

    // emit update
    this.emit('update');
  }

  // leave
  async leave({ props }) {
    // check connected
    if (!this.connected) return;

    // not connected
    this.connected = false;

    // leave
    await new Promise((resolve, reject) => this.client.leave(resolve, reject));
  }

  /**
   * get media
   */
  async getMedia() {
    // create local stream
    const localStream = Agora.createStream({
      audio : true,
      video : true,
    });

    // await promise
    await new Promise((resolve) => {
      // init local stream
      localStream.init(resolve);
    });

    // return stream
    return localStream;
  }

  /**
   * gets connections
   */
  connections (type) {
    // return values
    return Array.from(this.__connections.values()).filter((v) => v.id !== this.__id && (!type || v.type === type));
  }

  /**
   * on signal
   *
   * @param param0 
   */
  onStream(e) {
    // get stream
    const { stream } = e;

    // stream id
    const id   = stream.getId().split(':').pop();
    const user = stream.getId().split(':').length > 1 ? stream.getId().split(':')[0] : null;

    // create event emitter
    const conn = new EventEmitter();

    // set details
    conn.id = id;
    conn.user = user;
    conn.stream = stream;

    // set stream
    this.__connections.set(id, conn);

    // update
    this.emit('update');
    this.emit('joined', conn);
  }

  /**
   * on active
   *
   * @param e 
   */
  onUpdate(e) {
    // set active
    const id   = e.uid.split(':').pop();
    const conn = this.__connections.get(id);

    // check get
    if (conn) {
      // active
      conn.emit('update');
    }
  }

  /**
   * on active
   *
   * @param e 
   */
  onActive(e) {
    // set active
    const id   = e.uid.split(':').pop();
    const conn = this.__connections.get(id);

    // check get
    if (conn) {
      // check timeout
      if (conn.timeout) clearTimeout(conn.timeout);

      // create timeout
      conn.timeout = setTimeout(() => {
        conn.active = null;
        conn.emit('update');
      }, 1000);
      
      // active
      conn.active = new Date();
      conn.emit('update');
    }
  }

  /**
   * on peers
   *
   * @param peers 
   */
  offStream(e) {
    // get stream
    const { stream } = e;

    // close
    stream.close();

    // stream id
    const id = stream.getId().split(':').pop();

    // set stream
    this.__connections.delete(id);

    // update
    this.emit('update');
    this.emit('left', {
      id,
    });
  }
}

// create phone module
const voiceModule = eden.voice || new VoiceModule();

// set to eden
eden.voice = voiceModule;

// export default
export default voiceModule;