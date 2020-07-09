// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();
var world = engine.world;
// disable gravity
world.gravity.y = 0.0;
var runner = Runner.create();


const ScreenWidth = 800;
const ScreenHeight = 600;
const ScreenWidthHalf = Math.floor(ScreenWidth / 2);
const ScreenHeightHalf = Math.floor(ScreenHeight / 2);
const WallThickness = 200;
const SquareSize = 50;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: ScreenWidth,
        height: ScreenHeight,
        // showAngleIndicator: true,
        showVelocity: true,
    },
});

// create two boxes
const bodyOptions = {
    inertia: Infinity,
    frictionAir: 0.2,
    friction: 0.01,
}
const NumBoxes = 5;
var boxes = Array<Matter.Body>(NumBoxes);
for (let i = 0; i < NumBoxes; i++) {
    const h = Math.floor(Math.random() * ScreenHeight + 1);
    const w = Math.floor(Math.random() * ScreenWidth + 1);
    boxes[i] = Bodies.rectangle(h, w, SquareSize, SquareSize, bodyOptions);
}


// surrounding wall
const wallOptions = {
    isStatic: true,
    friction: 0.3,
}
var wallTop = Bodies.rectangle(ScreenWidthHalf, 0, ScreenWidth, - WallThickness * 0.2, wallOptions);
var wallBottom = Bodies.rectangle(ScreenWidthHalf, ScreenHeight, ScreenWidth, WallThickness * 0.2, wallOptions);
var wallRight = Bodies.rectangle(ScreenWidth, ScreenHeightHalf, WallThickness * 0.2, ScreenHeight, wallOptions);
var wallLeft = Bodies.rectangle(0, ScreenHeightHalf, - WallThickness * 0.2, ScreenHeight, wallOptions);


// mouse and constraint
var mouse = Mouse.create(render.canvas);
var constraint = Constraint.create(
    {
        // Must define pointA and pointB unlike IConstraintDefinition interface
        pointA: mouse.position,
        pointB: { x: 0, y: 0 },
        stiffness: 0.2,
        render: {
            visible: false,
        },
    },
);
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: constraint,
});

// add boxes, walls, and mouse constraints
World.add(world, [...boxes, wallTop, wallBottom, wallRight, wallLeft]);
World.add(world, mouseConstraint);


var counter = 0;
Events.on(engine, 'beforeUpdate', function (event) {
    counter += 1;
    let src = boxes[0];
    let tgt = boxes[1];
    let srcRightmost = utils.rightmostPoint(src.vertices);
    let tgtPos = utils.closestPointDirX(tgt.vertices, srcRightmost.x);
    let dist = Math.abs(tgtPos.x - srcRightmost.x);
    let mag = 0.005;
    let dirX = 0.0;
    if (dist < 20) {
        if (tgtPos.x > srcRightmost.x) {
            dirX = -1.0
         } else {
            dirX = 1.0;
        }
    };
    let forceOnTgt = {x: mag * dirX * dist, y: 0};
    Body.applyForce(tgt, tgtPos, forceOnTgt);
});


// equilvalent to Engine.run(engine)
Runner.run(runner, engine);
Render.run(render);
