LBComponentsManager = function () {
    // questi sono tutti gli eventi: array del tipo [genitore: LBLibrary.ComponentsTypes.x][evento: LBSignal]
    this.Signals = {};
    // queste sono tutti i delegati che non sono ancora stati assegnati ai corrispettivi eventi: permette la creazione non gerarchica dei componenti
    //array del tipo: [genitore: LBLibrary.ComponentsType.x][chiamante: LBLibrary.ComponentsTypes.y][callback: function]
    this.Handlers = {};
    //array per ora inutilizzato ma che servirà per la gestione degli update
    this.Components = {};
}

LBComponentsManager.prototype = Object.create(Object);
LBComponentsManager.prototype.constructor = LBComponentsManager;

//funzione che aggiunge il segnale all'elenco e toglie dalla coda i dlegati già dichiarati
LBComponentsManager.prototype.addSignal = function (parentType, signal) {
    if (!this.Signals[parentType]) this.Signals[parentType] = {};
    if (!this.Signals[parentType][signal.name]) {
        this.Signals[parentType][signal.name] = signal;
        for (var callingType in this.Handlers[parentType]) {
            for (var callback in callingType) {
                if (callback == signal) this.Signals[parentType][signal].add(this.Handlers[parentType][callingType][callback]);
            }
        }
    }
    else {
        console.error('Duplicated event for type: ' + parentType + ' signal: ' + signal.name);
        return;
    }
    console.log('Created: ' + signal.name);
}

//funzione che richiama tutti i delegati su quel segnale
LBComponentsManager.prototype.signalCallback = function (parentType, signalName) {
    console.log('Dispatching to handlers ...');
    this.Signals[parentType][signalName].dispatch();
    console.log('Finished dispatching.');
}

//funzione che aggiunge il delegato all'evento (se già esistente) oppure lo mette nella listra di delegati in attesa.
LBComponentsManager.prototype.loadDelegate = function (parentType, callingType, signalName, callback) {
    if (this.Signals[parentType] && this.Signals[parentType][signalName]) this.Signals[parentType][signalName].add(callback);
    else {
        if (!this.Handlers[parentType]) this.Handlers[parentType] = {};
        if (!this.Handlers[parentType][callingType]) this.Handlers[parentType][callingType] = {};
        if (this.Handlers[parentType][callingType][signalName]) console.warn('The same component has loaded two delegates for the same signal --' + callingType + ' to -> ' + parentType + ' --THIS CAUSES OVERWRITING');
        this.Handlers[parentType][callingType][signalName] = callback;
    }
}