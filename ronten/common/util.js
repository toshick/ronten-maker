import {
  SnackbarProgrammatic as Snackbar,
  DialogProgrammatic as Dialog,
  ModalProgrammatic as Modal,
} from 'buefy';

/**
 * sleep
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * toastOK
 */
export const toastOK = (str) => {
  Snackbar.open({
    // duration: 999991500,
    message: str,
    position: 'is-bottom-left',
    type: 'is-success',
    queue: false,
  });
};

/**
 * toastNG
 */
export const toastNG = (str) => {
  Snackbar.open({
    // duration: 999991500,
    message: str,
    position: 'is-bottom-left',
    type: 'is-danger',
    queue: false,
  });
};

/**
 * dialogConfirm
 */
export const dialogConfirm = (str, onConfirm) => {
  Dialog.confirm({
    message: str,
    canCancel: ['button', 'escape'],
    onConfirm,
  });
};

/**
 * dialogPrompt
 */
export const dialogPrompt = (str, onConfirm, inputAttrs) => {
  const attrs = inputAttrs || {
    placeholder: '',
    maxlength: 100,
  };
  Dialog.prompt({
    message: str,
    canCancel: ['button', 'escape'],
    inputAttrs: attrs,
    // trapFocus: true,
    onConfirm,
    confirmText: 'OK',
  });

  sleep(1).then(() => {
    const t = document.querySelector('.media-content input');
    t.addEventListener('keyup', (e) => {
      console.log('きーだうん', e);
      e.preventDefault();
      e.stopPropagation();
    });
  });
};

/**
 * zeropad
 */
export const zeropad = (num, keta = 5) => {
  let str = `${num}`;
  if (str.length >= keta) return str;
  while (str.length < keta) {
    str = `0${str}`;
  }
  return str;
};

/**
 * asort
 */
export function asort(ary, key = 'id') {
  return ary.sort((a, b) => {
    const A = zeropad(a[key]);
    const B = zeropad(b[key]);
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

/**
 * getLastIDX
 */
export const getLastIDX = (ary) => {
  if (ary.length === 0) return 0;
  const sorted = asort(ary, 'idx').reverse();
  const idx = sorted.length > 0 ? +sorted[0].idx : 1;
  return idx;
};

/**
 * isLocalhost
 */
export const isLocalhost = (() =>
  window.location.href.indexOf('localhost') !== -1)();

/**
 * getYMDWithSplit
 */
export const getYMDWithSplit = (ymdnum, splitstr) =>
  ymdnum.slice(0, 4) +
  splitstr +
  ymdnum.slice(4, 6) +
  splitstr +
  ymdnum.slice(6, 8);

/**
 * getYMD
 */
export const getYMD = (split, dateObj) => {
  const splitstr = split || '';
  const d = dateObj || new Date();
  const datestr =
    d.getFullYear() +
    splitstr +
    zeropad(d.getMonth() + 1, 2) +
    splitstr +
    zeropad(d.getDate(), 2);
  return datestr;
};

/**
 * scrollTo
 *
 * @top
 * @left
 * @quick
 */
export function scrollTo(params) {
  const top = params && params.top ? params.top : 0;
  const left = params && params.left ? params.left : 0;
  const behavior = params && params.quick ? 'auto' : 'smooth';
  window.scrollTo({
    top,
    left,
    behavior,
  });
}
