LBComponentsManager = function () {
    // questi sono tutti gli eventi: [evento: LBSignal]
    this.Signals = {};
    // queste sono tutti i delegati che non sono ancora stati assegnati ai corrispettivi eventi: permette la creazione non gerarchica dei componenti
    //array del tipo: [chiamante: LBLibrary.ComponentsTypes.x][callback: function]
    this.Handlers = {};
    //array che contiene le prop utilizzate dagli eventi dei components come parametri
    this.Parameters = {};
    //array contenente tutti gli update in ordine (del tipo {update: funzione, parent: oggetto genitore , paramReq: [parametri richiesti], paramSnd: [parametri messi a disposizione]})
    this.UpdateFunctions = [];
    //contiene i riferimenti ai componenti dell'agent (indicizzati con i tipi)
    this.Components = {};
}

LBComponentsManager.prototype = Object.create(Object);
LBComponentsManager.prototype.constructor = LBComponentsManager;

//funzione che aggiunge il segnale all'elenco e toglie dalla coda i delegati già dichiarati
LBComponentsManager.prototype.addSignal = function (signal) {
    if (!this.Signals[signal.name]) {
        //console.log(this.Handlers);
        this.Signals[signal.name] = signal;
        for (var callingType in this.Handlers)
            for (var signalName in this.Handlers[callingType])
                if (signalName === signal.name)
                    this.Signals[signal.name].add(this.Handlers[callingType][signalName]);
    }
    else {
        console.error('Duplicated event ' + signal.name);
        return;
    }
    //console.log('Created: ' + signal.name);
}

//aggiunge i parametri resi disponibili dal component all'elenco del manager
LBComponentsManager.prototype.addParameters = function (parameters) {
    for (var parameter in parameters)
        if (!this.Parameters[parameter]) {
            this.Parameters[parameter] = parameters[parameter];
            //console.log('Added parameter ' + parameter.toString() + ' for value ');
            //console.log( this.Parameters[parameter]);
        }
        else
            console.warn('Two components added the same parameter, this may cause errors');
}

//funzione che richiama tutti i delegati su quel segnale
LBComponentsManager.prototype.signalCallback = function (signalName) {
    //console.log('Dispatching to handlers ...');
    this.Signals[signalName].dispatch(this.Parameters);
    //console.log('Finished dispatching.');
}

//funzione che aggiunge il delegato all'evento (se già esistente) oppure lo mette nella listra di delegati in attesa.
LBComponentsManager.prototype.loadDelegate = function (callingType, signalName, callback) {
    if (this.Signals[signalName]) this.Signals[signalName].add(callback);
    else {
        if (!this.Handlers[callingType]) this.Handlers[callingType] = {};
        if (this.Handlers[callingType][signalName]) console.warn('The same component has loaded two delegates for the same signal --' + callingType + ' to -> ' + signalName + ' --THIS CAUSES OVERWRITING');
        //console.log('aggiunto alla coda: ' + callingType + ' -> ' + signalName);
        this.Handlers[callingType][signalName] = callback;
    }
}

//aggiunge una funzione all'update del manager, rispettando l'ordine in cui sono richiesti i parametri
LBComponentsManager.prototype.loadUpdate = function (updateFunction, parent, reqParameters, sentParameters) {
    var newUpdate = { 
        update: updateFunction,
        parent: parent,
        paramReq: reqParameters,
        paramSnd: sentParameters};
    //console.log(newUpdate);
    var added = false;
    //Trova il punto in cui deve inserire il nuovo
    //se un certo update richiede una prop messa disponibile dal calback che sto aggiungendo, lo inserisco appena prima di quell'update, altrimenti lo inserisco alla fine
    for (var i = 0; i < this.UpdateFunctions.length; i++){
        var actualReq = this.UpdateFunctions[i].paramReq;
        for (var inp = 0; inp < actualReq.length; inp++)
            for (var isp = 0; isp < sentParameters.length; isp++)
                if (!added && actualReq[inp] === sentParameters[isp]){
                    //devo inserire il nuovo update appena prima dell'update di indice i
                    added = true;
                    var tempArr = [];
                    for (var j = i; j < this.UpdateFunctions.length; j++)
                        tempArr.push(this.UpdateFunctions[j]);
                    this.UpdateFunctions[i] = newUpdate;
                    for (var j = 0; j < tempArr.length; j++)
                        this.UpdateFunctions[i + j + 1] = tempArr[j];
                }
    }
    if (!added)
        this.UpdateFunctions.push(newUpdate);
    //console.log('aggiunta di un nuovo update da parte di '+parent.type);
}

//funzione di update del manager: richiama tutte le funzioni di update dei componenti
LBComponentsManager.prototype.update = function() {
    //console.log(this.UpdateFunctions);
    for (var i = 0; i < this.UpdateFunctions.length; i++)
        if (this.UpdateFunctions[i].parent.enabled)
            this.UpdateFunctions[i].update();
}