
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class URLPage extends Struct {
  
  /**
   * construct url page
   *
   * @param args 
   */
  constructor(...args) {
    // super
    super(...args);
  }

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'url';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fa fa-align-justify';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'URL Page';
  }

  /**
   * returns page data
   */
  get actions() {
    // return page data
    return {
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view   : 'page/url/view',
      config : 'page/url/config',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Page Descripton';
  }
}