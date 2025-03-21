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
                <h2>Add client</h2>
                <div className='mb-2'>
                    <label htmlFor="">First Name</label>
                    <input type="text" placeholder='Enter First Name' className='form-control' 
                    onChange={e => setValues({...values, first_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Middle Name</label>
                    <input type="text" placeholder='Enter Middle Name' className='form-control' 
                    onChange={e => setValues({...values, middle_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Last Name</label>
                    <input type="text" placeholder='Enter Last Name' className='form-control' 
                    onChange={e => setValues({...values, last_name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Passport Number</label>
                    <input type="text" placeholder='Enter Passport Number' className='form-control'
                    onChange={e => setValues({...values, passport_number: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Phone</label>
                    <input type="text" placeholder='Enter Phone' className='form-control'
                    onChange={e => setValues({...values, phone: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Enter Email' className='form-control'
                    onChange={e => setValues({...values, contact_info: e.target.value})}/>
                </div>
                <button className='btn btn-success'>Submit</button>
            </form>
        </div>
    </div>
  );
}

export default Create;
