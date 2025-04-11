import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeHotel() {
    const { client_id, tours_id } = useParams();
    const [hotelsByCategory, setHotelsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourCity, setTourCity] = useState('');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8081/hotel/${tours_id}`)
            .then(res => {
                if (res.data.length > 0) {
                    setTourCity(res.data[0].end_city);
                    
                    // Группируем отели по категориям
                    const grouped = res.data.reduce((acc, hotel) => {
                        const category = hotel.category;
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push(hotel);
                        return acc;
                    }, {});
                    
                    setHotelsByCategory(grouped);
                }
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
        .then(() => navigate(`/`))
        .catch(err => console.log(err));
    };

    const handleShowDetails = (hotel) => {
        setSelectedHotel(hotel);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHotel(null);
    };

    if (loading) return <div className="text-center my-5">Загрузка отелей...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;
    if (Object.keys(hotelsByCategory).length === 0) return <div className="alert alert-info text-center">Нет доступных отелей</div>;

    // Определяем порядок отображения категорий
    const categoriesOrder = ['5 звезд', '4 звезды', '3 звезды', '2 звезды', '1 звезда'];

     return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Выбор отелей в {tourCity}</h2>
                <Link to={`/country/${client_id}`} className="btn btn-primary">Назад</Link>
            </div>

            {categoriesOrder.map(category => (
                hotelsByCategory[category] && (
                    <div key={category} className="mb-5">
                        <div className="d-flex align-items-center mb-3">
                            <h3 className="mb-0 mr-3">{category}</h3>
                            <span className="badge bg-warning text-dark rounded-pill">
                                {hotelsByCategory[category].length} вариантов
                            </span>
                        </div>
                        
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {hotelsByCategory[category].map(hotel => (
                                <div key={hotel.id} className="col">
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">{hotel.name}</h5>
                                            <div className="card-text">
                                                <small className="text-muted d-block mb-2">
                                                    {hotel.location}
                                                </small>
                                                <strong className="text-success">
                                                    {hotel.price?.toLocaleString()} ₽
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0">
                                            <button 
                                                className="btn btn-primary w-50"
                                                onClick={() => handleSelectHotel(hotel.id)}>
                                                Выбрать
                                            </button>
                                            <button 
                                                    className="btn btn-outline-secondary w-40 ms-3"
                                                    onClick={() => handleShowDetails(hotel)}
                                                >
                                                    Подробнее
                                                </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        {/* Модальное окно с использованием стандартного Bootstrap */}
        {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedHotel?.name}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {selectedHotel && (
                                    <>
                            <div className="mb-3">
                                <h5>Информация об отеле</h5>
                                <p><strong>Категория:</strong> {selectedHotel.category}</p>
                                <p><strong>Город:</strong> {selectedHotel.end_city}</p>
                                <p><strong>Цена:</strong> {selectedHotel.price?.toLocaleString()} ₽</p>
                            </div>

                            {selectedHotel.description && (
                                <div className="mb-3">
                                    <h5>Описание</h5>
                                    <p>{selectedHotel.description}</p>
                                </div>
                            )}

                            {selectedHotel.amenities && (
                                <div className="mb-3">
                                    <h5>Удобства</h5>
                                    <p>{selectedHotel.amenities}</p>
                                </div>
                            )}

                            {selectedHotel.rooms !== undefined && (
                                <div className="mb-3">
                                    <h5>Количество комнат</h5>
                                    <p>{selectedHotel.rooms}</p>
                                </div>
                            )}

                            {selectedHotel.distance_to_sea !== undefined && (
                                <div className="mb-3">
                                    <h5>Расстояние до моря</h5>
                                    <p>{selectedHotel.distance_to_sea} км</p>
                                </div>
                            )}

                            {selectedHotel.contact_info && (
                                <div className="mb-3">
                                    <h5>Контактная информация</h5>
                                    <p>{selectedHotel.contact_info}</p>
                                </div>
                            )}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={handleCloseModal}
                                >
                                    Закрыть
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (selectedHotel) {
                                            handleSelectHotel(selectedHotel.id);
                                            handleCloseModal();
                                        }
                                    }}
                                >
                                    Выбрать этот отель
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeHotel;