import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'; // Bootstrap для стилей
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Create from './Create'
import Read from './Read';
import Update from './Update';
import HomeCountry from './HomeCountry';
import HomeTours from './HomeTours'




function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/read/:id' element={<Read />} />
            <Route path='/edit/:id' element={<Update />} />
            <Route path='/country/:id' element={<HomeCountry />} />
            <Route path='/tours/:id' element={<HomeTours />} />

            
        </Routes>
    </BrowserRouter>
  )
}

export default App

// Управляет маршрутизацией между страницами