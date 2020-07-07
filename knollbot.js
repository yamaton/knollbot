// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
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
        showAngleIndicator: true,
        showVelocity: true,
    },
});

// create two boxes and a ground
const bodyOptions = {
    inertia: Infinity,
    frictionAir: 0.01,
    friction: 0.1,
}
var boxA = Bodies.rectangle(100, 200, 80, 80, bodyOptions);
var boxB = Bodies.rectangle(250, 250, 80, 80, bodyOptions);
var boxC = Bodies.rectangle(450, 300, 80, 80, bodyOptions);
// Body.applyForce(boxB, boxB.position, { x: 0.4, y: -0.1 });


// Body.applyForce(boxB, boxB.position, {x: force.x, y: force.y});


// walls
const wallOptions = {
    isStatic: true,
    friction: 0.3,
}
var wallTop = Bodies.rectangle(ScreenWidthHalf, 0, ScreenWidth, - WallThickness * 0.2, { isStatic: true });
var wallBottom = Bodies.rectangle(ScreenWidthHalf, ScreenHeight, ScreenWidth, WallThickness * 0.2, { isStatic: true });
var wallRight = Bodies.rectangle(ScreenWidth, ScreenHeightHalf, WallThickness * 0.2, ScreenHeight, { isStatic: true });
var wallLeft = Bodies.rectangle(0, ScreenHeightHalf, - WallThickness * 0.2, ScreenHeight, { isStatic: true });

// mouse and constraint
var mouse = Mouse.create(render.canvas);
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});


// add all of the bodies to the world
World.add(world, [boxA, boxB, boxC, wallTop, wallBottom, wallRight, wallLeft, mouseConstraint]);


var counter = 0;
Events.on(engine, 'beforeUpdate', function (event) {
    counter += 1;
    const dist = Vector.magnitude(Vector.sub(boxA.position, boxB.position));
    const mag = 1 / dist / dist;
    var fBtoA = Vector.mult(Vector.normalise(Vector.sub(boxA.position, boxB.position)), mag);
    var fAtoB = Vector.mult(Vector.normalise(Vector.sub(boxB.position, boxA.position)), mag);
    Body.applyForce(boxB, boxB.position, fBtoA);
    Body.applyForce(boxA, boxA.position, fAtoB);
});


// Engine.run(engine);
Runner.run(runner, engine);

render.mouse = mouse;
Render.run(render);
