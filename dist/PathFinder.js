class PathFinder {
    constructor(map, startHex, endHex, algorithm, showSearch = false) {
        this.map = map;
        this.startHex = startHex;
        this.endHex = endHex;
        this.algorithm = algorithm;
        this.showSearch = showSearch;
        startHex.setType("start");
        endHex.setType("end");
    }
    findPath(startHex, endHex) {
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
    toggleShowSearch() {
        this.showSearch = !this.showSearch;
        this.findPath();
    }
    aStarSearch() {
        const frontier = new PriorityQueue();
        frontier.put(this.startHex, 0);
        const cameFrom = new Dictionary();
        const costSoFar = new Dictionary();
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
    breadthFirstSearch() {
        const frontier = [this.startHex];
        const cameFrom = new Dictionary();
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
    getPath(cameFrom) {
        const path = [this.startHex];
        let currentHex = this.endHex;
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
    getDistance(hex1, hex2) {
        return ((Math.abs(hex1.position.q - hex2.position.q) +
            Math.abs(hex1.position.r - hex2.position.r) +
            Math.abs(hex1.position.s - hex2.position.s)) /
            2);
    }
    setStartHex(hex) {
        this.startHex?.setType("default");
        this.startHex = hex;
        hex.setType("start");
    }
    setEndHex(hex) {
        this.endHex?.setType("default");
        this.endHex = hex;
        hex.setType("end");
        this.findPath();
    }
}
export { PathFinder };
class PriorityQueue {
    constructor() {
        this.queue = [];
        this.length = 0;
    }
    put(hex, priority) {
        this.length++;
        this.queue.push({ value: hex, priority: priority });
        this.queue.sort((a, b) => b.priority - a.priority);
    }
    get() {
        this.length--;
        return this.queue.pop()?.value;
    }
}
class Dictionary {
    constructor() {
        this.list = [];
    }
    push(hex, value) {
        if (!this.list.some((node) => node.key === hex)) {
            this.list.push({ key: hex, value: value });
        }
        else {
            throw new Error("Trying to push duplicate");
        }
    }
    find(hex) {
        return this.list.find((node) => node.key === hex) || null;
    }
    some(hex) {
        return this.list.some((node) => node.key === hex);
    }
}
