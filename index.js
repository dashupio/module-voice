// require first
const { Module, Query } = require('@dashup/module');

// import base
const VoicePage = require('./pages/voice');

/**
 * export module
 */
class VoiceModule extends Module {
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register sms action
    fn('page', VoicePage);
  }
}

// create new
module.exports = new VoiceModule();
