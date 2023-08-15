import { JSDOM } from "jsdom";
import { Window } from "skia-canvas";

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

export function createCanvasElement(options) {
  const dom = new JSDOM();
  const window = new Window(options);
  const element = dom.window.document.createElement("canvas");
  const prototype = Object.getPrototypeOf(element);

  prototype.getContext = (contextId) => window.canvas.getContext(contextId);

  prototype.toDataURL = (type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    return window.canvas.toDataURLSync(format, options);
  };

  prototype.toBlob = (callback, type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    window.canvas
      .toBuffer(format, options)
      .then((buffer) => callback(new dom.window.Blob([buffer], { type })));
  };

  return element;
}
