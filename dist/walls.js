function addWalls(map) {
    const wallsCoordinates = [
        { q: 10, r: 1, s: -11 },
        { q: 11, r: 0, s: -11 },
        { q: 11, r: -1, s: -10 },
        { q: 11, r: -2, s: -9 },
        { q: 5, r: 7, s: -12 },
        { q: 5, r: 6, s: -11 },
        { q: 4, r: 6, s: -10 },
        { q: 8, r: 5, s: -13 },
        { q: 6, r: 7, s: -13 },
        { q: 8, r: 4, s: -12 },
        { q: 8, r: 3, s: -11 },
        { q: 8, r: 2, s: -10 },
        { q: 6, r: 8, s: -14 },
        { q: 12, r: 0, s: -12 },
        { q: 12, r: 1, s: -13 },
        { q: 6, r: 3, s: -9 },
        { q: 5, r: 3, s: -8 },
        { q: 12, r: 2, s: -14 },
        { q: 8, r: 1, s: -9 },
        { q: 8, r: 0, s: -8 },
        { q: 4, r: 3, s: -7 },
        { q: 11, r: 4, s: -15 },
        { q: 14, r: 1, s: -15 },
        { q: 11, r: 3, s: -14 },
        { q: 7, r: 0, s: -7 },
        { q: 3, r: 3, s: -6 },
        { q: 11, r: 5, s: -16 },
        { q: 2, r: 3, s: -5 },
        { q: 11, r: 6, s: -17 },
        { q: 7, r: -1, s: -6 },
        { q: 7, r: -2, s: -5 },
        { q: 1, r: 3, s: -4 },
        { q: 11, r: -3, s: -8 },
        { q: 9, r: -3, s: -6 },
        { q: 9, r: -4, s: -5 },
    ];
    wallsCoordinates.forEach((position) => {
        map.getHex(position)?.setType("wall");
    });
}
export { addWalls };
