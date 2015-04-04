LBShootingComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Shooting);
    
    //PROPS
}

LBShootingComponent.prototype = Object.create(LBBaseComponent.prototype);
LBShootingComponent.prototype.constructor = LBShootingComponent;

LBShootingComponent.prototype.shoot = function (target, speed, graph) {

}