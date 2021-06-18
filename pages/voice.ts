
// import page interface
import Lock from 'async-lock';
import generate from '../vendor/token';
import { Struct } from '@dashup/module';
import { v4 as uuid } from 'uuid';

/**
 * build address helper
 */
export default class VoicePage extends Struct {
  
  /**
   * construct voice page
   *
   * @param args 
   */
  constructor(...args) {
    // super
    super(...args);

    // create lock
    this.lock = new Lock();

    // bind methods
    this.joinAction = this.joinAction.bind(this);
    this.pingAction = this.pingAction.bind(this);
    this.leaveAction = this.leaveAction.bind(this);
    this.signalAction = this.signalAction.bind(this);
  }

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'voice';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fa fa-browser';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Voice Page';
  }

  /**
   * returns page data
   */
  get actions() {
    // return page data
    return {
      join   : this.joinAction,
      ping   : this.pingAction,
      leave  : this.leaveAction,
      signal : this.signalAction,
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view   : 'page/voice',
      config : 'page/voice/config',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['View'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Voice call page';
  }

  /**
   * sanitise action
   *
   * @param opts 
   * @param data 
   */
  async pingAction(opts, id) {
    // create peer
    await this.dashup.connection.rpc({
      ...opts,
    }, 'peer.update', opts.page);

    // return true
    return true;
  }

  /**
   * sanitise action
   *
   * @param opts 
   * @param data 
   */
  async joinAction(opts) {
    // create user
    const id = `${opts.user ? `${opts.user}:` : ''}${uuid()}`;

    // generate token
    const token = generate({
      appID          : this.dashup.config.appID,
      appCertificate : this.dashup.config.appCertificate,

      uid     : id,
      channel : opts.page,
    });
    
    // return token
    return { token, id };
  }

  /**
   * sanitise action
   *
   * @param opts 
   * @param data 
   */
  async leaveAction(opts) {
    // create peer
    await this.dashup.connection.rpc({
      ...opts,
    }, 'peer.remove', opts.page);

    // remove peer
    return true;
  }

  /**
   * sanitise action
   *
   * @param opts 
   * @param data 
   */
  signalAction(opts, from, peer, data) {
    // emit to socket
    this.dashup.connection.rpc({
      ...peer,
    }, 'socket.emit', `signal.${opts.page}`, from, peer, data);

    // return true
    return true;
  }

  /**
   * emit peers
   *
   * @param opts 
   */
  async emitPeers(opts) {
    // create peer
    const peers = await this.dashup.connection.rpc({
      ...opts,
    }, 'peer.list', opts.page);

    // loop peers
    peers.forEach((peer) => {
      // emit to socket
      this.dashup.connection.rpc({
        ...peer,
      }, 'socket.emit', `peers.${opts.page}`, this.matchPeers(peer, peers));
    });

    // return peers
    return this.matchPeers(opts, peers);
  }

  /**
   * match peers
   *
   * @param opts 
   * @param peers 
   */
  matchPeers(opts, peers) {
    // get me
    const me = peers.find((p) => p.socket === opts.socket);

    // check me
    if (!me) return [];

    // peer
    return peers.map((peer) => {
      // return peer
      return {
        ...peer,

        initiator : new Date(me.created) > new Date(peer.created),
      };
    }).filter((p) => p);
  }
}