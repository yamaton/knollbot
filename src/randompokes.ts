import Matter from "matter-js";
import * as utils from "./utils";
import {WorldExtended} from "./exttypes";


export const applyRandomPoke = (world: WorldExtended, block: Matter.Body) => {
  if (!block.isStatic) {
      Matter.Body.applyForce(block, block.position,
          {
              x: world.pokeScale * utils.randn(),
              y: world.pokeScale * utils.randn(),
          });
  }
}