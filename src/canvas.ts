import { JSDOM } from "jsdom";
import { Window, WindowOptions } from "skia-canvas";
import { ExportFormat, RenderOptions } from "skia-canvas";

const convertTypeQuality = (
  type: string,
  quality: number,
): [format: ExportFormat, options: RenderOptions] => {
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

export const createCanvasElement = (options?: WindowOptions) => {
  const dom = new JSDOM();
  const window = new Window(options);
  const element = dom.window.document.createElement("canvas");
  const prototype = Object.getPrototypeOf(element);

  prototype.getContext = (contextId: "2d") =>
    window.canvas.getContext(contextId);

  prototype.toDataURL = (type: string, quality: number) =>
    window.canvas.toDataURLSync(...convertTypeQuality(type, quality));

  prototype.toBlob = (callback: BlobCallback, type: string, quality: number) =>
    window.canvas
      .toBuffer(...convertTypeQuality(type, quality))
      .then((buffer) => callback(new dom.window.Blob([buffer])));

  return element;
};
