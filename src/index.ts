import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { Window } from "skia-canvas";
import { createCanvasElement } from "./canvas.js";

export type WindowOptions = {
  title?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  theme?: string | object | null;
  locale?: string;
};

export const createEchartsWindow = (options: WindowOptions = {}) => {
  const { title, left, top, width = 800, height = 600 } = options;
  const { theme, locale } = options;

  const window = new Window({ title, left, top, width, height });
  const dom = createCanvasElement(window);

  return echarts.init(dom, theme, { locale, renderer: "canvas" });
};

export const plot = (
  echartsOption: EChartsOption,
  windowOptions: WindowOptions = {},
) => {
  const chart = createEchartsWindow(windowOptions);
  chart.setOption(echartsOption);
  return chart;
};
