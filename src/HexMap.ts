import { Hex } from "./Hex.js";

export type HexMapConfig = {
  rows: number;
  cols: number;
  hexagonSize: number;
  hexagonColor: string;
  showCoordinates?: boolean;
};

type HexPosition = {
  q: number;
  r: number;
};
type FullHexPosition = {
  q: number;
  r: number;
  s: number;
};

class HexMap {
  private map = new Map<string, Hex>();
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private canvasOffset: number;
  private hexagonSize: number;
  private hexagonColor: string;
  private showCoordinates: boolean;
  private showType: boolean = false;

  private cubeDirectionsVectors = [
    [+1, 0, -1],
    [+1, -1, 0],
    [0, -1, +1],
    [-1, 0, +1],
    [-1, +1, 0],
    [0, +1, -1],
  ];

  constructor(
    canvas: HTMLCanvasElement,
    canvasOffset: number,
    ctx: CanvasRenderingContext2D,
    { hexagonSize, rows, cols, hexagonColor, showCoordinates }: HexMapConfig
  ) {
    this.canvas = canvas;
    this.canvasOffset = canvasOffset;
    this.ctx = ctx;
    this.hexagonSize = hexagonSize;
    this.showCoordinates = showCoordinates || false;
    this.hexagonColor = hexagonColor;
    this.createMap(rows, cols);
  }
  public getHex(position: FullHexPosition): Hex | null {
    return this.map.get(JSON.stringify(position)) || null;
  }

  public draw() {
    this.ctx.clearRect(
      -this.canvasOffset,
      -this.canvasOffset,
      this.canvas.width,
      this.canvas.height
    );
    this.map.forEach((hex) => {
      hex.draw();
    });
  }

  public getHexNeighbors(hex: Hex): Hex[] {
    const neighbors: Hex[] = [];
    this.cubeDirectionsVectors.forEach((direction) => {
      const neighborPosition = {
        q: hex.position.q + direction[0],
        r: hex.position.r + direction[1],
        s: hex.position.s + direction[2],
      };
      const neighbor = this.getHex(neighborPosition);
      if (neighbor && !neighbor.isWall()) {
        neighbors.push(neighbor);
      }
    });
    return neighbors;
  }
  public toogleCoordinates() {
    this.showCoordinates = !this.showCoordinates;
    this.map.forEach((hex) => {
      hex.toogleCoordinates();
    });
    this.draw();
  }
  public toggleShowType() {
    this.showType = !this.showType;
    this.map.forEach((hex) => {
      hex.toggleShowType();
    });
    this.showCoordinates = false;
    this.draw();
  }
  public resetMap() {
    this.map.forEach((hex) => {
      if (hex.getType() === "start" || hex.getType() === "end" || hex.getType() === "wall") return;
      hex.setType("default");
    });
  }
  public changeHexagonSize(size: number) {
    this.hexagonSize = size;
    this.map.forEach((hex) => {
      hex.changeSize(size);
    });
    this.draw();
  }
  private addHex(position: HexPosition) {
    const { q, r } = position;
    const s = -q - r;

    const newHex = new Hex(
      this.ctx,
      { q, r, s },
      this.hexagonSize,
      this.showCoordinates,
      this.hexagonColor
    );
    this.map.set(JSON.stringify(newHex.position), newHex);
    return newHex;
  }
  private createMap(rows: number, cols: number) {
    let k = 0;
    for (let i = 0; i < cols; i++) {
      if (i % 2 === 0 && i !== 0) {
        k++;
      }
      for (let j = 0; j < rows; j++) {
        if (i % 2 === 0 && i !== 0) {
          this.addHex({ q: i, r: j - k });
        } else {
          this.addHex({ q: i, r: j - k });
        }
      }
    }
  }
}
export { HexMap };
