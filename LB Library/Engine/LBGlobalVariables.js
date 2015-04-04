///**** QUESTA CLASSE NON E' SPAZZATURA ****///
/* ci sono dichiarate le variabili che non possono essere passate 
tramite i costruttori SOLO quelle*/
var eurecaClient,
    eurecaServer,
    gameInstance,
    LBLibrary = (function () {
        /* Questo è il sistema dei tipi: ne va dichiarato uno nuovo ogni volta che si crea un nuobvo tipo di componente
        ATTENZIONE! il valore 0 viene considerato nullo quindi non va utilizzato! */
        var ComponentsTypes = (function () {
            const Movement = 5,
                    KeyboardInput = 1,
                    CollidingMovement = 2,
                    Shooting = 3,
                    Snapping = 4;
            return {
                Movement: Movement,
                KeyboardInput: KeyboardInput,
                CollidingMovement: CollidingMovement,
                Shooting: Shooting,
                Snapping : Snapping
            }
        }())
        return {
            ComponentsTypes: ComponentsTypes
        }
    }());
///PRIMA DI MODIFICARE QUESTA CLASSE DOVETE ESSERE SICURI CHE NON CI SIA UN ALTRO MODO///
