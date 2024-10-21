
// Declaracion de interfaces
interface Tarea {
    ejecutar(): void;
}
interface TareaConPrioridad {
    prioridad: number;
}
// tipo de interseccion  que combina tarea ytarea con prioridad
type TareaPriorizada = Tarea & TareaConPrioridad;


// Clase de bstracion para las tareas,
abstract class TareaBase implements Tarea {
    constructor(protected nombre: string) {}
    abstract ejecutar(): void;
    protected registrar(mensaje: string): void {
        console.log(`[${this.nombre}] ${mensaje}`);
    }
}
/**
 * TareaBase clase abstracta que implemeta la insterfaz tarea
 * define constructor que toma el nombre como parametro donde lo almacena
 * el metodo registrar:  permite a las clases derivadas registrar
 * mensajes con el formato en espesifico lo cual usa el nombre de la tarea
 */


// uso de tipos utilitarios
type TareaReadonly = Readonly<Tarea>;// todas la teares con prioiridad de lectura
type TareaParcial = Partial<Tarea>;//tarea con todos las  prioridad opcionales


// Clases para tareas específicas qu usa diferentes fases del Event Loop
class TareaInmediata extends TareaBase {
    ejecutar() {
        setImmediate(() => this.registrar("Ejecucion en fase de setImmediate (macrotarea)."));
    }
}
class TareaTimeout extends TareaBase {
    constructor(nombre: string, private retraso: number) {
        super(nombre);
    }
    ejecutar() {
        setTimeout(() => this.registrar(`Ejecutando después de ${this.retraso} ms con setTimeout (macrotarea).`), this.retraso);
    }
}
// clase que ejecuata la tarea usando process.nexTick
class TareaNextTick extends TareaBase {
        // ejecucion de la clase para una tarea con un retraso usando setTimeout microtarea
    ejecutar() {
        process.nextTick(() => this.registrar("Ejecucion en fase de nextTick (microtarea)."));
    }
}
// la Clase  ejecuta una tarea usando una promesa microtarea
class TareaPromesa extends TareaBase {
    async ejecutar() {
        try {
            const resultado = await this.obtenerPromesa();
            this.registrar(resultado);
        } catch (error) {
            this.registrar("Error en la promesa");
        }
    }
    //el metodo privado retona una promesa que resuelve imediatamente
    private obtenerPromesa(): Promise<string> {
        return new Promise((resolver) => {
            this.registrar("Promesa iniciada");
            resolver("la Promesa es  resuelta (microtarea)");
        });
    }
}
// clase que ejecuta una tarea usando callback co Setimeout
class TareaConCallback extends TareaBase {
    ejecutar() {
        this.operacionAsincrona((resultado) => {
            this.registrar(`Callback ejecutado con resultado: ${resultado}`);
        });
    }
    // el metodo realiza opearacion asincrona  y realiza el llamdo a callback
    private operacionAsincrona(callback: (resultado: string) => void) {
        setTimeout(() => {
            callback("Operación completada (macrotarea)");
        }, 50);
    }
}
/**
 * TareaInmediata:: esta ejecutando setImediate, lo que coloca
 * en la cola  de macrotareas
 * TareaTimeout:: ejecuta la tarea despues de un retraso de milesegundos, colocandola en la cola de macrotareas
 * TareaNextick esta usando process.netick para ejecutar en la fase de microtarea
 * TareaPromesa ejecuta una promesa que se resuelve inmediatamente donde muestra
 * como se esta manejado promesas y microtareas
 * TareaCOncallback esta realizano una operacion asincrona con el callback utilizando 
 * setTimeout
 */





// manejo de clase genrica  lista de tareas
class GestorDeTareas<T extends Tarea> {
    private tareas: T[] = [];//array que almacena tarea de tipos generico
    agregarTarea(tarea: T) {
        this.tareas.push(tarea);
    }
    ejecutarTodas() {// ejecuta todas las tareas
        this.tareas.forEach((tarea) => tarea.ejecutar());
    }
}
/**
 * GestorDetareas es la clase generica que gestiona la lista de tareas de diferentes tipos
 * donde implemeta la interfaz Tarea
 * agregarTarea permite agragr tarea a la lista
 * ejecutarTodas rrecorre todas las tareas en la lista 
 *
 */



// Manejo de null y undefined con narrowing
function mostrarMensaje(mensaje: string | null | undefined) {
    if (mensaje == null) {
        // si el mensaje es null o indefined imprime que no hay mensaje
        console.log('No hay mensaje disponible.');
    } else {
        console.log(`Mensaje: ${mensaje}`);// si no, se muestra el mensaje
    }
}


//  microtarea y macrotarea en EventLoop
process.nextTick(() => console.log("Microtarea anónima - process.nextTick"));
Promise.resolve().then(() => console.log("Microtarea anónima - Promise.resolve"));
setTimeout(() => console.log("Macrotarea anónima - setTimeout"), 0);
setImmediate(() => console.log("Macrotarea anónima - setImmediate"));

/***
 * funcionamiento de las microtareas process.nextTick y Promise.resolv
 * y las macrotareas setTimeout y setImmediate
 */


// Instanciación y ejecución de las tareas
const gestor = new GestorDeTareas<Tarea>();
// Creación de instancias de tareas y adición al gestor de tareas
gestor.agregarTarea(new TareaInmediata("Tarea Inmediata"));
gestor.agregarTarea(new TareaTimeout("Tarea con Timeout", 0));
gestor.agregarTarea(new TareaNextTick("Tarea con NextTick"));
gestor.agregarTarea(new TareaPromesa("Tarea con Promesa"));
gestor.agregarTarea(new TareaConCallback("Tarea con Callback"));
gestor.ejecutarTodas();
/**
 * creacion de instancias de klos difeerentes clases de tareas donde agreaga al gestordeTareas
 * 
 */

// Uso de polimorfismo y herencia
const tareas: Tarea[] = [
    new TareaInmediata("Polimorfismo - Tarea Inmediata"),
    new TareaTimeout("Polimorfismo - Tarea con Timeout", 10),
    new TareaNextTick("Polimorfismo - Tarea con NextTick"),
    new TareaPromesa("Polimorfismo - Tarea con Promesa"),
    new TareaConCallback("Polimorfismo - Tarea con Callback")
];
tareas.forEach((tarea) => tarea.ejecutar());
/**
 * uso de diferentes clases de tareas atravez de la interfaz de tarea
 * donde se muestra el polimorfismo.
 */



// Implementación de un tipo de unión
type TipoDeTarea = 'inmediata' | 'timeout' | 'nextTick' | 'promesa' | 'callback';
function crearTarea(tipo: TipoDeTarea, nombre: string): Tarea {
    switch (tipo) {
        case 'inmediata':
            return new TareaInmediata(nombre);
        case 'timeout':
            return new TareaTimeout(nombre, 0);
        case 'nextTick':
            return new TareaNextTick(nombre);
        case 'promesa':
            return new TareaPromesa(nombre);
        case 'callback':
            return new TareaConCallback(nombre);
        default:
            throw new Error('Tipo de tarea no reconocido');
    }
}

// Creación de tareas utilizando la función genérica
const tareaGenerica = crearTarea('promesa', 'Tarea Genérica');
tareaGenerica.ejecutar();
/***
 * la funcion crearTareas, es una funcion que toma un tipo de tareas y un nombre y retorna una instancia de las 
 * clases correspondientes
 */
