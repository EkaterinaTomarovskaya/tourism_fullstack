import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'

function Update() {

    const {id} = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        passport_number: '',
        phone: '',
        contact_info: ''
    });

    // Регулярные выражения для проверки паспорта и телефона
    const passportRegex = /^\d{4}\s\d{6}$/; // Проверка на российский паспорт
    const phoneRegex = /^\+7\d{10}$/; // Проверка на российский номер телефона

    useEffect(() => {
        axios.get('http://localhost:8081/read/' + id)
            .then(res => {
                console.log(res);
                if (res.data.length > 0) {
                    setValues({
                        first_name: res.data[0].first_name,
                        middle_name: res.data[0].middle_name,
                        last_name: res.data[0].last_name,
                        passport_number: res.data[0].passport_number,
                        phone: res.data[0].phone,
                        contact_info: res.data[0].contact_info
                    });
                }
            })
            .catch(err => console.log(err));
    }, [id]); // Добавлено id в зависимости

    const handleUpdate = (event) => {
        event.preventDefault();

    //Проверка папорта
    if(!passportRegex.test(values.passport_number)) {
        alert("Некорректный номер папорта. Пожалуйста, введите в формате: 1234 567890.");
        return
    }

    //Проверка номера телефона
    if(!phoneRegex.test(values.phone)) {
        alert("Некорректный номер телефона. Пожалуйста, введите в формате: +7XXXXXXXXXX.");
        return;
    }

        // Отправляем данные full_name и contact_info
        axios.put('http://localhost:8081/update/' + id, {
            first_name: values.first_name,
            middle_name: values.middle_name,
            last_name: values.last_name,
            passport_number: values.passport_number,
            phone: values.phone,
            contact_info: values.contact_info
        })
        
        .then(res => {
            console.log(res);
            navigate('/');
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={handleUpdate}>
                    <h2>Обновить данные клиента</h2>
                    <div className='mb-2'>
                        <label htmlFor="">Имя</label>
                        <input type="text" placeholder='Имя' className='form-control' value={values.first_name}
                        onChange={e => setValues({...values, first_name: e.target.value})}/>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="">Отчество</label>
                        <input type="text" placeholder='Отчество' className='form-control' value={values.middle_name}
                        onChange={e => setValues({...values, middle_name: e.target.value})}/>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="">Фамилия</label>
                        <input type="text" placeholder='Фамилия' className='form-control' value={values.last_name}
                        onChange={e => setValues({...values, last_name: e.target.value})}/>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="">Паспорт</label>
                        <input type="passport" placeholder='Паспорт' className='form-control'
                        onChange={e => setValues({...values, passport_number: e.target.value})}/>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="">Телефон</label>
                        <input type="phone" placeholder='Телефон' className='form-control' value={values.phone}
                        onChange={e => setValues({...values, phone: e.target.value})}/> 
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="">Email</label>
                        <input type="email" placeholder='Email' className='form-control' value={values.contact_info}
                        onChange={e => setValues({...values, contact_info: e.target.value})}/> 
                    </div>
                    <button className='btn btn-success'>Обновить</button>
                </form>
            </div>
        </div>
    )
    }

export default Update