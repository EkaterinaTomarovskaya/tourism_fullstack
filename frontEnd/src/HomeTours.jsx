import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function HomeTours() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/tours')
            .then(res => {
                console.log("Data from server:", res.data);
                if (Array.isArray(res.data)) {
                    setTours(res.data);
                } else {
                    console.error("Unexpected response format", res.data);
                    setTours([]); // Если данные не массив, очищаем
                }
            })
            .catch(err => console.log("Fetch error:", err));
    }, []);

    const handleSelectTours = (tourId) => {
        axios.post('http://localhost:8081/assign-tour', { tour_id: tourId })
            .then(() => {
                navigate('/tours'); // Перенаправление на страницу туров
            })
            .catch(err => console.log("Error assigning tour:", err));
    };

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Select a Tour</h2>
                <div className='d-flex justify-content-end'>
                    <Link to='/' className='btn btn-primary'>Back</Link>
                </div>

                <h3>Available Tours</h3>
                <ul className='list-group'>
                    {tours.length > 0 ? (
                        tours.map((tour) => (
                            <li key={tour.id} className='list-group-item d-flex justify-content-between align-items-center'>
                                <span>{tour.name} - {tour.city} ({tour.country})</span>
                                <button 
                                    className='btn btn-success btn-sm'
                                    onClick={() => handleSelectTours(tour.id)}>
                                    Choose
                                </button>
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
