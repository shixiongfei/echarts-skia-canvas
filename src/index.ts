import * as echarts from "echarts";
import { EChartsOption } from "echarts";
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
  const renderer = "canvas";

  const dom = createCanvasElement({ title, left, top, width, height });
  return echarts.init(dom, theme, { locale, width, height, renderer });
};

export const plot = (
  echartsOption: EChartsOption,
  windowOptions: WindowOptions = {},
) => {
  const chart = createEchartsWindow(windowOptions);
  chart.setOption(echartsOption);
  return chart;
};
