class Hex {
    constructor(ctx, position, size, //Radius of outer circle
    showCoordinates = false, color) {
        this.ctx = ctx;
        this.position = position;
        this.size = size;
        this.showCoordinates = showCoordinates;
        this.color = color;
        this.isHovered = false;
        this.type = "default";
        this.showType = false;
        if (position.q + position.r + position.s !== 0)
            throw new Error("Invalid coordinates");
        this.colors = {
            default: this.color,
            start: "#163e63",
            end: "#800020",
            frontier: "#a1b1c0",
            reached: "#4682B4",
            path: "#D3D3D3",
            neighbor: "#99324c",
            wall: "#36454F",
        };
    }
    draw() {
        const ctx = this.ctx;
        const { x, y } = Hex.flat_hex_to_pixel(this);
        const triangleHeight = (this.size * Math.sqrt(3)) / 2;
        ctx.moveTo(x - this.size / 2, y + triangleHeight);
        ctx.beginPath();
        ctx.lineTo(x + this.size / 2, y + triangleHeight);
        ctx.lineTo(x + this.size, y);
        ctx.lineTo(x + this.size / 2, y - triangleHeight);
        ctx.lineTo(x - this.size / 2, y - triangleHeight);
        ctx.lineTo(x - this.size, y);
        ctx.lineTo(x - this.size / 2, y + triangleHeight);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.filter = this.isHovered ? "brightness(120%)" : "brightness(100%)";
        ctx.fill();
        if (this.showCoordinates) {
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${this.position.q}, ${this.position.r}, ${this.position.s}`, x, y);
        }
        else if (this.showType) {
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.type, x, y);
        }
    }
    setHovered(isHovered) {
        this.isHovered = isHovered;
        this.draw();
    }
    changeColor(color) {
        this.color = color;
        this.draw();
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
        this.changeColor(this.colors[this.type]);
    }
    toogleCoordinates() {
        this.showCoordinates = !this.showCoordinates;
        this.showType = false;
    }
    toggleShowType() {
        this.showType = !this.showType;
        this.showCoordinates = false;
    }
    isWall() {
        return this.type === "wall";
    }
    changeSize(size) {
        this.size = size;
    }
    static flat_hex_to_pixel(hex) {
        const { q, r } = hex.position;
        const x = hex.size * ((3 / 2) * q);
        const y = hex.size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
        return { x, y };
    }
    static pixel_to_flat_hex(pixel, hexSize) {
        const { x, y } = pixel;
        const q = ((2 / 3) * x) / hexSize;
        const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / hexSize;
        const s = -q - r;
        return Hex.cube_round({ q, r, s });
    }
    static cube_round(frac) {
        let q = Math.round(frac.q);
        let r = Math.round(frac.r);
        let s = Math.round(frac.s);
        const q_diff = Math.abs(q - frac.q);
        const r_diff = Math.abs(r - frac.r);
        const s_diff = Math.abs(s - frac.s);
        if (q_diff > r_diff && q_diff > s_diff) {
            q = -r - s;
        }
        else if (r_diff > s_diff) {
            r = -q - s;
        }
        else {
            s = -q - r;
        }
        return { q, r, s };
    }
}
export { Hex };
