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


// --------------------------------------
//   Long-distance action 
const ForceScale = 0.0005;
const ForceRange = 25;  // in pixels


// --------------------------------------
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
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            let src = boxes[i];
            let tgt = boxes[j];
            let [posSrc, posTgt, dist] = utils.cloestPointPairX(src, tgt);
            let coeffX = 0.0;
            if (dist < ForceRange) {
                coeffX = (posSrc.x < posTgt.x) ? -1 : 1;
                coeffX *= ForceScale;
            };
            let forceOnTgt = {x: coeffX * dist, y: 0};
            let forceOnSrc = {x: -forceOnTgt.x, y: -forceOnTgt.y};
            Body.applyForce(tgt, posTgt, forceOnTgt);
            Body.applyForce(src, posSrc, forceOnSrc);
        }
    }

    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            let src = boxes[i];
            let tgt = boxes[j];
            let [posSrc, posTgt, dist] = utils.cloestPointPairY(src, tgt);
            let coeffX = 0.0;
            if (dist < ForceRange) {
                coeffX = (posSrc.y < posTgt.y) ? -1 : 1;
                coeffX *= ForceScale;
            };
            let forceOnTgt = {x: 0, y: coeffX * dist};
            let forceOnSrc = {x: -forceOnTgt.x, y: -forceOnTgt.y};
            Body.applyForce(tgt, posTgt, forceOnTgt);
            Body.applyForce(src, posSrc, forceOnSrc);
        }
    }
});


// equilvalent to Engine.run(engine)
Runner.run(runner, engine);
Render.run(render);
