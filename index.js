// require first
const { Module, Query } = require('@dashup/module');

// import base
const URLPage = require('./pages/url');

/**
 * export module
 */
class URLModule extends Module {
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register sms action
    fn('page', URLPage);
  }
}

// create new
module.exports = new URLModule();
