const imgRoot = "./lego/";
const imgNames = [
    "blue_1x2.png",
    "blue_1x2.png",
    "blue_1x2.png",
    "blue_1x2.png",
    "blue_1x2.png",
    "blue_1x3.png",
    "blue_1x3.png",
    "green_1x2.png",
    "green_1x2.png",
    "green_1x2.png",
    "green_1x2.png",
    "green_2x2.png",
    "green_2x2.png",
    "orange_2x1.png",
    "orange_2x1.png",
    "orange_2x1.png",
    "orange_2x1.png",
    "orange_2x1.png",
    "orange_2x1.png",
    "orange_2x3.png",
    "orange_2x3.png",
    "red_1x4.png",
    "red_1x4.png",
    "red_1x4.png",
    "red_2x2.png",
    "red_2x2.png",
    "yellow_2x1.png",
    "yellow_2x1.png",
    "yellow_2x1.png",
    "yellow_2x1.png",
    "yellow_2x1.png",
    "yellow_3x2.png",
    "yellow_3x2.png",
    "yellow_3x2.png"
];

export const imgPaths = imgNames.map(name => imgRoot + name);

export const params = {
    // Body parameters
    frictionAir: 0.12,
    friction: 0.003,
    wallFriction: 0.01,

    // Global random poking
    pokeScale: 0.05,
    pokeDecay: 0.94,  // multiplier after 10 counts

    // Alignment force
    alignmentForceCoeff: 0.0010,    // in force/pixel
    alignmentForceRange: 20,        // pixels
    alignmentForceWallRange: 20,    // pixels
    alignmentForceOffset: 0.007,    // in force

    // AntiGravity force
    repulsionCoeff: 100,
    repulsionRange: 3.0,      // NOT pixels

    // Grouping attraction/repulsion
    groupingCoeff: 400,

    // Alignment line colors
    colorLinesVertical: '#EF6B22',
    colorLinesHorizontal: '#F29089',

}
