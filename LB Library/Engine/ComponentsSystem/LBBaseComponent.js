LBBaseComponent = function (agent, type) {
    this.agent = agent;
    //il tipo richiamato da LBLibrary
    this.type = type;
    this.componentsManager = agent.componentsManager;
    //booleana che verrà usata dal manager per gestire gli update
    this.enabled = true;
}

LBBaseComponent.prototype = Object.create(Object);
LBBaseComponent.prototype.constructor = LBBaseComponent;

//funzione che richiama la creazione del segnale tramite il manager
LBBaseComponent.prototype.createSignal = function (signalName) {
    console.log('Creating ' + signalName + '...');
    var signal = new LBSignal(signalName, this);
    this.componentsManager.addSignal(this.type, signal);
}

//funzione che genera l'evento
LBBaseComponent.prototype.fireSignal = function (signalName) {
    console.log(signalName + ' Fired');
    this.componentsManager.signalCallback(this.type, signalName);
}

//funzione che dichiara un nuovo delegate tramite il manager
LBBaseComponent.prototype.sendDelegate = function (parentType, signalName, callback) {
    if(!parentType) {
        console.error('ERROR at sendDelegate: callingType: ' + this.type + ' --Check parentType.');
        return;
    }
    this.componentsManager.loadDelegate(parentType, this.type, signalName, callback);
} 