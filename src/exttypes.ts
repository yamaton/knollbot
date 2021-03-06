import Matter from "matter-js";
import * as utils from "./utils";
import { Edge, Graph } from "./graph";


export interface WorldExtended extends Matter.World {
  forceOn: boolean;
  pokeScale: number;
  pokeDecay: number;
  alignmentForceCoeff: number;
  alignmentForceRange: number;
  alignmentForceWallRange: number;
  alignmentForceOffset: number;
  repulsionCoeff: number;
  repulsionRange: number;
  groupingCoeff: number;
  displayLines: boolean;
  pokeEnabled: boolean;
}

export type IPointPairFunc = (body1: Matter.Body, body2: Matter.Body) => [utils.Vector, utils.Vector, number];

export interface EdgeExtended extends Edge {
  posSrc: utils.Vector;
  posTgt: utils.Vector;
  idxSrc: number;
  idxTgt: number;
}

export interface GraphExtended extends Graph {
  edges: EdgeExtended[];
}

