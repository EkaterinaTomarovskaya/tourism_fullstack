import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeTransport() {
    const { client_id, country_id, tour_id } = useParams();
    const [transport, setTransport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourCity, setTourCity] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8081/transport/${tour_id}`)
            .then(res => {
                setTransport(res.data);
                if (res.data.length > 0) setTourCity(res.data[0].end_city);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching transport:", err);
                setError('Ошибка загрузки вариантов транспорта');
                setLoading(false);
            });
    }, [tour_id]);

    const handleSelectTransport = (transport_id) => {
        axios.post(`http://localhost:8081/assign-transport`, {
            client_id,
            country_id, // Убедитесь, что country_id отправляется
            tour_id,    // Убедитесь, что tour_id отправляется
            transport_id
        })
        .then(() => navigate(`/hotels/${client_id}/${country_id}/${tour_id}/${transport_id}`)) // УБЕДИТЕСЬ, ЧТО ВСЕ ПАРАМЕТРЫ ПЕРЕДАЮТСЯ
        .catch(err => console.log(err));
    };

    const navigateToFirst = () => setCurrentIndex(0);
    const navigateToPrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
    const navigateToNext = () => setCurrentIndex(prev => Math.min(transport.length - 1, prev + 1));
    const navigateToLast = () => setCurrentIndex(transport.length - 1);

    if (loading) return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3 text-center'>
                Загрузка вариантов транспорта...
            </div>
        </div>
    );

    if (error) return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3 text-center alert alert-danger'>
                {error}
            </div>
        </div>
    );

    if (transport.length === 0) return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3 text-center alert alert-info'>
                Нет доступных вариантов транспорта
            </div>
        </div>
    );

    const currentTransport = transport[currentIndex];

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Выбор транспорта в {tourCity}</h2>
                    <Link to={`/country/${client_id}`} className="btn btn-primary">Назад</Link>
                        
                </div>

                <div className='card mb-3'>
                    <div className='card-body'>
                        <h5 className='card-title text-center mb-4'>
                            {currentTransport.transport_type} - {currentTransport.company}
                        </h5>

                        <div className="mb-3">
                            <div><strong>Рейс:</strong> {currentTransport.flight_number || 'не указан'}</div>
                            <div><strong>Отправление:</strong> {currentTransport.start_city}, {new Date(currentTransport.start_date).toLocaleDateString()}</div>
                            <div><strong>Прибытие:</strong> {currentTransport.end_city}, {new Date(currentTransport.end_date).toLocaleDateString()}</div>
                            <div><strong>Время в пути:</strong> {currentTransport.travel_time}</div>
                            <div><strong>Страна:</strong> {currentTransport.country}</div>
                            <div><strong>Цена:</strong> {currentTransport.price?.toLocaleString()} ₽</div>
                        </div>
                    </div>
                </div>

                {/* Кнопки навигации */}
                <div className='d-flex justify-content-center mb-4 gap-2'>
                    <button 
                        onClick={navigateToFirst}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === 0 || transport.length === 0}
                        title="Первый вариант"
                    >
                        |←
                    </button>
                    <button 
                        onClick={navigateToPrev}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === 0 || transport.length === 0}
                        title="Предыдущий"
                    >
                        ←
                    </button>
                    <button 
                        onClick={navigateToNext}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === transport.length - 1 || transport.length === 0}
                        title="Следующий"
                    >
                        →
                    </button>
                    <button 
                        onClick={navigateToLast}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === transport.length - 1 || transport.length === 0}
                        title="Последний вариант"
                    >
                        →|
                    </button>
                </div>

                <div className="text-center">
                    <button 
                        className="btn btn-success"
                        onClick={() => handleSelectTransport(currentTransport.id)}
                    >
                        Выбрать
                    </button>
                </div>

                <div className='text-center mt-2 text-muted'>
                    Вариант {currentIndex + 1} из {transport.length}
                </div>
            </div>
        </div>
    );
}

export default HomeTransport;