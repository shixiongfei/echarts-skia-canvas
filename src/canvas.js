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

export function createCanvasElement(canvas) {
  const dom = new JSDOM();

  dom.window.HTMLCanvasElement.prototype.getContext = (contextId) =>
    canvas.getContext(contextId);

  dom.window.HTMLCanvasElement.prototype.toDataURL = (type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    return canvas.toDataURLSync(format, options);
  };

  dom.window.HTMLCanvasElement.prototype.toBlob = (callback, type, quality) => {
    const [format, options] = convertTypeQuality(type, quality);
    canvas
      .toBuffer(format, options)
      .then((buffer) => callback(new dom.window.Blob([buffer], { type })));
  };

  const element = dom.window.document.createElement("canvas");

  element.width = canvas.width;
  element.height = canvas.height;

  return element;
}

export function createCanvasWindowElement(options) {
  const window = new Window(options);
  return createCanvasElement(window.canvas);
}
