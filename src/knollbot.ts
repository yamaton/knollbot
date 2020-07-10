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
// Screen parameters
const ScreenWidth = 800;
const ScreenHeight = 600;
const ScreenWidthHalf = Math.floor(ScreenWidth / 2);
const ScreenHeightHalf = Math.floor(ScreenHeight / 2);
const WallThickness = 200;
const WallMargin = 100;
const WallVisible = 5;
const WallOffset = Math.floor(WallThickness / 2) - WallVisible;

// --------------------------------------
// Object parameters
const NumBoxes = 15;
// --
const MinSizeX = 30;
const MaxSizeX = 70;
const MinSizeY = 30;
const MaxSizeY = 70;

// --------------------------------------
// Physics parameters
const FrictionAir = 0.2;
const Friction = 0.01;
const AntiGravityConst = 100.0;


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
    frictionAir: FrictionAir,
    friction: Friction,
}

var boxes = Array<Matter.Body>(NumBoxes);
for (let i = 0; i < NumBoxes; i++) {
    const rectWidth = utils.randRange(MinSizeX, MaxSizeX);
    const rectHeight = utils.randRange(MinSizeY, MaxSizeY);
    const offsetX = WallOffset + rectWidth / 2;
    const offsetY = WallOffset + rectHeight / 2;
    const x = utils.randRange(offsetX, ScreenWidth - offsetX);
    const y = utils.randRange(offsetY, ScreenHeight - offsetY);
    boxes[i] = Bodies.rectangle(x, y, rectWidth, rectHeight, bodyOptions);
}


// surrounding wall
const wallOptions = {
    isStatic: true,
    friction: 0.3,
}

var wallTop = Bodies.rectangle(ScreenWidthHalf, -WallOffset, ScreenWidth + WallMargin, WallThickness, wallOptions);
var wallBottom = Bodies.rectangle(ScreenWidthHalf, ScreenHeight + WallOffset, ScreenWidth + WallMargin, WallThickness, wallOptions);
var wallLeft = Bodies.rectangle(- WallOffset, ScreenHeightHalf, WallThickness, ScreenHeight + WallMargin, wallOptions);
var wallRight = Bodies.rectangle(ScreenWidth + WallOffset, ScreenHeightHalf, WallThickness, ScreenHeight + WallMargin, wallOptions);


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
let blocks = [...boxes, wallTop, wallBottom, wallLeft, wallRight]
World.add(world, blocks);
World.add(world, mouseConstraint);


var counter = 0;
Events.on(engine, 'beforeUpdate', function (event) {
    counter += 1;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
            if (i == 0 && j == 1 && counter % 60 == 0) {
                console.log("counter: ", counter);
            }
            let src = blocks[i];
            let tgt = blocks[j];

            // tiny performance improvement
            if (src.isStatic && tgt.isStatic) continue;

            if (counter < 300) {
                // repulsive 1/r^2 force
                let d = utils.distEuclid(src.position, tgt.position);
                let antiGravityMag = AntiGravityConst / d ** 2;

                let unitSrcToTgt = utils.unitVec(src.position, tgt.position)
                let forceAntiGravity = {
                    x: antiGravityMag * unitSrcToTgt.x,
                    y: antiGravityMag * unitSrcToTgt.y,
                };
                Body.applyForce(tgt, tgt.position, forceAntiGravity);
                Body.applyForce(src, src.position, utils.negate(forceAntiGravity));

            } else {
                // long-range magnet interaction
                let [posSrcX, posTgtX, distX] = utils.cloestPointPairX(src, tgt);
                let [posSrcY, posTgtY, distY] = utils.cloestPointPairY(src, tgt);
                let coeffX = 0.0;
                if (distX < ForceRange) {
                    coeffX = (posSrcX.x < posTgtX.x) ? -1 : 1;
                    coeffX *= ForceScale;
                };
                let coeffY = 0.0;
                if (distY < ForceRange) {
                    coeffY = (posSrcY.y < posTgtY.y) ? -1 : 1;
                    coeffY *= ForceScale;
                };
                let forceOnTgtX = { x: coeffX * distX, y: 0 };
                let forceOnTgtY = { x: 0, y: coeffY * distY };

                // forces act on different points
                Body.applyForce(tgt, posTgtX, forceOnTgtX);
                Body.applyForce(src, posSrcX, utils.negate(forceOnTgtX));
                Body.applyForce(tgt, posTgtY, forceOnTgtY);
                Body.applyForce(src, posSrcY, utils.negate(forceOnTgtY));
            }
        }
    }
});


// equilvalent to Engine.run(engine)
Runner.run(runner, engine);
Render.run(render);
