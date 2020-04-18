import loadImage, { MetaData, CanvasTrueOptions } from 'blueimp-load-image';
import { SnackbarProgrammatic as Snackbar, DialogProgrammatic as Dialog, ModalProgrammatic as Modal } from 'buefy';

export type ImgB64ResizeMaxWidthReurn = {
  imgb64: string;
  width: number;
  height: number;
  src: string;
};

export type LoadImgRerutn = {
  file: File;
  src: string;
};

/**
 * sleep
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * toastOK
 */
export const toastOK = (str: string) => {
  Snackbar.open({
    // duration: 999991500,
    message: str,
    position: 'is-top',
    type: 'is-info',
    queue: false,
  });
};

/**
 * toastNG
 */
export const toastNG = (str: string) => {
  Snackbar.open({
    // duration: 999991500,
    message: str,
    position: 'is-top',
    type: 'is-danger',
    queue: false,
  });
};

/**
 * dialogConfirm
 */
export const dialogConfirm = (str: string, onConfirm: any) => {
  Dialog.confirm({
    message: str,
    canCancel: ['button', 'escape'],
    onConfirm,
  });
};

/**
 * dialogPrompt
 */
export const dialogPrompt = (str: string, onConfirm: any, inputAttrs: any) => {
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
    if (t) {
      t.addEventListener('keyup', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  });
};

/**
 * zeropad
 */
export const zeropad = (num: number, keta: number = 5) => {
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
export function asort(ary: Array<any>, key: string = 'id') {
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
export const getLastIDX = (ary: Array<any>) => {
  if (ary.length === 0) return 0;
  const sorted = asort(ary, 'idx').reverse();
  const idx = sorted.length > 0 ? +sorted[0].idx : 1;
  return idx;
};

/**
 * isLocalhost
 */
export const isLocalhost = (() => window.location.href.includes('localhost'))();

/**
 * getYMDWithSplit
 */
export const getYMDWithSplit = (ymdnum: string, splitstr: string = '') => ymdnum.slice(0, 4) + splitstr + ymdnum.slice(4, 6) + splitstr + ymdnum.slice(6, 8);

/**
 * getYMD
 */
export const getYMD = (splitstr: string = '', dateObj: Date) => {
  const d = dateObj || new Date();
  const datestr = d.getFullYear() + splitstr + zeropad(d.getMonth() + 1, 2) + splitstr + zeropad(d.getDate(), 2);
  return datestr;
};

/**
 * scrollTo
 *
 * @top
 * @left
 * @quick
 */
export function scrollTo(params: { top?: number; left?: number; quick?: boolean }) {
  const top = params && params.top ? params.top : 0;
  const left = params && params.left ? params.left : 0;
  const behavior = params && params.quick ? 'auto' : 'smooth';
  window.scrollTo({
    top,
    left,
    behavior,
  });
}

/**
 * load image with orientation fix
 */
export function loadImg(file: File) {
  return new Promise<LoadImgRerutn>((resolve) => {
    loadImage.parseMetaData(file, (data: MetaData) => {
      const options = { canvas: true } as CanvasTrueOptions;
      if (data.exif) {
        // options.orientation = data.exif.get('Orientation');
      }
      loadImage(
        file,
        (canvas: any) => {
          let src = '';
          if (canvas.toDataURL) {
            src = canvas.toDataURL(file.type);
          }
          resolve({ file, src });
        },
        options,
      );
    });
  });
}

/**
 * Resize Base64 Image
 * @imgB64: string "data:image/png;base64,xxxxxxxx"
 */
export function ImgB64ResizeMaxWidth(imgB64: string, maxWidth: number) {
  return new Promise<ImgB64ResizeMaxWidthReurn>((resolve) => {
    const imgType = imgB64.substring(5, imgB64.indexOf(';'));
    // Source Image
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width < maxWidth) {
        resolve({ imgb64: imgB64, width, height, src: imgB64 });
        return;
      }
      const per = height / width;
      const h = maxWidth * per;

      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0, maxWidth, h);

      const imgdata = canvas.toDataURL(imgType);
      resolve({
        imgb64: imgdata,
        width: canvas.width,
        height: canvas.height,
        src: imgB64,
      });
    };
    img.src = imgB64;
  });
}

/**
 * randomText
 */
export const randomText = () => {
  const strLength = 16;
  const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const clength = c.length;
  let ret = '';
  for (let i = 0; i < strLength; i++) {
    ret += c[Math.floor(Math.random() * clength)];
  }
  return ret;
};

/**
 * goTop
 */
export const goTop = () => {
  window.location.href = '/';
};

/**
 * goProject
 */
export const goProject = (hash: string) => {
  window.location.href = `/discussion/${hash}`;
};
