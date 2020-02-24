import Bowser from "bowser";
import _cloneDeep from "lodash/cloneDeep";
import FrameAnimationBase from './frame-animation-base.js';
import {getZeroPadding} from './utility.js';

const pk = require('../package.json');


/*!
 * frame-by-frame-animation.js
 * https://github.com/kokoe/frame-by-frame-animation
 */

const isDesktop = () => {
  let browser = Bowser.getParser(window.navigator.userAgent);
  return 'desktop' === browser.getPlatformType(true);
};

/**
 * @param  {object} - configs
 * @return {array<string>}
 */
const createPaths = ({dir, desktopRatio = 1, end, filePref = '', fileExtension = 'jpg', filedigits = 3}) => {
  let images = [];
  let start = 0;

  dir = isDesktop() ? `${dir}${desktopRatio}/` : `${dir}default/`;

  for (start = 0; start <= end; ++start) {
    images.push(`${dir}${filePref}${getZeroPadding(start, filedigits)}.${fileExtension}`);
  }

  return images;
};


class FrameAnimation extends FrameAnimationBase {

  /**
   * @param  {object}         configs
   *         {HTMLElement}    configs.container
   *         {string}         configs.mode - preload|undefined
   *         {string}         configs.dir
   *         {number}         configs.desktopRatio
   *         {number}         configs.start
   *         {number}         configs.end
   *         {string}         configs.filePref
   *         {string}         configs.fileExtension
   *         {number}         configs.filedigits
   *         {array<number>}  configs.steps
   *         {number}         configs.fps
   *         {boolean}        configs.isLoop
   */
  constructor(_configs = {}) {
    let configs = _cloneDeep(_configs);

    configs.images = createPaths(configs);
    super(configs);
  }
}

FrameAnimation.version = pk.version;

export default FrameAnimation;
