import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState([]); // Добавляем состояние для хранения данных

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => {
                console.log(res.data); // Получаем клиентов из базы
                setData(res.data); // Обновляем состояние данными из запроса
            })
            .catch(err => console.log(err));
    }, []);

    //ТУТ СТРАНИЦА ПЕРЕЗАГРУЖАЕТСЯ
    // const handleDelete = (id) => {
    //     axios.delete('http://localhost:8081/delete/' + id)
    //     .then(res => {
    //         location.reload(); 
    //     })
    //     .catch(err => console.log(err));
    // }


//Вместо перезагрузки/ Функция удаления клиента
    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/' + id)
            .then(res => {
                // Удаляем клиента из состояния без перезагрузки
                setData(data.filter(client => client.id !== id)); // Обновляем список
            })
            .catch(err => console.log(err));
    }
    

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Clients List</h2>
                <div className='d-flex justify-content-end'>
                    <Link to="/create" className='btn btn-success'>Create +</Link>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Middle name</th>
                            <th>Last name</th>
                            <th>Passport Number</th>
                            <th>Phone</th>
                            <th>Contact Info</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((client, index) => (
                            <tr key={index}>
                                <td>{client.id}</td>
                                <td>{client.first_name}</td>
                                <td>{client.middle_name}</td>
                                <td>{client.last_name}</td>
                                <td>{client.passport_number}</td>
                                <td>{client.phone}</td>
                                <td>{client.contact_info}</td>
                                <td>
                                <Link to={`/read/${client.id}`} className="btn btn-info btn-sm mx-1">
                                <i className="bi bi-eye"></i> Read
                                </Link>                                    
                                <Link to={`/edit/${client.id}`} className="btn btn-primary btn-sm mx-1">
                                <i className="bi bi-pencil-square"></i> Edit
                                </Link>
                                <button onClick={() => handleDelete(client.id)} className="btn btn-danger btn-sm mx-1">
                                <i className="bi bi-trash"></i> Delete
                                </button>
                                <Link to={`/country/${client.id}`} className="btn btn-warning btn-sm mx-1">
                                <i className="bi bi-globe"></i> Countries
                                </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;
