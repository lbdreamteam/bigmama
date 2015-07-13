///**** QUESTA CLASSE NON E' SPAZZATURA ****///
/* ci sono dichiarate le variabili che non possono essere passate 
tramite i costruttori SOLO quelle*/
var eurecaClient,
    eurecaServer,
    gameInstance,
    myId = 0,
    joined = false,
    LBLibrary = (function () {
        /* Questo è il sistema dei tipi: ne va dichiarato uno nuovo ogni volta che si crea un nuobvo tipo di componente
        ATTENZIONE! il valore 0 viene considerato nullo quindi non va utilizzato! */
        var ComponentsTypes = (function () {
            const Movement = 1,
                    KeyboardInput = 2,
                    CollidingMovement = 3,
                    Shooting = 4,
                    Snapping = 5;
                    Overlap = 6,
                    Shootable = 7,
                    PathFinding = 8,
                    ServerDrivenMovement = 9
            return {
                Movement: Movement,
                KeyboardInput: KeyboardInput,
                CollidingMovement: CollidingMovement,
                Shooting: Shooting,
                Snapping : Snapping,
                Overlap : Overlap,
                Shootable: Shootable,
                PathFinding: PathFinding,
                ServerDrivenMovement: ServerDrivenMovement
            }
        }())
        return {
            ComponentsTypes: ComponentsTypes
        }
    }()),
    labels = [];
///PRIMA DI MODIFICARE QUESTA CLASSE DOVETE ESSERE SICURI CHE NON CI SIA UN ALTRO MODO///
