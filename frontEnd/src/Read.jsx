import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function Read() {
    const { id } = useParams();
    const [client, setClient] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/read/' + id)
            .then(res => {
                console.log(res);
                setClient(res.data);
            })
            .catch(err => console.log(err));
    }, [id]); // Добавлено id в зависимости

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'> 
                <h2>Clients Detail</h2>
                {client.length > 0 && ( // Проверяем, есть ли данные
                    <div className='p-2'>
                        <h2>{client[0].id}</h2>
                        <h2>{client[0].first_name}</h2>
                        <h2>{client[0].middle_name}</h2>
                        <h2>{client[0].last_name}</h2>
                        <h2>{client[0].passport_number}</h2>
                        <h2>{client[0].phone}</h2>
                        <h2>{client[0].contact_info}</h2>
                    </div>
                )}
                <Link to="/" className='btn btn-primary me-2'>Back</Link>
                <Link to={`/edit/${client.id}`} className='btn btn-info'>Edit</Link>            
            </div>
        </div>
    );
}

export default Read;
