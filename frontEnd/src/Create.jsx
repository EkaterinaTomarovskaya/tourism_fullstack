import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
    const [values, setValues] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        passport_number: '',
        phone: '',
        contact_info: ''
    });
    const navigate = useNavigate();

     // Регулярные выражения для проверки паспорта и телефона
     const passportRegex = /^\d{4}\s\d{6}$/; // Проверка на российский паспорт
     const phoneRegex = /^\+7\d{10}$/; // Проверка на российский номер телефона

    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверка паспорта
        if (!passportRegex.test(values.passport_number)) {
            alert("Некорректный номер паспорта. Пожалуйста, введите в формате: 1234 567890.");
            return;
        }

        // Проверка номера телефона
        if (!phoneRegex.test(values.phone)) {
            alert("Некорректный номер телефона. Пожалуйста, введите в формате: +7XXXXXXXXXX.");
            return;
        }

        // Отправляем данные на сервер
        axios.post('http://localhost:8081/clients', values)
        .then(res => {
            console.log(res);
            navigate('/');
        })
        .catch(err => console.log(err));
    };

  return (
    <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
            <form onSubmit={handleSubmit}>
                <h2>Добавить клиента</h2>
                <div className='mb-2'>
                    <label htmlFor="">Имя</label>
                    <input type="text" placeholder='Имя' className='form-control' 
                    onChange={e => setValues({...values, first_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Отчество</label>
                    <input type="text" placeholder='Отчество' className='form-control' 
                    onChange={e => setValues({...values, middle_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Фамилия</label>
                    <input type="text" placeholder='Фамилия' className='form-control' 
                    onChange={e => setValues({...values, last_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Паспорт</label>
                    <input type="text" placeholder='Паспорт' className='form-control'
                    onChange={e => setValues({...values, passport_number: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Телефон</label>
                    <input type="text" placeholder='Телефон' className='form-control'
                    onChange={e => setValues({...values, phone: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Email' className='form-control'
                    onChange={e => setValues({...values, contact_info: e.target.value})}/>
                </div>
                <button className='btn btn-success'>Добавить</button>
            </form>
        </div>
    </div>
  );
}

export default Create;
