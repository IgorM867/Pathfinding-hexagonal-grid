import { Hex } from "./Hex";
import { HexMap } from "./HexMap";

type Algorithms = "breadth-first-search" | "A*Search";

class PathFinder {
  constructor(
    private map: HexMap,
    private startHex: Hex,
    private endHex: Hex,
    private algorithm: Algorithms,
    private showSearch: boolean = false
  ) {
    startHex.setType("start");
    endHex.setType("end");
  }

  public findPath(startHex?: Hex, endHex?: Hex) {
    if (startHex) {
      this.setStartHex(startHex);
    }
    if (endHex) {
      this.setEndHex(endHex);
    }

    switch (this.algorithm) {
      case "breadth-first-search":
        return this.breadthFirstSearch();
      case "A*Search":
        return this.aStarSearch();
    }
  }
  public toggleShowSearch(): void {
    this.showSearch = !this.showSearch;
    this.findPath();
  }
  private aStarSearch(): Hex[] {
    const frontier = new PriorityQueue();
    frontier.put(this.startHex, 0);
    const cameFrom = new Dictionary<Hex>();
    const costSoFar = new Dictionary<number>();
    cameFrom.push(this.startHex, null);
    costSoFar.push(this.startHex, 0);

    while (frontier.length > 0) {
      const currentHex = frontier.get();
      if (currentHex === this.endHex) {
        return this.getPath(cameFrom);
      }

      if (currentHex) {
        if (this.startHex !== currentHex && this.showSearch) {
          currentHex.setType("reached");
        }

        this.map.getHexNeighbors(currentHex).forEach((hex) => {
          const currCostSoFar = costSoFar.find(hex)?.value ?? 0;
          const newCost = currCostSoFar + 1;
          if (!costSoFar.some(hex) || newCost < currCostSoFar) {
            costSoFar.push(hex, newCost);

            const priority = newCost + this.getDistance(this.endHex, hex);
            frontier.put(hex, priority);
            if (this.endHex !== hex && this.showSearch) {
              hex.setType("frontier");
            }

            cameFrom.push(hex, currentHex);
          }
        });
      }
    }

    return [];
  }
  private breadthFirstSearch(): Hex[] {
    const frontier = [this.startHex];
    const cameFrom = new Dictionary<Hex>();
    cameFrom.push(this.startHex, null);

    while (frontier.length > 0) {
      const currentHex = frontier.shift();
      if (currentHex === this.endHex) {
        return this.getPath(cameFrom);
      }

      if (currentHex) {
        if (this.startHex !== currentHex) {
          currentHex.setType("reached");
        }

        this.map.getHexNeighbors(currentHex).forEach((hex) => {
          if (!cameFrom.some(hex) && !frontier.includes(hex)) {
            frontier.push(hex);
            if (this.endHex !== hex) {
              hex.setType("frontier");
            }

            cameFrom.push(hex, currentHex);
          }
        });
      }
    }

    return [];
  }
  private getPath(cameFrom: Dictionary<Hex>): Hex[] {
    const path: Hex[] = [this.startHex];
    let currentHex: Hex = this.endHex;
    while (currentHex !== this.startHex) {
      if (currentHex !== this.endHex) {
        currentHex.setType("path");
      }
      path.push(currentHex);
      const hex = cameFrom.find(currentHex) || null;
      if (hex && hex.value) {
        currentHex = hex.value;
      }
    }
    return path;
  }
  public getDistance(hex1: Hex, hex2: Hex): number {
    return (
      (Math.abs(hex1.position.q - hex2.position.q) +
        Math.abs(hex1.position.r - hex2.position.r) +
        Math.abs(hex1.position.s - hex2.position.s)) /
      2
    );
  }
  public setStartHex(hex: Hex) {
    this.startHex?.setType("default");
    this.startHex = hex;
    hex.setType("start");
  }
  public setEndHex(hex: Hex) {
    this.endHex?.setType("default");
    this.endHex = hex;
    hex.setType("end");

    this.findPath();
  }
}

export { PathFinder };

type PriorityQueueNode = {
  value: Hex;
  priority: number;
};

class PriorityQueue {
  private queue: PriorityQueueNode[] = [];
  public length: number = 0;
  constructor() {}

  public put(hex: Hex, priority: number) {
    this.length++;
    this.queue.push({ value: hex, priority: priority });
    this.queue.sort((a, b) => b.priority - a.priority);
  }
  public get() {
    this.length--;
    return this.queue.pop()?.value;
  }
}
type DictionaryNode<T> = {
  key: Hex;
  value: T | null;
};

class Dictionary<T> {
  private list: DictionaryNode<T>[] = [];
  constructor() {}

  public push(hex: Hex, value: T | null) {
    if (!this.list.some((node) => node.key === hex)) {
      this.list.push({ key: hex, value: value });
    } else {
      throw new Error("Trying to push duplicate");
    }
  }
  public find(hex: Hex): DictionaryNode<T> | null {
    return this.list.find((node) => node.key === hex) || null;
  }
  public some(hex: Hex): boolean {
    return this.list.some((node) => node.key === hex);
  }
}
