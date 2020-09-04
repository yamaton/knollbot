const imgRoot = "./public/lego/";
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
    frictionAir: 0.01,
    friction: 0.0,
    wallFriction: 0.01,

    // Global random poking
    pokeScale: 0.05,
    pokeScaleDecay: 0.95,  // multiplier after 10 counts

    // Alignment force
    alignmentForceCoeff: 0.0010,
    alignmentForceRange: 30,  // pixels

    // AntiGravity force
    repulsionCoeff: 100,
    repulsionRange: 3.0,      // NOT pixels

    // Grouping attraction/repulsion
    groupingCoeff: 400,

}
