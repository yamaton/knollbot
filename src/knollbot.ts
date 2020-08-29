namespace knollbot {

    export const main = () => {

        const imgPaths = [
            "./public/lego/blue_1x2.png",
            "./public/lego/blue_1x2.png",
            "./public/lego/blue_1x2.png",
            "./public/lego/blue_1x2.png",
            "./public/lego/blue_1x2.png",
            "./public/lego/blue_1x3.png",
            "./public/lego/blue_1x3.png",
            "./public/lego/green_1x2.png",
            "./public/lego/green_1x2.png",
            "./public/lego/green_1x2.png",
            "./public/lego/green_1x2.png",
            "./public/lego/green_2x2.png",
            "./public/lego/green_2x2.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x1.png",
            "./public/lego/orange_2x3.png",
            "./public/lego/orange_2x3.png",
            "./public/lego/red_1x4.png",
            "./public/lego/red_1x4.png",
            "./public/lego/red_1x4.png",
            "./public/lego/red_2x2.png",
            "./public/lego/red_2x2.png",
            "./public/lego/yellow_2x1.png",
            "./public/lego/yellow_2x1.png",
            "./public/lego/yellow_2x1.png",
            "./public/lego/yellow_2x1.png",
            "./public/lego/yellow_2x1.png",
            "./public/lego/yellow_3x2.png",
            "./public/lego/yellow_3x2.png",
            "./public/lego/yellow_3x2.png",
        ]

        // const imgPaths = [
        //     './public/images/drivers.jpg',
        //     './public/images/mouse.jpg',
        //     './public/images/mousepad.jpg',
        //     './public/images/purse.jpg',
        //     './public/images/sdreader.jpg',
        //     './public/images/sphero.jpg',
        //     './public/images/wipe.jpg',
        //     './public/images/lego_11-hole-beam.png',
        //     './public/images/lego_11-hole-beam.png',
        //     './public/images/lego_13-hole-beam.png',
        //     './public/images/lego_13-hole-beam.png',
        //     './public/images/lego_3d-joint.png',
        //     './public/images/lego_3d-joint.png',
        //     './public/images/lego_5-hole-beam.png',
        //     './public/images/lego_5-hole-beam.png',
        //     './public/images/lego_5-hole-beam.png',
        //     './public/images/lego_beige-pin.png',
        //     './public/images/lego_beige-pin.png',
        //     './public/images/lego_beige-pin.png',
        //     './public/images/lego_beige-pin.png',
        //     './public/images/lego_beige-pin.png',
        //     './public/images/lego_blue-pin.png',
        //     './public/images/lego_blue-pin.png',
        //     './public/images/lego_blue-pin.png',
        //     './public/images/lego_blue-pin.png',
        //     './public/images/lego_blue-pin.png',
        //     './public/images/lego_black-pin.png',
        //     './public/images/lego_black-pin.png',
        // ]

        interface WorldExtended extends Matter.World {
            pokeScale: number;
            alignmentForceCoeff: number;
            alignmentForceRange: number;
            repulsionCoeff: number;
            repulsionRange: number;
            groupingCoeff: number;
        }

        // module aliases
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const Runner = Matter.Runner;
        const Constraint = Matter.Constraint;
        const MouseConstraint = Matter.MouseConstraint;
        const Events = Matter.Events;
        const Mouse = Matter.Mouse;
        const World = Matter.World;
        const Bodies = Matter.Bodies;
        const Body = Matter.Body;

        // create an engine and runner
        const engine = Engine.create();
        const world = engine.world as WorldExtended;
        const runner = Runner.create();

        // disable gravity
        world.gravity.y = 0.0;


        // --------------------------------------
        // Screen parameters
        const ScreenWidth = document.documentElement.clientWidth - 20;
        const ScreenHeight = document.documentElement.clientHeight - 20;
        const ScreenWidthHalf = Math.floor(ScreenWidth / 2);
        const ScreenHeightHalf = Math.floor(ScreenHeight / 2);

        // Wall parameters
        const WallThickness = 200;
        const WallMargin = 100;
        const WallVisible = 5;
        const WallOffset = Math.floor(WallThickness / 2) - WallVisible;

        // --------------------------------------
        // Object parameters
        const NumBoxes = imgPaths.length;

        // --------------------------------------
        // Body parameters
        const FrictionAir = 0.0;
        const Friction = 0.0;
        const WallFriction = 0.01;

        // Random poking
        world.pokeScale = 0.05;

        // Alignment force
        world.alignmentForceCoeff = 0.0010;
        world.alignmentForceRange = 30;  // pixels

        // AntiGravity force
        world.repulsionCoeff = 100;
        world.repulsionRange = 3.0;      // NOT pixels

        // Grouping attraction/repulsion
        world.groupingCoeff = 400;

        // --------------------------------------
        // create a renderer
        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: ScreenWidth,
                height: ScreenHeight,
                // showAngleIndicator: true,
                showVelocity: false,
                wireframes: false,    // required to enable sprites!
                background: '#247c41',
            },
        });

        // create two boxes
        const bodyOptions = {
            inertia: Infinity,
            frictionAir: FrictionAir,
            friction: Friction,
        };

        // // generate boxes randomly
        // const generateRandomBoxes = (): Matter.Body[] => {
        //     const allSquare = false;
        //     const MinSizeX = 30;
        //     const MaxSizeX = 170;
        //     const MinSizeY = 30;
        //     const MaxSizeY = 170;
        //     const UnitSize = 16;

        //     const boxes = Array<Matter.Body>(NumBoxes);
        //     for (let i = 0; i < NumBoxes; i++) {
        //         const rectWidth = utils.randRange(MinSizeX, MaxSizeX, UnitSize);
        //         let rectHeight = rectWidth;
        //         if (!allSquare) {
        //             rectHeight = utils.randRange(MinSizeY, MaxSizeY, UnitSize);
        //         }
        //         const offsetX = WallOffset + rectWidth / 2;
        //         const offsetY = WallOffset + rectHeight / 2;
        //         const x = utils.randRange(offsetX, ScreenWidth - offsetX);
        //         const y = utils.randRange(offsetY, ScreenHeight - offsetY);
        //         boxes[i] = Bodies.rectangle(x, y, rectWidth, rectHeight, bodyOptions);
        //     }
        //     return boxes;
        // };


        const setBox = (imgPath: string, idx: number) => {
            let img = new Image();
            img.addEventListener('load', () => {
                let offsetX = WallOffset + img.width / 2;
                let offsetY = WallOffset + img.height / 2;
                let x = utils.randRange(offsetX, ScreenWidth - offsetX);
                let y = utils.randRange(offsetY, ScreenHeight - offsetY);
                let options = {
                    ...bodyOptions,
                    render: {
                        sprite: {
                            texture: imgPath,
                        }
                    }
                }
                boxes[idx] = Bodies.rectangle(x, y, img.width, img.height, options);
            });
            img.src = imgPath;
        }

        const boxes = Array<Matter.Body>(NumBoxes);
        imgPaths.forEach((imgPath, i) => {
            setBox(imgPath, i);
        })


        // surrounding wall
        const wallOptions = {
            isStatic: true,
            friction: WallFriction,
        }

        const wallTop = Bodies.rectangle(ScreenWidthHalf, -WallOffset, ScreenWidth + WallMargin, WallThickness, wallOptions);
        const wallBottom = Bodies.rectangle(ScreenWidthHalf, ScreenHeight + WallOffset, ScreenWidth + WallMargin, WallThickness, wallOptions);
        const wallLeft = Bodies.rectangle(- WallOffset, ScreenHeightHalf, WallThickness, ScreenHeight + WallMargin, wallOptions);
        const wallRight = Bodies.rectangle(ScreenWidth + WallOffset, ScreenHeightHalf, WallThickness, ScreenHeight + WallMargin, wallOptions);


        // mouse and constraint
        const mouse = Mouse.create(render.canvas);
        const constraint = Constraint.create(
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
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: constraint,
        });

        // `blocks` is to contain boxes, walls, and mouse constraints
        var blocks: Matter.Body[];


        const applyAntiGravityVector = (src: Matter.Body, tgt: Matter.Body) => {
            const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => {
                return repulsion.antiGravityRanged(s, t, world.repulsionCoeff, world.repulsionRange);
            };

            // wall should not be involved
            if (!src.isStatic && !tgt.isStatic) {
                let forceAntiGravity = f(src, tgt);
                // antigravity exerts on the center of a block
                Body.applyForce(tgt, tgt.position, forceAntiGravity);
                Body.applyForce(src, src.position, utils.negate(forceAntiGravity));
            }
        }


        const applyAntiGravityDisjoint = (blocks: Matter.Body[], ufX: unionfind.UnionFind, ufY: unionfind.UnionFind) => {
            const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => {
                return repulsion.antiGravityRanged(s, t, world.repulsionCoeff, world.repulsionRange);
            };

            for (let i = 0; i < blocks.length; i++) {
                for (let j = i + 1; j < blocks.length; j++) {
                    let src = blocks[i];
                    let tgt = blocks[j];
                    if (!src.isStatic && !tgt.isStatic) {
                        let force = f(src, tgt);
                        if (ufX.areConnected(i, j)) {
                            force.x = 0;
                        }
                        if (ufY.areConnected(i, j)) {
                            force.y = 0;
                        }
                        Body.applyForce(tgt, tgt.position, force)
                        Body.applyForce(src, src.position, utils.negate(force));
                    }
                }
            }
        }


        const applyRandomPoke = (block: Matter.Body) => {
            if (!block.isStatic) {
                Body.applyForce(block, block.position,
                    {
                        x: world.pokeScale * utils.randn(),
                        y: world.pokeScale * utils.randn(),
                    });
            }
        }


        interface EdgeExtended extends graph.Edge {
            posSrc: utils.Vector;
            posTgt: utils.Vector;
            idxSrc: number;
            idxTgt: number;
        }


        interface GraphExtended extends graph.Graph {
            edges: EdgeExtended[];
        }


        type IPointPairFunc = (body1: Matter.Body, body2: Matter.Body) => [utils.Vector, utils.Vector, number];

        const createAlignmentGraphMeta = (blocks: Matter.Body[], pointPairFunc: IPointPairFunc): GraphExtended => {
            let edges: EdgeExtended[] = [];
            for (let i = 0; i < blocks.length; i++) {
                for (let j = i + 1; j < blocks.length; j++) {
                    let src = blocks[i];
                    let tgt = blocks[j];
                    let [posSrc, posTgt, dist] = pointPairFunc(src, tgt);
                    if (dist < world.alignmentForceRange && (!src.isStatic || !tgt.isStatic)) {
                        let e: EdgeExtended = {
                            weight: dist,
                            pair: utils.makeUnorderedPair(i, j),
                            posSrc: posSrc,
                            posTgt: posTgt,
                            idxSrc: i,
                            idxTgt: j,
                        }
                        edges.push(e);
                    }
                }
            }
            let g: GraphExtended = {
                vertices: utils.range(blocks.length),
                edges: edges,
            }
            return g;
        }

        const createAlignmentGraphX = (blocks: Matter.Body[]): GraphExtended => {
            return createAlignmentGraphMeta(blocks, utils.cloestPointPairX);
        }
        const createAlignmentGraphY = (blocks: Matter.Body[]): GraphExtended => {
            return createAlignmentGraphMeta(blocks, utils.cloestPointPairY);
        }

        const applyAlignmentForceX = (blocks: Matter.Body[], edge: EdgeExtended) => {
            let sign = (edge.posSrc.x < edge.posTgt.x) ? -1 : 1;
            let dist = edge.weight;
            let force = world.alignmentForceCoeff * sign * dist;
            let forceOnTgt = { x: force, y: 0 };
            let src = blocks[edge.idxSrc];
            let tgt = blocks[edge.idxTgt];
            Body.applyForce(tgt, tgt.position, forceOnTgt);
            Body.applyForce(src, src.position, utils.negate(forceOnTgt));
        }

        const applyAlignmentForceY = (blocks: Matter.Body[], edge: EdgeExtended) => {
            let sign = (edge.posSrc.y < edge.posTgt.y) ? -1 : 1;
            let dist = edge.weight;
            let force = world.alignmentForceCoeff * sign * dist;
            let forceOnTgt = { x: 0, y: force };
            let i = edge.idxSrc;
            let j = edge.idxTgt;
            let src = blocks[i];
            let tgt = blocks[j];
            Body.applyForce(tgt, tgt.position, forceOnTgt);
            Body.applyForce(src, src.position, utils.negate(forceOnTgt));
        }


        const applyGrouping = (src: Matter.Body, tgt: Matter.Body) => {
            const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => repulsion.antiGravity(s, t, world.groupingCoeff);

            // wall should not be involved
            if (!src.isStatic && !tgt.isStatic) {
                let forceAntiGravity = f(src, tgt);

                // exert attractive force if blocks are of the same group
                if (utils.areSameWidth(src, tgt) || utils.areSameHeight(src, tgt)) {
                    forceAntiGravity = utils.negate(forceAntiGravity);
                }
                // antigravity exerts on the center of a block
                Body.applyForce(tgt, tgt.position, forceAntiGravity);
                Body.applyForce(src, src.position, utils.negate(forceAntiGravity));
            }
        }


        var counter = 0;
        Events.on(engine, 'beforeUpdate', (event: Matter.Events) => {
            counter += 1;
            if (counter % 300 == 0) {
                console.log("counter: ", counter);
            }

            if (counter < 180) {
                for (let i = 0; i < blocks.length; i++) {
                    for (let j = i + 1; j < blocks.length; j++) {
                        applyGrouping(blocks[i], blocks[j]);
                    }
                }
            } else if (counter < 240) {
                for (let i = 0; i < blocks.length; i++) {
                    for (let j = i + 1; j < blocks.length; j++) {
                        applyAntiGravityVector(blocks[i], blocks[j]);
                    }
                }
            } else {
                // after 60 frames
                let gX = createAlignmentGraphX(blocks);
                let gY = createAlignmentGraphY(blocks);
                let edgeMstX = graph.kruskal(gX) as EdgeExtended[];
                let edgeMstY = graph.kruskal(gY) as EdgeExtended[];

                // alignment force occurs at MST edges only
                edgeMstX.forEach(e => applyAlignmentForceX(blocks, e));
                edgeMstY.forEach(e => applyAlignmentForceY(blocks, e));

                // antigravity force occurs at disconnected nodes
                let ufX = new unionfind.UnionFind(gX.vertices);
                gX.edges.forEach(e => { ufX.connect(e.idxSrc, e.idxTgt) });
                let ufY = new unionfind.UnionFind(gY.vertices);
                gY.edges.forEach(e => { ufY.connect(e.idxSrc, e.idxTgt) });
                applyAntiGravityDisjoint(blocks, ufX, ufY);
            }

            blocks.forEach(applyRandomPoke);
        });

        const setupWorld = () => {
            setTimeout(() => {
                blocks = [...boxes, wallTop, wallBottom, wallLeft, wallRight]
                World.add(world, blocks);
                World.add(world, mouseConstraint);
                Runner.run(runner, engine);
                Render.run(render);
            }, 100);
        }

        setupWorld();

        // Rotate a block by double clicking
        document.addEventListener('dblclick', () => {
            console.log(`--- Double click at t=${counter} ---`);
            blocks
                .filter(b => (!b.isStatic) && Matter.Bounds.contains(b.bounds, mouse.position))
                .forEach(b => Matter.Body.rotate(b, Math.PI / 2));
        });

        // Rotate a block by touch rotation
        document.addEventListener('touchmove', (e) => {
            let touch = e.changedTouches.item(0);
            let angleInRadian = Math.PI / 180 * (touch?.rotationAngle ?? 0);
            console.log(`--- Touch rotation activated at t=${counter} ---`);
            console.log(`    rotation angle = ${touch?.rotationAngle} (deg)`)
            blocks
                .filter(b => (!b.isStatic) && Matter.Bounds.contains(b.bounds, mouse.position))
                .forEach(b => Matter.Body.rotate(b, angleInRadian));
        });

        return {
            engine: engine,
            runner: runner,
            render: render,
            canvas: render.canvas,
            stop: () => {
                Matter.Render.stop(render);
                Matter.Runner.stop(runner);
            }
        };

    }
}

knollbot.main();
