import { ImgB64ResizeMaxWidth, loadImg } from '@origami/common/util';

/**
 * onSelectImg
 */
export const onSelectImg = (file) => {
  const ret = [];

  return new Promise((resolve) => {
    let files = Array.isArray(file) ? file : [file];

    // ロードされる度にカウントダウンします
    let restCount = files.length;

    for (let i = 0, len = files.length; i < len; i += 1) {
      const f = files[i];

      ((myfile) => {
        const filename = escape(myfile.name);
        const data = {
          file: myfile,
          filename,
        };
        // イメージをロード
        loadImg(myfile)
          .then((res) => ImgB64ResizeMaxWidth(res.src, 600))
          .then((res) => {
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
export const onSelectCsv = (file) => {
  const ret = [];

  return new Promise((resolve) => {
    let files = Array.isArray(file) ? file : [file];

    // ロードされる度にカウントダウンします
    let restCount = files.length;

    for (let i = 0, len = files.length; i < len; i += 1) {
      const f = files[i];

      ((myfile) => {
        const filename = escape(myfile.name);
        const data = {
          file: myfile,
          filename,
        };

        var reader = new FileReader();

        reader.addEventListener('load', (e) => {
          ret.push({ ...data, txt: e.target.result });
          restCount -= 1;
          if (restCount === 0) {
            resolve(ret);
          }
        });

        reader.readAsText(myfile);
      })(f);
    }
  });
};
