import { distEuclid, distHoriz, distVerti, unitVec } from "./utils"

export const antiGravityManhattan = (src: Matter.Body, tgt: Matter.Body, coeff = 100): Matter.Vector => {
    let g = coeff;
    let dx = distHoriz(src.position, tgt.position);
    let dy = distVerti(src.position, tgt.position);
    // characteristic size
    let charSize = 0.5 * (Math.sqrt(src.area) + Math.sqrt(tgt.area));
    let antiGravityMagX = (dx < 1.5 * charSize) ? g / (1000 + dx ** 2) : 0;
    let antiGravityMagY = (dy < 1.5 * charSize) ? g / (1000 + dy ** 2) : 0;
    let force = {
        x: antiGravityMagX,
        y: antiGravityMagY,
    };
    return force;
}


export const antiGravityRanged = (src: Matter.Body, tgt: Matter.Body, coeff = 100, rangeFactor = 3.0): Matter.Vector => {
    let d = distEuclid(src.position, tgt.position);
    // characteristic size
    let charSize = 0.5 * (Math.sqrt(src.area) + Math.sqrt(tgt.area));
    let antiGravityMag = (d < rangeFactor * charSize) ? coeff / d ** 2 : 0;
    let unitSrcToTgt = unitVec(src.position, tgt.position)
    let force = {
        x: antiGravityMag * unitSrcToTgt.x,
        y: antiGravityMag * unitSrcToTgt.y,
    };
    return force;
}


export const antiGravity = (src: Matter.Body, tgt: Matter.Body, coeff = 100): Matter.Vector => {
    let d = distEuclid(src.position, tgt.position);
    let antiGravityMag = coeff / d ** 2;
    let unitSrcToTgt = unitVec(src.position, tgt.position)
    let force = {
        x: antiGravityMag * unitSrcToTgt.x,
        y: antiGravityMag * unitSrcToTgt.y,
    };
    return force;
}
