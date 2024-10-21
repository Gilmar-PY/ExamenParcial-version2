// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import eventService, { Event } from './eventService';

const App = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: ''
    });
    // events: se inicializa como un array vacío de objetos Event para almacenar todos los eventos. 
    //setEvents es la función que actualiza este estado
    //formData: se utiliza para manejar los datos del formulario, con campos como title,
    // description, date, y location. Se inicializa con valores vacíos


    useEffect(() => {
        const fetchEvents = async () => {
            const events = await eventService.getEvents();
            setEvents(events);
        };
        fetchEvents();
    }, []);
    //useEffect para ejecutar la función fetchEvents cuando el componente se monta por 
    //primera vez debido a que el array de dependencias está vacío La función fetchEvents es una función asíncrona que llama 
    //al servicio eventService.getEvents() para obtener todos los eventos y luego actualiza el estado events con estos datos
    
    
    
    
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    //  la función maneja los cambios en los campos de entrada del formulario toma el evento de cambio (e) como parámetro,
    // extrae el name y el value del campo de entrada, y actualiza el estado formData usando la función setFormData


    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newEvent = await eventService.createEvent(formData);
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            setFormData({ title: '', description: '', date: '', location: '' });
        } catch (error) {
            console.error('Error al crear evento:', error);
        }
    };
    //e.preventDefault() previene el comportamiento predeterminado del formulario para que no recargue la página
    //Se llama al servicio eventService.createEvent formData para crear un nuevo evento utilizando los datos del formulario
    //Si el evento se crea correctamente, se actualiza el estado events añadiendo el nuevo evento al array existente
    
    
    const handleDeleteEvent = async (id: number) => {
        try {
            await eventService.deleteEvent(id);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
        } catch (error) {
            console.error('Error al eliminar evento:', error);
        }
    };
    //Llama a eventService.deleteEvent(id) para eliminar el evento del servicio
    //Si la operación es corecta, actualiza el estado events para eliminar el evento filtrándolo por su id
    return (
        <div>
            <h1>Gestión de Eventos</h1>
            <form onSubmit={handleCreateEvent}>
                <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleInputChange} required />
                <input type="text" name="description" placeholder="Descripción" value={formData.description} onChange={handleInputChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                <input type="text" name="location" placeholder="Ubicación" value={formData.location} onChange={handleInputChange} required />
                <button type="submit">Crear Evento</button>
            </form>

            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>{event.date}</p>
                        <p>{event.location}</p>
                        <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
/*
componente App gestiona la creación, visualización y eliminación de eventos de manera
 eficiente utilizando Hooks.
  Se asegura de que los eventos se carguen inicialmente 
al montar el componente, y que los formularios y las interacciones del usuario actualicen
 el estado y el contenido */
