import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ClientSummary() {
    const { client_id, country_id, tour_id, transport_id, hotel_id, room_id } = useParams();
    const [client, setClient] = useState(null);
    const [country, setCountry] = useState(null);
    const [tour, setTour] = useState(null);
    const [transport, setTransport] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
    
                const [
                    clientRes, countryRes, tourRes, transportRes, hotelRes, roomRes
                ] = await Promise.all([
                    axios.get(`http://localhost:8081/read/${client_id}`),
                    axios.get(`http://localhost:8081/countries/${country_id}`),
                    axios.get(`http://localhost:8081/tours/${tour_id}`),
                    axios.get(`http://localhost:8081/transport/${transport_id}`),
                    axios.get(`http://localhost:8081/hotels/${hotel_id}`),
                    axios.get(`http://localhost:8081/rooms/details/${room_id}`)                ]);
    
                // Добавляем проверку на наличие данных
                if (!clientRes.data || !countryRes.data || !tourRes.data ||
                    !transportRes.data || !hotelRes.data || !roomRes.data) {
                    throw new Error("Some data not found");
                }
    
                console.log("Данные клиента:", clientRes.data);
                console.log("Данные страны:", countryRes.data);
                console.log("Данные транспорта:", transportRes.data);
                setClient(clientRes.data);
                setCountry(countryRes.data);
                setTour(tourRes.data);
                setTransport(transportRes.data);
                setHotel(hotelRes.data);
                setRoom(roomRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError("Не удалось загрузить информацию");
                setLoading(false);
            }
        };
    
        fetchData();
    }, [ client_id, country_id, tour_id, transport_id, hotel_id, room_id ]);

    if (loading) return <div className="text-center my-5">Загрузка информации...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container my-5">
            <h2 className="mb-4">Сводка клиента и тура</h2>

            <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">Клиент</h5>
                <p><strong>Имя:</strong> {client?.[0]?.first_name} {client?.[0]?.last_name} {client?.[0]?.middle_name}</p> {/* Обратите внимание на [0] и ?. */}
                <p><strong>Email:</strong> {client?.[0]?.contact_info || 'Нет данных'}</p> {/* Предполагаем наличие поля email */}
                <p><strong>Телефон:</strong> {client?.[0]?.phone || 'Нет данных'}</p> {/* Предполагаем наличие поля phone */}
            </div>
            </div>

            <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">Страна</h5>
                <p><strong>Название:</strong> {country?.country_name}</p>
            </div>
            </div>

            <div className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Тур</h5>
                    <p><strong>Название тура:</strong> {tour.name}</p>
                    {/* <p><strong>Description:</strong> {tour.description}</p> */}
                    <p><strong>Начало:</strong> {new Date(tour.start_date).toLocaleDateString()}</p>
                    <p><strong>Конец:</strong> {new Date(tour.end_date).toLocaleDateString()}</p>
                    {tour.price && <p><strong>Цена:</strong> {tour.price.toLocaleString()} ₽</p>}
                </div>
            </div>

            <div className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Tранспорт</h5>
                    {transport.transport_type && <p><strong>Тип транспорта:</strong> {transport.transport_type}</p>}
                    {transport.company && <p><strong>Рейс:</strong> {transport.company}</p>}
                    {transport.flight_number && <p><strong>Flight/Route:</strong> {transport.flight_number}</p>}
                    {transport.start_city && <p><strong>Departure:</strong> {transport.start_city}, {new Date(transport.start_date).toLocaleDateString()}</p>}
                    {transport.end_city && <p><strong>Arrival:</strong> {transport.end_city}, {new Date(transport.end_date).toLocaleDateString()}</p>}
                    {transport.travel_time && <p><strong>Travel Time:</strong> {transport.travel_time}</p>}
                    {transport.price && <p><strong>Price:</strong> {transport.price.toLocaleString()} ₽</p>}
                </div>
            </div>

            <div className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Отель</h5>
                    <p><strong>Название:</strong> {hotel.name}</p>
                    {/* <p><strong>Адрес:</strong> {hotel.address}</p> */}
                    <p><strong>Рейтинг:</strong> {hotel.rating}★</p>
                </div>
            </div>

            <div className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Комната</h5>
                    <p><strong>Номер:</strong> {room.room_number}</p>
                    <p><strong>Тип:</strong> {room.room_type}</p>
                    <p><strong>Описание:</strong> {room.description}</p>
                </div>
            </div>

          <Link to="/" className='btn btn-primary'>Назад</Link>

        </div>
    );
}

export default ClientSummary;
