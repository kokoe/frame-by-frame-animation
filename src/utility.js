/**
 * utitilys
 */

export function isHTMLElement(node) {
  return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
};

/**
 * @param   {array<string>}  paths - image paths
 * @return  {Promise}
 */
export function loadImages(paths) {
  if (!Array.isArray(paths)) return;

  let promises = []; //@type  {array<Promise>}

  paths.forEach((path) => {
    promises.push(
      new Promise((resolve, reject) => {
        let _img = new Image();
        _img.src = path;
        _img.onload = () => {
          resolve(_img); //@param {HTMLElement}
        };
        _img.onerror = () => {
          reject(path + ' is onError.');
        };
      })
    )
  });

  return Promise.all(promises);
}


/**
 * スクロールY値を返すor設定
 * https://github.com/jquery/jquery/tree/2.2.4
 * @param   {HTMLElement|string}   elm - element or selector
 * @param   {number}               value
 * @return  {number} *value is undefined.
 */
export function scrollTop(elm, value) {
  if (typeof elm === 'undefined') {
    elm = window;
  } else if (typeof elm === 'string') {
    elm = document.querySelector(elm);
  }

  // @return  {object} - window object
  var getWindow = function(elm) {
    var isWindow = elm != null && elm === elm.window;

    if (isWindow) {
      return elm;
    } else if (elm.nodeType === 9) {
      return elm.defaultView;
    }
  };

  var win = getWindow(elm);

  if (typeof value === 'undefined') {
    return (win) ? win.pageYOffset : elm.scrollTop;
  }

  if (!!win) {
    win.scrollTo(win.pageXOffset, value);

  } else {
    elm.scrollTop = value;
  }
}

/**
 * ゼロパッディングの値を返す
 * @param   {number}   value
 * @param   {number}   digits
 * @param   {*}
 */
export function getZeroPadding(value, digits) {
  digits = (typeof digits === 'undefined') ? 2 : digits;

  // 空または数値にできない場合はそのまま返す
  if (value === '') {
    return value;
  } else if (Number.isNaN(value - 0)) {
    return value;
  }

  value = value - 0; //数値化

  return (Array(digits).join('0') + value).slice(-digits);
}
