import { JSDOM } from "jsdom";

const convertTypeQuality = (type, quality) => {
  switch (type) {
    case "jpg":
    case "image/jpg":
      return ["jpg", { quality: quality }];

    case "jpeg":
    case "image/jpeg":
      return ["jpeg", { quality: quality }];

    case "pdf":
    case "application/pdf":
      return ["pdf", {}];

    case "svg":
    case "image/svg":
      return ["svg", {}];

    case "png":
    case "image/png":
    default:
      return ["png", {}];
  }
};

export function createCanvasElement(window) {
  const dom = new JSDOM();

  dom.window.HTMLCanvasElement.prototype.getContext = (contextId) =>
    window.canvas.getContext(contextId);

  dom.window.HTMLCanvasElement.prototype.toDataURL = (type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    return window.canvas.toDataURLSync(format, options);
  };

  dom.window.HTMLCanvasElement.prototype.toBlob = (callback, type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    window.canvas
      .toBuffer(format, options)
      .then((buffer) => callback(new dom.window.Blob([buffer], { type })));
  };

  const element = dom.window.document.createElement("canvas");

  element.width = window.width;
  element.height = window.height;

  return element;
}
