import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'

function Update() {

    const {id} = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get('http://localhost:8081/read/' + id)
            .then(res => {
                console.log(res);
                if (res.data.length > 0) {
                    setValues({
                        name: res.data[0].full_name,
                        email: res.data[0].contact_info
                    });
                }
            })
            .catch(err => console.log(err));
    }, [id]); // Добавлено id в зависимости



    const [values, setValues] = useState({
        name: '',
        email: ''
    });

    const handleUpdate = (event) => {
        event.preventDefault();
        // Отправляем данные full_name и contact_info
        axios.put('http://localhost:8081/update/' + id, {
            full_name: values.name,
            contact_info: values.email
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
                <h2>Update clients</h2>
                <div className='mb-2'>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder='Enter Name' className='form-control' value={values.name}
                    onChange={e => setValues({...values, name: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Enter Email' className='form-control' value={values.email}
                    onChange={e => setValues({...values, email: e.target.value})}/>
                </div>
                <button className='btn btn-success'>Update</button>
            </form>
        </div>
    </div>
  )
}

export default Update