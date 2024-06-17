import { Hex } from "./Hex.js";
import { HexMap, HexMapConfig } from "./HexMap.js";

type Event = {
  type: "click" | "mousemove" | "contextmenu";
  callback: (hex: Hex, map: HexMap) => void;
};

type CanvasControlerOptions = {
  canvas: HTMLCanvasElement;
  contextXoffset: number;
  contextYoffset: number;
  mapConfig: HexMapConfig;
  events: Event[];
};

class CanvasControler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private map: HexMap;
  private scale: number = 1;
  private hexSize: number;
  private cursor = {
    x: 0,
    y: 0,
  };

  constructor({
    canvas,
    contextXoffset,
    contextYoffset,
    mapConfig,
    events,
  }: CanvasControlerOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot create canvas context");
    this.ctx = ctx;
    this.map = new HexMap(canvas, contextXoffset, ctx, mapConfig);
    this.hexSize = mapConfig.hexagonSize;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 2;
    ctx.translate(contextXoffset, contextYoffset);

    this.map.draw();

    events.forEach(({ type, callback }) => {
      canvas.addEventListener(type, (e) => {
        e.preventDefault();
        this.cursor.x = e.clientX - contextXoffset;
        this.cursor.y = e.clientY - contextYoffset;

        const hex = this.map.getHex(Hex.pixel_to_flat_hex(this.cursor, this.hexSize * this.scale));
        if (hex) {
          callback(hex, this.map);
        }
      });
    });
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
  public getMap(): HexMap {
    return this.map;
  }
  public changeScale(change: number): void {
    this.scale += change;
    if (this.scale < 0.5) {
      this.scale = 0.5;
    } else if (this.scale > 2) {
      this.scale = 2;
    } else {
      this.map.changeHexagonSize(this.scale * this.hexSize);
    }
  }
}
export { CanvasControler };
