import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function HomeCountry() {
    const { id } = useParams(); // Получаем ID клиента из URL
    const navigate = useNavigate();
    
    const [countries, setCountries] = useState([]); // Список стран

    useEffect(() => {
        axios.get('http://localhost:8081/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.log(err));
    }, []);

    // Функция для выбора страны и привязки ее к клиенту
    const handleSelectCountry = (countryId) => {
        axios.post(`http://localhost:8081/assign-country`, { client_id: id, country_id: countryId })
            .then(() => {
                navigate(`/tours/${id}`); // Перенаправление на страницу туров
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Available countries</h2>
                <div className='d-flex justify-content-end'>
                    <Link to="/" className='btn btn-primary'>Back</Link>
                </div>
                
                <h3>Available countries</h3>
                <ul className='list-group'>
                    {countries.map((country) => (
                        <li key={country.id} className='list-group-item d-flex justify-content-between align-items-center'>
                            <span>{country.country_name}</span>
                            <button 
                                className='btn btn-success btn-sm'
                                onClick={() => handleSelectCountry(country.id)}>Choose
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomeCountry;