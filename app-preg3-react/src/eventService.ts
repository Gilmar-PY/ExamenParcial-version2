
/**
 * se define la clase llamada envent que representa un evento
 * lo cual tiene 5 propiedades un id,titulo,descripcion, fecha,
 * ubicacion del evento
 * y el constructor de la clase toma los 5 paramtros
 * para asignar a las propiedades de la clase para crear instancias de Event
 * 
 */

export class Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;

    constructor(id: number, title: string, description: string, date: string, location: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.location = location;
    }
}

/**
 * manejo de las operaciones de eventos
 * aqui sedefine el servicio eventService lo cual esta encapsualando
 * toda la logica de las gestion de eventos
 */
const eventService = (() => {
    let events: Event[] = [];
    let idCounter = 1;

    // Crear evento
    /**
     *  la función permite crear un nuevo evento. Toma un objeto que contiene
     *  title, description, date, y location como parámetros
     *  y devuelve una promesa que se resuelve con el nuevo evento 
     * creado
     */
    const createEvent = ({ title, description, date, location }: { title: string; description: string; date: string; location: string; }): Promise<Event> => {
        return new Promise((resolve) => {
            const newEvent = new Event(idCounter++, title, description, date, location);
            events.push(newEvent);
            resolve(newEvent);
        });
    };

    // Obtener todos los eventos
    /**
     * la funcion retorna una promesa que se resuelve con una copia de array de 
     * eventos esta copia se obtiene utilizando spread(...)para que nose modifique
     * el array original fuera del modulo
     * 
     */
    const getEvents = (): Promise<Event[]> => {
        return new Promise((resolve) => {
            resolve([...events]);
        });
    };

    // Editar evento
    //la funcion permite el evento existente y tomo los parametros
    // id del evento a editar y un objeto updateEvent que contien
    // las propiedades a actualizar asi mismo retorna
    // una promesa que se resuelve con el evento actualizado
    const editEvent = (id: number, updatedEvent: Partial<Event>): Promise<Event | string> => {
        return new Promise((resolve, reject) => {
            const index = events.findIndex((event) => event.id === id);
            if (index !== -1) {
                events[index] = { ...events[index], ...updatedEvent };
                resolve(events[index]);
            } else {
                reject('Evento no encontrado');
            }
        });
    };

    // Eliminar evento
    //Se busca el índice del evento con el id dado en el array events
    //Si se encuentra, el evento se elimina del array usando splice
    //Si no se encuentra, la promesa se rechaza con un mensaje de error

    const deleteEvent = (id: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const index = events.findIndex((event) => event.id === id);
            if (index !== -1) {
                events.splice(index, 1);
                resolve('Evento eliminado');
            } else {
                reject('Evento no encontrado');
            }
        });
    };
    // retorna el modulo
    return {
        createEvent,
        getEvents,
        editEvent,
        deleteEvent
    };
})();

export default eventService;

/*
El código organiza la lógica de 
gestión de eventos de manera modular
 y encapsulada. La clase Event modela cada evento
  individual, mientras que el módulo eventService 
  ofrece una API para manipular estos eventos (crear, editar, eliminar 
  y obtener)*/
