"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Clase de bstracion para las tareas,
class TareaBase {
    constructor(nombre) {
        this.nombre = nombre;
    }
    registrar(mensaje) {
        console.log(`[${this.nombre}] ${mensaje}`);
    }
}
// Clases para tareas específicas qu usa diferentes fases del Event Loop
class TareaInmediata extends TareaBase {
    ejecutar() {
        setImmediate(() => this.registrar("Ejecucion en fase de setImmediate (macrotarea)."));
    }
}
class TareaTimeout extends TareaBase {
    constructor(nombre, retraso) {
        super(nombre);
        this.retraso = retraso;
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
    ejecutar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield this.obtenerPromesa();
                this.registrar(resultado);
            }
            catch (error) {
                this.registrar("Error en la promesa");
            }
        });
    }
    //el metodo privado retona una promesa que resuelve imediatamente
    obtenerPromesa() {
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
    operacionAsincrona(callback) {
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
class GestorDeTareas {
    constructor() {
        this.tareas = []; //array que almacena tarea de tipos generico
    }
    agregarTarea(tarea) {
        this.tareas.push(tarea);
    }
    ejecutarTodas() {
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
function mostrarMensaje(mensaje) {
    if (mensaje == null) {
        // si el mensaje es null o indefined imprime que no hay mensaje
        console.log('No hay mensaje disponible.');
    }
    else {
        console.log(`Mensaje: ${mensaje}`); // si no, se muestra el mensaje
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
const gestor = new GestorDeTareas();
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
const tareas = [
    new TareaInmediata("Polimorfismo - Tarea Inmediata"),
    new TareaTimeout("Polimorfismo - Tarea con Timeout", 10),
    new TareaNextTick("Polimorfismo - Tarea con NextTick"),
    new TareaPromesa("Polimorfismo - Tarea con Promesa"),
    new TareaConCallback("Polimorfismo - Tarea con Callback")
];
tareas.forEach((tarea) => tarea.ejecutar());
function crearTarea(tipo, nombre) {
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
