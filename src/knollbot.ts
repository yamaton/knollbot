import Matter from "matter-js";
import p5 from "p5";

import { WorldExtended } from "./exttypes";
import { imgPaths, params } from "./config";
import * as utils from "./utils";
import * as repulsion from "./repulsion";
import * as grouping from "./grouping";
import * as poke from "./randompokes";
import * as align from "./alignment2";


export namespace Knollbot {

    export const run = (p: any) => {

        // create an engine and runner
        const engine = Matter.Engine.create();
        const world = engine.world as WorldExtended;
        const runner = Matter.Runner.create();

        // enable force by default
        world.forceOn = true;

        // enable poking by default
        world.pokeEnabled = false;

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
        // Random poking
        world.pokeScale = params.pokeScale;
        world.pokeDecay = params.pokeDecay;

        // Alignment force
        world.alignmentForceCoeff = params.alignmentForceCoeff;
        world.alignmentForceRange = params.alignmentForceRange;  // pixels
        world.alignmentForceWallRange = params.alignmentForceWallRange;
        world.alignmentForceOffset = params.alignmentForceOffset;

        // AntiGravity force
        world.repulsionCoeff = params.repulsionCoeff;
        world.repulsionRange = params.repulsionRange;      // NOT pixels

        // Grouping attraction/repulsion
        world.groupingCoeff = params.groupingCoeff;

        // Flag displaying alignment lines
        world.displayLines = false;

        // --------------------------------------
        // create two boxes
        const bodyOptions = {
            inertia: Infinity,
            frictionAir: params.frictionAir,
            friction: params.friction,
        };


        // generate boxes randomly
        const generateRandomBoxes = (): Matter.Body[] => {
            const allSquare = false;
            const MinSizeX = 30;
            const MaxSizeX = 170;
            const MinSizeY = 30;
            const MaxSizeY = 170;
            const UnitSize = 16;

            const boxes = Array<Matter.Body>(NumBoxes);
            for (let i = 0; i < NumBoxes; i++) {
                const rectWidth = utils.randRange(MinSizeX, MaxSizeX, UnitSize);
                let rectHeight = rectWidth;
                if (!allSquare) {
                    rectHeight = utils.randRange(MinSizeY, MaxSizeY, UnitSize);
                }
                const offsetX = WallOffset + rectWidth / 2;
                const offsetY = WallOffset + rectHeight / 2;
                const x = utils.randRange(offsetX, ScreenWidth - offsetX);
                const y = utils.randRange(offsetY, ScreenHeight - offsetY);
                boxes[i] = Matter.Bodies.rectangle(x, y, rectWidth, rectHeight, bodyOptions);
            }
            return boxes;
        };


        // https://stackoverflow.com/a/55934241/524526
        const getImageDimensions = (path: string) => new Promise((resolve, reject) => {
            const img = new Image();

            // the following handler will fire after the successful loading of the image
            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = path;
        });


        const getBox = async (imgPath: string) => {
            let img = await getImageDimensions(imgPath) as { width: number, height: number };
            let offsetX = WallOffset + img.width / 2;
            let offsetY = WallOffset + img.height / 2;
            let x = utils.randRange(offsetX, ScreenWidth - offsetX);
            let y = utils.randRange(offsetY, ScreenHeight - offsetY);
            return Matter.Bodies.rectangle(x, y, img.width, img.height, bodyOptions);
        };

        const promisedBoxes = Promise.all(imgPaths.map(getBox));

        // surrounding wall
        const wallOptions = {
            isStatic: true,
            friction: params.wallFriction,
        }

        const wallTop = Matter.Bodies.rectangle(
            ScreenWidthHalf,
            -WallOffset,
            ScreenWidth + WallMargin,
            WallThickness,
            wallOptions,
        );
        const wallBottom = Matter.Bodies.rectangle(
            ScreenWidthHalf,
            ScreenHeight + WallOffset,
            ScreenWidth + WallMargin,
            WallThickness,
            wallOptions,
        );
        const wallLeft = Matter.Bodies.rectangle(
            - WallOffset,
            ScreenHeightHalf,
            WallThickness,
            ScreenHeight + WallMargin,
            wallOptions,
        );
        const wallRight = Matter.Bodies.rectangle(
            ScreenWidth + WallOffset,
            ScreenHeightHalf,
            WallThickness,
            ScreenHeight + WallMargin,
            wallOptions,
        );

        // mouse and constraint
        const mouse = Matter.Mouse.create(document.body);
        const constraint = Matter.Constraint.create(
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
        const mouseConstraint = Matter.MouseConstraint.create(
            engine,
            {
                mouse: mouse,
                constraint: constraint,
            }
        );

        // `blocks` is to contain boxes, walls, and mouse constraints
        var blocks: Matter.Body[];

        const setupWorld = async () => {
            let boxes = await promisedBoxes;
            blocks = [...boxes, wallTop, wallBottom, wallLeft, wallRight]
            Matter.World.add(world, blocks);
            Matter.World.add(world, mouseConstraint);
            Matter.Runner.run(runner, engine);
        };


        // p5 preload that waits till done
        var p5imgs: p5.Image[];
        p.preload = () => {
            setupWorld();
            p5imgs = imgPaths.map(p.loadImage);
        };

        // p5 setup that runs in async
        p.setup = () => {
            p.createCanvas(ScreenWidth, ScreenHeight);
        };

        // p5 draw
        p.draw = () => {
            p.background('#247c41');
            p.fill(0);
            // draw blocks
            for (let i in p5imgs) {
                // p.push();
                const block = blocks[i];
                const img = p5imgs[i];
                const w = utils.getWidth(block);
                const h = utils.getHeight(block);
                const x = Math.floor(block.position.x - w / 2);
                const y = Math.floor(block.position.y - h / 2);
                p.image(img, x, y);
            }
            // draw walls
            for (let i = 0; i < 4; i++) {
                const block = blocks[p5imgs.length + i];
                const w = utils.getWidth(block);
                const h = utils.getHeight(block);
                const x = Math.floor(block.position.x - w / 2);
                const y = Math.floor(block.position.y - h / 2);
                p.noStroke();
                p.rect(x, y, w, h);
            }

            if (world.displayLines) {
                const boxes = blocks.slice(0, blocks.length - 4);
                const attractorXs = align.getAttractorXs(boxes, world.alignmentForceRange);
                for (let x of attractorXs) {
                    p.stroke(params.colorLinesVertical);
                    p.line(x, WallVisible, x, ScreenHeight - WallVisible);
                }

                const attractorYs = align.getAttractorYs(boxes, world.alignmentForceRange);
                for (let y of attractorYs) {
                    p.stroke(params.colorLinesHorizontal);
                    p.line(WallVisible, y, ScreenWidth - WallVisible, y);
                }
            }
        };

        // main loop
        var counter = 0;
        Matter.Events.on(engine, 'beforeUpdate', (event: Matter.Events) => {
            counter += 1;
            if (counter % 300 == 0) {
                console.log("counter: ", counter);
            }

            if (world.forceOn) {
                if (counter < 180) {
                    grouping.applyGrouping(world, blocks);
                } else if (counter < 240) {
                    repulsion.applyAntiGravity(world, blocks);
                } else {
                    align.applyAlignment(world, blocks);
                }

                if (world.pokeEnabled) {
                    poke.applyRandomPokes(world, blocks);
                }
            }
        });


        document.addEventListener('keydown', (e) => {
            // Toggle forces by pressing Space key
            if (e.code === "Space") {
                world.forceOn = !world.forceOn;
                console.log(`Toggled force: ${world.forceOn}`);
            }

            // Toggle alignment lines with L key
            if (e.code === "KeyL") {
                world.displayLines = !world.displayLines;
                console.log(`Toggled displayLines: ${world.displayLines}`);
            }

            // Toggle random poking
            if (e.code === "KeyP") {
                world.pokeEnabled = !world.pokeEnabled;
                if (world.pokeEnabled) {
                    world.pokeScale = params.pokeScale;
                }
                console.log(`Toggled poking: ${world.pokeEnabled}`);
            }
        });


        // Rotate a block by double clicking
        document.addEventListener('dblclick', () => {
            console.log(`--- Double click at t=${counter} ---`);
            // iterate over blocks except for walls
            for (let i = 0; i < blocks.length - 4; i++) {
                const b = blocks[i];
                if (!b.isStatic && Matter.Bounds.contains(b.bounds, mouse.position)) {
                    Matter.Body.rotate(b, Math.PI / 2);
                    p5imgs[i] = utils.rotateClockwise(p, p5imgs[i]);
                    break;
                }
            }
        });


        // Rotate a block by touch rotation
        document.addEventListener('touchmove', (e) => {
            let touch = e.changedTouches.item(0);
            let angleInDegrees = touch?.rotationAngle ?? 0;
            console.log(`--- Touch rotation activated at t=${counter} ---`);
            console.log(`    rotation angle = ${angleInDegrees} (deg)`);
            // iterate over blocks except for walls
            for (let i = 0; i < blocks.length - 4; i++) {
                const b = blocks[i];
                if (!b.isStatic && Matter.Bounds.contains(b.bounds, mouse.position) && angleInDegrees > 2) {
                    Matter.Body.rotate(b, Math.PI / 2);
                    p5imgs[i] = utils.rotateClockwise(p, p5imgs[i]);
                    break;
                }
            }
        });
    }
}
