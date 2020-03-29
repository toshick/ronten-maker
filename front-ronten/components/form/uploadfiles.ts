import { ImgB64ResizeMaxWidth, ImgB64ResizeMaxWidthReurn, loadImg, LoadImgRerutn } from '@/common/util';
import { FileItem } from '@/types/app';

export const dataFileInit: FileItem = { file: null, filename: '', src: '', txt: '' };

/**
 * onSelectImg
 */
export const onSelectImg = (file: File | File[]) => {
  const ret: Array<FileItem> = [];

  return new Promise<Array<FileItem>>((resolve) => {
    let files = Array.isArray(file) ? file : [file];

    // ロードされる度にカウントダウンします
    let restCount = files.length;

    for (let i = 0, len = files.length; i < len; i += 1) {
      const f = files[i];

      ((myfile: File) => {
        if (!myfile) {
          restCount -= 1;
          return;
        }
        const filename = escape(myfile.name);
        const data = {
          file: myfile,
          filename,
        };
        // イメージをロード
        loadImg(myfile)
          .then((res: LoadImgRerutn) => ImgB64ResizeMaxWidth(res.src, 600))
          .then((res: ImgB64ResizeMaxWidthReurn) => {
            ret.push({
              ...data,
              src: res && res.imgb64 ? res.imgb64 : res.src,
            });
            restCount -= 1;
            if (restCount === 0) {
              resolve(ret);
            }
          });
      })(f);
    }
  });
};

/**
 * onSelectCsv
 */
export const onSelectCsv = (file: File) => {
  const ret: Array<FileItem> = [];

  return new Promise<Array<FileItem>>((resolve) => {
    let files = Array.isArray(file) ? file : [file];

    // ロードされる度にカウントダウンします
    let restCount = files.length;

    for (let i = 0, len = files.length; i < len; i += 1) {
      const f = files[i];

      ((myfile: File) => {
        if (!myfile) {
          restCount -= 1;
          return;
        }
        const filename = escape(myfile.name);
        const data = {
          file: myfile,
          filename,
        };

        const reader = new FileReader();
        reader.addEventListener('load', (e: any) => {
          ret.push({ ...data, txt: (e.target && e.target.result) || '' });
          restCount -= 1;
          if (restCount === 0) {
            resolve(ret);
          }
        });

        // reader.readAsText(myfile);
      })(f);
    }
  });
};
