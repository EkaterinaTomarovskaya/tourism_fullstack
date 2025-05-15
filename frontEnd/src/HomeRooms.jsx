import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeRooms() {
    // Правильная деструктуризация: room_id здесь не нужен на этапе загрузки страницы
    const { client_id, country_id, tour_id, transport_id, hotel_id } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const roomsRes = await axios.get(`http://localhost:8081/rooms/${hotel_id}`);
                setRooms(roomsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке:", err);
                setError("Ошибка загрузки данных");
                setLoading(false);
            }
        };

        fetchData();
    }, [hotel_id]);


    const handleSelectRoom = (room_id) => {
        axios.post(`http://localhost:8081/assign-room`, {
            client_id,
            country_id,
            tour_id,
            transport_id,
            hotel_id,
            room_id
        })
        .then(() => navigate(`/confirmation/${client_id}/${country_id}/${tour_id}/${transport_id}/${hotel_id}/${room_id}`))
        .catch(err => {
            console.error("Ошибка при выборе номера:", err);
            alert("Ошибка при выборе номера");
        });


    };


    const handleShowDetails = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    if (loading) return <div className="text-center my-5">Загрузка номеров...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;
    if (rooms.length === 0) return <div className="alert alert-info text-center">Нет доступных номеров в этом отеле</div>;

    return (
        <div className='container my-5'>
            <div className='mb-4'>
                <h2>Выбор номеров в отеле</h2>
                <Link to={`/hotels/${client_id}/${country_id}/${tour_id}/${transport_id}`} className="btn btn-primary">Назад к отелям</Link>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {rooms.map(room => (
                    <div key={room.id} className="col">
                        <div
                            className="card h-100 shadow-sm position-relative room-card"
                            onMouseEnter={() => setHoveredRoom(room.id)}
                            onMouseLeave={() => setHoveredRoom(null)}
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h5 className="card-title">Комната {room.room_number}</h5>
                                <p className="card-text">
                                    Тип: {room.room_type}<br />
                                    Вместимость: {room.capacity} чел.<br />
                                    <strong className="text-success">{room.price?.toLocaleString()}</strong>
                                </p>
                            </div>

                            {hoveredRoom === room.id && (
                                <div className="hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50 text-white rounded">
                                    <button
                                        className="btn btn-light mb-2"
                                        onClick={() => handleShowDetails(room)}
                                    >
                                        Планировка
                                    </button>
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={() => handleSelectRoom(room.id)}
                                    >
                                        Выбрать
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedRoom && (
                <div className="modal d-block" tabIndex="-1" role="dialog" onClick={handleCloseModal}>
                    <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">Информация о номере</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                        <p><strong>Тип:</strong> {selectedRoom.room_type}</p>
                        <p><strong>Описание:</strong> {selectedRoom.description}</p>
                        <p><strong>Удобства:</strong> {selectedRoom.amenities}</p>
                        <p><strong>Вместимость:</strong> {selectedRoom.capacity} чел.</p>
                        <p><strong>Фото:</strong></p>
                        <img src={selectedRoom.photo_url} alt={selectedRoom.room_type} className="img-fluid" />
                        </div>
                        <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleCloseModal}>Закрыть</button>
                        </div>
                    </div>
                    </div>
                </div>
                )}
        </div>
    );
}

export default HomeRooms;