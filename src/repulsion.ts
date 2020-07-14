namespace respulsion {

    export const antiGravityManhattan = (g: number, src: Matter.Body, tgt: Matter.Body): Matter.Vector =>  {
        let dx = utils.distHoriz(src.position, tgt.position);
        let dy = utils.distVerti(src.position, tgt.position);
        // characteristic size
        let charSize =  0.5 * (Math.sqrt(src.area) + Math.sqrt(tgt.area));
        let antiGravityMagX = (dx < 1.5 * charSize) ? g / (1000 + dx ** 2) : 0;
        let antiGravityMagY = (dy < 1.5 * charSize) ? g / (1000 + dy ** 2) : 0;
        let force = {
            x: antiGravityMagX,
            y: antiGravityMagY,
        };
        return force;
    }             
    

    export const antiGravity = (g: number, src: Matter.Body, tgt: Matter.Body): Matter.Vector =>  {
        let d = utils.distEuclid(src.position, tgt.position);
        // characteristic size
        let charSize =  0.5 * (Math.sqrt(src.area) + Math.sqrt(tgt.area));
        let antiGravityMag = (d < 1.5 * charSize) ? AntiGravityConst / d ** 2 : 0;
        let unitSrcToTgt = utils.unitVec(src.position, tgt.position)
        let force = {
            x: antiGravityMag * unitSrcToTgt.x,
            y: antiGravityMag * unitSrcToTgt.y,
        };
        return force;
    }      
    
}