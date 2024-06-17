import { CanvasControler } from "./CanvasControler.js";
import { Hex } from "./Hex.js";
import { PathFinder } from "./PathFinder.js";
import { addWalls } from "./walls.js";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("HTMLCanvasElement does not exist");

const mapConfig = {
  cols: 32,
  rows: 12,
  hexagonSize: 32,
  hexagonColor: "#009900",
};
let hoveredHex: Hex | null = null;

const canvasControler = new CanvasControler({
  canvas,
  contextXoffset: 50,
  contextYoffset: 50,
  mapConfig,
  events: [
    {
      type: "click",
      callback: (hex, map) => {
        console.log("contextmenu");
        if (hex.isWall()) {
          hex.setType("default");
        } else {
          hex.setType("wall");
        }
        map.resetMap();
        pathFinder.findPath();
      },
    },
    {
      type: "mousemove",
      callback: (hex) => {
        if (hoveredHex != hex) {
          hoveredHex?.setHovered(false);
          hoveredHex = hex;
        }
        hex.setHovered(true);
      },
    },
    {
      type: "contextmenu",
      callback: (hex, map) => {
        map.resetMap();
        // const neighbors = map.getHexNeighbors(hex);
        // neighbors.forEach((neighbor) => {
        //   neighbor.setType("neighbor");
        // });
        pathFinder.setEndHex(hex);
      },
    },
  ],
});

const map = canvasControler.getMap();
addWalls(map);

const startHex = map.getHex({ q: 2, r: 8, s: -10 });
const endHex = map.getHex({ q: 14, r: -2, s: -12 });
if (!startHex || !endHex) throw new Error("Wrong start and end hex values!");

// const pathFinder = new PathFinder(map, startHex, endHex, "breadth-first-search");
const pathFinder = new PathFinder(map, startHex, endHex, "A*Search");
const path = pathFinder.findPath();

document.addEventListener("keydown", (e) => {
  if (e.code === "Digit1" && e.altKey) {
    map.toogleCoordinates();
  } else if (e.code === "Digit2" && e.altKey) {
    map.toggleShowType();
  } else if (e.code === "Digit3" && e.altKey) {
    map.resetMap();
    pathFinder.toggleShowSearch();
  }
});
document.addEventListener("wheel", (e) => {
  canvasControler.changeScale(-(e.deltaY / 1000));
});
