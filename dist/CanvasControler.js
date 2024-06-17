import { Hex } from "./Hex.js";
import { HexMap } from "./HexMap.js";
class CanvasControler {
    constructor({ canvas, contextXoffset, contextYoffset, mapConfig, events, }) {
        this.scale = 1;
        this.cursor = {
            x: 0,
            y: 0,
        };
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Cannot create canvas context");
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
    getContext() {
        return this.ctx;
    }
    getMap() {
        return this.map;
    }
    changeScale(change) {
        this.scale += change;
        if (this.scale < 0.5) {
            this.scale = 0.5;
        }
        else if (this.scale > 2) {
            this.scale = 2;
        }
        else {
            this.map.changeHexagonSize(this.scale * this.hexSize);
        }
    }
}
export { CanvasControler };
