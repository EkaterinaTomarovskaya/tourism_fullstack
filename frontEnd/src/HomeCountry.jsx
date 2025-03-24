import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function HomeCountry() {
    const { id } = useParams(); // Получаем ID клиента из URL
    const navigate = useNavigate();
    
    const [countries, setCountries] = useState([]); // Список стран

    useEffect(() => {
        axios.get('http://localhost:8081/countries')
            .then(res => {
                // Сортировка стран по алфавиту
                const sortedCountries = res.data.sort((a, b) => a.country_name.localeCompare(b.country_name));
                setCountries(sortedCountries);
            })
            .catch(err => console.log(err));
    }, []);

    // Функция для выбора страны и привязки ее к клиенту
    const handleSelectCountry = (countryName) => {
        axios.post(`http://localhost:8081/assign-country`, { client_id: id, country_name: countryName })
            .then(() => {
                // Перенаправляем на страницу туров, передавая ID клиента и название страны
                navigate(`/tours/${id}/${countryName}`);
            })
            .catch(err => console.log(err));
    };


    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Choose country</h2> 
                <div className='d-flex justify-content-end'>
                    <Link to="/" className='btn btn-primary'>Back</Link>
                </div>

                <h3>Availible countries</h3>
                <ul className='list-group'>
                    {countries.map((country) => (
                        <li key={country.id} className='list-group-item d-flex justify-content-between align-items-center'>
                            <span>{country.country_name}</span>
                            <button 
                                className='btn btn-success btn-sm'
                                onClick={() => handleSelectCountry(country.country_name)}>Choose
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
  }


export default HomeCountry;