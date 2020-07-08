import * as Matter from "matter-js"

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
    frictionAir: 0.01,
    friction: 0.1,
}
const NumBoxes = 5;
var boxes = Array(NumBoxes);
for (let i = 0; i < NumBoxes; i++) {
    const h = Math.floor(Math.random() * ScreenHeight + 1);
    const w = Math.floor(Math.random() * ScreenWidth + 1);
    boxes[i] = Bodies.rectangle(h, w, 80, 80, bodyOptions);
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

// add all of the bodies to the world
var elements = boxes.concat([wallTop, wallBottom, wallRight, wallLeft, mouseConstraint]);
World.add(world, elements);


var counter = 0;
Events.on(engine, 'beforeUpdate', function (event) {
    counter += 1;
    let boxA = boxes[0];
    let boxB = boxes[1];
    const dist = Vector.magnitude(Vector.sub(boxA.position, boxB.position));
    const mag = 1 / dist / dist;
    var fBtoA = Vector.mult(Vector.normalise(Vector.sub(boxA.position, boxB.position)), mag);
    var fAtoB = Vector.mult(Vector.normalise(Vector.sub(boxB.position, boxA.position)), mag);
    Body.applyForce(boxB, boxB.position, fBtoA);
    Body.applyForce(boxA, boxA.position, fAtoB);
});


// Engine.run(engine);
Runner.run(runner, engine);

Render.run(render);
