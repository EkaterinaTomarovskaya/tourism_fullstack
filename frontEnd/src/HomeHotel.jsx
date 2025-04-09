import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeHotel() {
    const {client_id, tours_id } = useParams();
    const [hotels, setHotels] = useState([]); // Переименовано в hotels для ясности
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourCity, setTourCity] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8081/hotel/${tours_id}`)
            .then(res => {
                setHotels(res.data); // Исправлено setTransport на setHotels
                if (res.data.length > 0) setTourCity(res.data[0].location); // Исправлено end_city на location
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching hotels:", err);
                setError('Ошибка загрузки вариантов отелей');
                setLoading(false);
            });
    }, [tours_id]);

    const handleSelectHotel = (hotel_id) => {
        axios.post(`http://localhost:8081/assign-hotel`, { 
            client_id, 
            tour_id: tours_id, 
            hotel_id
        })
        .then(() => navigate(`/`)) // После выбора отеля — переход на главную
        .catch(err => console.log(err));
    };

    const navigateToFirst = () => setCurrentIndex(0);
    const navigateToPrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
    const navigateToNext = () => setCurrentIndex(prev => Math.min(hotels.length - 1, prev + 1)); 
    const navigateToLast = () => setCurrentIndex(hotels.length - 1); 

    if (loading) return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3 text-center'>
                Загрузка вариантов отелей...
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

    if (hotels.length === 0) return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3 text-center alert alert-info'>
                Нет доступных вариантов отелей
            </div>
        </div>
    );

    const currentHotel = hotels[currentIndex]; 

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Выбор отелей в {tourCity}</h2>
                    <Link to={`/country/${client_id}`} className="btn btn-primary">Назад</Link>
                </div>

                <div className='card mb-3'>
                    <div className='card-body'>
                        <h5 className='card-title text-center mb-4'>
                            {currentHotel.name} - {currentHotel.category}
                        </h5>

                        <div className="mb-3">
                            <div><strong>Название:</strong> {currentHotel.name}</div>
                            <div><strong>Категория:</strong> {currentHotel.category}</div>
                            <div><strong>Расположение:</strong> {currentHotel.location}</div>
                            <div><strong>Цена:</strong> {currentHotel.price?.toLocaleString()} ₽</div>
                        </div>
                    </div>
                </div>

                {/* Кнопки навигации */}
                <div className='d-flex justify-content-center mb-4 gap-2'>
                    <button 
                        onClick={navigateToFirst}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === 0 || hotels.length === 0} 
                        title="Первый вариант"
                    >
                        |←
                    </button>
                    <button 
                        onClick={navigateToPrev}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === 0 || hotels.length === 0} 
                        title="Предыдущий"
                    >
                        ←
                    </button>
                    <button 
                        onClick={navigateToNext}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === hotels.length - 1 || hotels.length === 0} 
                        title="Следующий"
                    >
                        →
                    </button>
                    <button 
                        onClick={navigateToLast}
                        className='btn btn-outline-secondary'
                        disabled={currentIndex === hotels.length - 1 || hotels.length === 0} 
                        title="Последний вариант"
                    >
                        →|
                    </button>
                </div>

                <div className="text-center">
                    <button 
                        className="btn btn-success"
                        onClick={() => handleSelectHotel(currentHotel.id)} 
                    >
                        Выбрать
                    </button>
                </div>

                <div className='text-center mt-2 text-muted'>
                    Вариант {currentIndex + 1} из {hotels.length} 
                </div>
            </div>
        </div>
    );
}

export default HomeHotel;