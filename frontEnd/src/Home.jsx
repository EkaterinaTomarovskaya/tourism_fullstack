import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState([]); // Добавляем состояние для хранения данных

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => {
                console.log(res.data);
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


//Вместо перезагрузки
    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/' + id)
            .then(res => {
                // Удаляем клиента из состояния
                setData(data.filter(client => client.id !== id));
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
                            <th>Full Name</th>
                            <th>Contact Info</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((client, index) => (
                            <tr key={index}>
                                <td>{client.id}</td>
                                <td>{client.full_name}</td>
                                <td>{client.contact_info}</td>
                                <td>
                                    <Link to={`/read/${client.id}`} className="btn btn-sm btn-info">Read</Link>
                                    <Link to={`/edit/${client.id}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                                    <button onClick={ () => handleDelete(client.id)} className='btn btn-sm btn-danger'>Delete</button>
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
