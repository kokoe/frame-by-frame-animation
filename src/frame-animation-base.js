const EventEmitter = require('wolfy87-eventemitter');
import {scrollTop, isHTMLElement, loadImages} from './utility.js';

const pk = require('../package.json');


/*!
 * frame-by-frame-animation-base.js
 * https://github.com/kokoe/frame-by-frame-animation
 */
class FrameAnimationBase {

  /**
   * @param  {object}         configs
   * @param  {boolean}        configs.mode - preload
   * @param  {array<string>}  configs.images
   * @param  {HTMLElement}    configs.container
   * @param  {number}         configs.fps   - speed or fps
   * @param  {number}         configs.speed - msec
   * @param  {number}         configs.start - animation start index
   * @param  {boolean}        configs.isLoop
   * @param  {array<number>}  configs.steps
   */
  constructor(configs = {}) {
    if (!Array.isArray(configs.images)) return;

    this._timer = null;
    this._promises = {};

    // 画像ロード
    this.setPromise('images', loadImages(configs.images));

    if ('preload' === configs.mode) return;


    this.emitter = new EventEmitter();

    this.frameLength = configs.images.length;
    this.firstFrame = configs.start || 0;
    this.lastFrame = this.frameLength - 1;
    this.currentFrame = this.firstFrame;
    this.prevFrame = null;

    this.speed = configs.speed || Math.round(1 / configs.fps * 1000);
    this.isLoop = ('isLoop' in configs) ? configs.isLoop : true;
    this.steps = configs.steps || [];

    this.container = isHTMLElement(configs.container) ?
      configs.container : this.constructor.createContainer();

    this.getPromise('images')
      .then(imgs => {
        this.imgs = imgs;
        this.createFrames();
      })
      .catch(() => {
        this.emitter.emit('error');
      });
  }


  /**
   * EventEmitter on
   * @param  {string}    eventName
   * @param  {function}  callback
   */
  on(eventName, callback) {
    if (!this.emitter) return;
    this.emitter.on(eventName, callback);
  }

  /**
   * @return  {Promise}
   */
  createFrames(imgs) {
    imgs = imgs || this.imgs;

    if (!Array.isArray(imgs)) return;

    let fragment = document.createDocumentFragment();

    imgs.forEach((img, i) => {
      img.style.opacity = (this.firstFrame === i) ? 1 : 0;
      fragment.appendChild(img);
    });

    this.container.appendChild(fragment);

    // this.emitter.emit('ready');
  }

  _animation() {
    let prev = this.prevFrame;
    let current = this.currentFrame;

    if (this.steps.find(f => current === f) !== undefined) {
      this.emitter.emit('animation-current-frame', current);
    }

    this.imgs[current].style.opacity = 1;

    // 同時DOM処理が負担がかかるようで、
    // 少しだけずらしてあげることで軽くなる。主にIE対策
    setTimeout(() => {
      if (null != this.prevFrame) {
        this.imgs[prev].style.opacity = 0;
      }

      this.prevFrame = current;

      if (current !== this.lastFrame) {
        // 次のフレームがある
        ++this.currentFrame;

      } else if (this.isLoop) {
        // 最終フレーム・ループ
        this.currentFrame = 0;

      } else {
        // 最終フレーム・ループ無し
        this.stop();
        this.emitter.emit('animation-end');
      }
    }, 1);
  }

  start(frame) {
    if (null != this._timer) return;

    this.emitter.emit('animation-start');

    if (typeof frame !== 'undefined') {
      this.changeFrame(frame);
    }

    this.getPromise('images')
      .then(() => {
        this._timer = setInterval(this._animation.bind(this), this.speed);
      });
  }

  stop() {
    clearInterval(this._timer);
    this._timer = null;
  }

  /**
   * @param  {number}  frame
   */
  changeFrame(frame) {
    if (!this.imgs) return;

    let prev = this.prevFrame;
    let current = this.currentFrame;

    this.imgs[prev].style.opacity = 0;
    this.imgs[current].style.opacity = 0;

    this.currentFrame = frame;

    this.imgs[frame].style.opacity = 1;
  }

  getPromise(key) {
    return this._promises[key] || Promise.reject('unload');
  }

  setPromise(key, promise) {
    this._promises[key] = promise;
  }

  getStepLength() {
    return this.steps.length;
  }
}

FrameAnimationBase.createContainer = (tag = 'div') => {
  return document.createElement(tag);
};


FrameAnimationBase.version = pk.version;

export default FrameAnimationBase;
