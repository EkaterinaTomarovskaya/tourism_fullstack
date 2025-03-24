import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function HomeTours() {
    const { client_id, country_id } = useParams(); // Получаем client_id и country_id из URL
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Отправляем запрос с параметром country_id
        axios.get(`http://localhost:8081/tours/${client_id}/${country_id}`)
            .then((res) => {
                setTours(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching tours:", err);
                setError('Failed to load tours');
                setLoading(false);
            });
    }, [client_id, country_id]); // Делаем запрос при изменении client_id или country_id

    return (
        <div className="d-flex vh-100 bg-white justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <h2>Select a Tour</h2>
                <div className="d-flex justify-content-end">
                    <Link to={`/country/${client_id}`} className="btn btn-primary">Back</Link>
                </div>

                <h3>Available Tours in {country_id}</h3> {/* Отображаем название страны */}
                {loading && <p>Loading tours...</p>}
                {error && <p>{error}</p>}
                <ul className="list-group">
                    {tours.length > 0 ? (
                        tours.map((tour) => (
                            <li key={tour.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span><strong>{tour.name}</strong> - {tour.city} ({tour.country})</span><br />
                                    <span><strong>Start Date:</strong> {new Date(tour.start_date).toLocaleDateString()}</span><br />
                                    <span><strong>End Date:</strong> {new Date(tour.end_date).toLocaleDateString()}</span><br />
                                    <span><strong>Price:</strong> {tour.price} ₽</span>
                                </div>
                                <button className="btn btn-success btn-sm">Choose</button>
                            </li>
                        ))
                    ) : (
                        <p>No tours available</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default HomeTours;
