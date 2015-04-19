LBComponentsManager = function () {
    // questi sono tutti gli eventi: [evento: LBSignal]
    this.Signals = {};
    // queste sono tutti i delegati che non sono ancora stati assegnati ai corrispettivi eventi: permette la creazione non gerarchica dei componenti
    //array del tipo: [chiamante: LBLibrary.ComponentsTypes.x][callback: function]
    this.Handlers = {};
    //array per ora inutilizzato ma che servirà per la gestione degli update
    this.Components = {};
    //array che contiene le prop utilizzate dagli eventi dei components come parametri
    this.Parameters = {};
}

LBComponentsManager.prototype = Object.create(Object);
LBComponentsManager.prototype.constructor = LBComponentsManager;

//funzione che aggiunge il segnale all'elenco e toglie dalla coda i delegati già dichiarati
LBComponentsManager.prototype.addSignal = function (signal) {
    if (!this.Signals[signal.name]) {
        console.log(this.Handlers);
        this.Signals[signal.name] = signal;
        for (var callingType in this.Handlers)
            for (var signalName in this.Handlers[callingType])
                if (signalName === signal.name) {
                    this.Signals[signal.name].add(this.Handlers[callingType][signalName]);
                    this.Handlers[callingType][signalName] = undefined;
                }
    }
    else {
        console.error('Duplicated event ' + signal.name);
        return;
    }
    console.log('Created: ' + signal.name);
}

//aggiunge i parametri resi disponibili dal component all'elenco del manager
LBComponentsManager.prototype.addParameters = function (parameters) {
    for (var parameter in parameters)
        if (!this.Parameters[parameter]) {
            this.Parameters[parameter] = { exist: true };
            console.log('added parameter ' + parameter.toString());
        }
        else
            console.warn('Two components added the same parameter, this may cause errors');
}

//funzione che richiama tutti i delegati su quel segnale
LBComponentsManager.prototype.signalCallback = function (signalName) {
    console.log('Dispatching to handlers ...');
    this.Signals[signalName].dispatch();
    console.log('Finished dispatching.');
}

//funzione che aggiunge il delegato all'evento (se già esistente) oppure lo mette nella listra di delegati in attesa.
LBComponentsManager.prototype.loadDelegate = function (callingType, signalName, callback) {
    if (this.Signals[signalName]) this.Signals[signalName].add(callback);
    else {
        if (!this.Handlers[callingType]) this.Handlers[callingType] = {};
        if (this.Handlers[callingType][signalName]) console.warn('The same component has loaded two delegates for the same signal --' + callingType + ' to -> ' + signalName + ' --THIS CAUSES OVERWRITING');
        console.log('aggiunto alla coda: ' + callingType + ' -> ' + signalName);
        this.Handlers[callingType][signalName] = callback;
    }
}