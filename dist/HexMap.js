import { Hex } from "./Hex.js";
class HexMap {
    constructor(canvas, canvasOffset, ctx, { hexagonSize, rows, cols, hexagonColor, showCoordinates }) {
        this.map = new Map();
        this.showType = false;
        this.cubeDirectionsVectors = [
            [+1, 0, -1],
            [+1, -1, 0],
            [0, -1, +1],
            [-1, 0, +1],
            [-1, +1, 0],
            [0, +1, -1],
        ];
        this.canvas = canvas;
        this.canvasOffset = canvasOffset;
        this.ctx = ctx;
        this.hexagonSize = hexagonSize;
        this.showCoordinates = showCoordinates || false;
        this.hexagonColor = hexagonColor;
        this.createMap(rows, cols);
    }
    getHex(position) {
        return this.map.get(JSON.stringify(position)) || null;
    }
    draw() {
        this.ctx.clearRect(-this.canvasOffset, -this.canvasOffset, this.canvas.width, this.canvas.height);
        this.map.forEach((hex) => {
            hex.draw();
        });
    }
    getHexNeighbors(hex) {
        const neighbors = [];
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
    toogleCoordinates() {
        this.showCoordinates = !this.showCoordinates;
        this.map.forEach((hex) => {
            hex.toogleCoordinates();
        });
        this.draw();
    }
    toggleShowType() {
        this.showType = !this.showType;
        this.map.forEach((hex) => {
            hex.toggleShowType();
        });
        this.showCoordinates = false;
        this.draw();
    }
    resetMap() {
        this.map.forEach((hex) => {
            if (hex.getType() === "start" || hex.getType() === "end" || hex.getType() === "wall")
                return;
            hex.setType("default");
        });
    }
    changeHexagonSize(size) {
        this.hexagonSize = size;
        this.map.forEach((hex) => {
            hex.changeSize(size);
        });
        this.draw();
    }
    addHex(position) {
        const { q, r } = position;
        const s = -q - r;
        const newHex = new Hex(this.ctx, { q, r, s }, this.hexagonSize, this.showCoordinates, this.hexagonColor);
        this.map.set(JSON.stringify(newHex.position), newHex);
        return newHex;
    }
    createMap(rows, cols) {
        let k = 0;
        for (let i = 0; i < cols; i++) {
            if (i % 2 === 0 && i !== 0) {
                k++;
            }
            for (let j = 0; j < rows; j++) {
                if (i % 2 === 0 && i !== 0) {
                    this.addHex({ q: i, r: j - k });
                }
                else {
                    this.addHex({ q: i, r: j - k });
                }
            }
        }
    }
}
export { HexMap };
