LBBaseComponent = function (agent, type) {
    this.agent = agent;
    //il tipo richiamato da LBLibrary
    this.type = type;
    this.componentsManager = agent.componentsManager;
    //se il componente esiste gi�, allora fa qualcosa
    if (this.componentsManager.Components[this.type])
        console.log('il componente '+this.type+' esiste gi�');
    //aggiunge se stesso all'elenco del manager
    this.componentsManager.Components[this.type] = this;
    //booleana che verr� usata dal manager per gestire gli update
    this.enabled = true;
}

LBBaseComponent.prototype = Object.create(Object);
LBBaseComponent.prototype.constructor = LBBaseComponent;

//funzione che richiama la creazione del segnale tramite il manager
LBBaseComponent.prototype.createSignal = function (signalName) {
    //console.log('Creating ' + signalName + '...');
    var signal = new LBSignal(signalName, this);
    this.componentsManager.addSignal(signal);
}

//aggiunge uno o pi� parametri al manager. Da passare come oggetto { 'nome parametro': valore del parametro, ...}
LBBaseComponent.prototype.createParameters = function (parameters) {
    //console.log('Adding parameters...');
    this.componentsManager.addParameters(parameters);
}

//funzione che genera l'evento
LBBaseComponent.prototype.fireSignal = function (signalName) {
    //console.log(signalName + ' Fired');
    this.componentsManager.signalCallback(signalName);
}

//funzione che dichiara un nuovo delegate tramite il manager
LBBaseComponent.prototype.sendDelegate = function (signalName, callback) {
    this.componentsManager.loadDelegate(this.type, signalName, callback);
}

LBBaseComponent.prototype.sendUpdate = function (updateFunction, reqParameters, sentParameters) {
    this.componentsManager.loadUpdate(updateFunction, this, reqParameters, sentParameters);
}