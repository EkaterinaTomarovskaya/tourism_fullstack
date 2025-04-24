import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => {
                // Сортируем данные по ID (от меньшего к большему)
                const sortedData = res.data.sort((a, b) => a.id - b.id);
                setData(sortedData);
                // Устанавливаем индекс на последнюю запись (самую новую)
                if (sortedData.length > 0) {
                    setCurrentIndex(sortedData.length - 1);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/' + id)
            .then(() => {
                const newData = data.filter(client => client.id !== id);
                setData(newData);
                // Корректируем индекс после удаления
                if (currentIndex >= newData.length) {
                    setCurrentIndex(Math.max(0, newData.length - 1));
                }
            })
            .catch(err => console.log(err));
    };

    const getRecordTitle = (index) => {
        const total = data.length;
        const positionFromEnd = total - index;
        
        if (positionFromEnd === 1) return "Последняя запись";
        if (positionFromEnd === 2) return "Предпоследняя запись";
        return `Запись ${positionFromEnd}`;
    };

    // Навигация от новых к старым:
    const navigateToOldest = () => setCurrentIndex(0); // Самый старый (первый)
    const navigateToNewer = () => setCurrentIndex(prev => Math.min(data.length - 1, prev + 1)); // К более новым
    const navigateToOlder = () => setCurrentIndex(prev => Math.max(0, prev - 1)); // К более старым
    const navigateToNewest = () => setCurrentIndex(data.length - 1); // Самый новый (последний)

    const currentClient = data[currentIndex] || {};

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2 className='text-center mb-4'>
                    {data.length > 0 ? getRecordTitle(currentIndex) : 'Нет записей'}
                </h2>  

                <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
                    <div 
                        className='bg-white rounded p-4 shadow' 
                        style={{
                            width: '500px',
                            height: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>

                        <h2 className='text-center mb-3' style={{ fontSize: '2rem' }}>
                            {data.length > 0 ? getRecordTitle(currentIndex) : 'Нет записей'}
                        </h2>

                        {data.length > 0 && (
                            <div className='card flex-grow-1 mb-3'>
                                <div className='card-body'>
                                    <h5 className='card-title' style={{ fontSize: '2rem' }}>
                                        {currentClient.last_name} {currentClient.first_name} {currentClient.middle_name}
                                    </h5>
                                    <p className='card-text' style={{ fontSize: '1.5rem' }}>
                                        <strong>Паспорт:</strong> {currentClient.passport_number}<br/>
                                        <strong>Телефон:</strong> {currentClient.phone}<br/>
                                        <strong>Контакт:</strong> {currentClient.contact_info}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className='d-flex justify-content-center gap-3 mb-3'>
                            <button onClick={navigateToOldest} className='btn btn-outline-secondary' disabled={currentIndex === 0 || data.length === 0}>|←</button>
                            <button onClick={navigateToOlder} className='btn btn-outline-secondary' disabled={currentIndex === 0 || data.length === 0}>←</button>
                            <button onClick={navigateToNewer} className='btn btn-outline-secondary' disabled={currentIndex === data.length - 1 || data.length === 0}>→</button>
                            <button onClick={navigateToNewest} className='btn btn-outline-secondary' disabled={currentIndex === data.length - 1 || data.length === 0}>→|</button>
                        </div>

                        <div className='d-flex justify-content-center gap-3 mb-3'>
                            <Link to={`/read/${currentClient.id}`} className='btn btn-info'>Читать</Link>
                            <Link to={`/edit/${currentClient.id}`} className='btn btn-primary'>Редактировать</Link>
                            <button onClick={() => handleDelete(currentClient.id)} className='btn btn-danger'>Удалить</button>
                            <Link to={`/country/${currentClient.id}`} className='btn btn-warning'>Страны</Link>
                        </div>

                        <div className='text-center'>
                            <Link to="/create" className='btn btn-success'>+ Добавить нового клиента</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;