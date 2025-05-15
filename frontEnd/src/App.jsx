import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Create from './Create';
import Read from './Read';
import Update from './Update';
import HomeCountry from './HomeCountry';
import HomeTours from './HomeTours';
import HomeTransport from './HomeTransport';
import HomeHotel from './HomeHotel';
import HomeRooms from './HomeRooms';
import ClientSummary from './ClientSummary';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/create' element={<Create />} />
                <Route path='/read/:id' element={<Read />} />
                <Route path='/edit/:id' element={<Update />} />
                {/* Обновлено: Передаем client_id в HomeCountry */}
                <Route path="/country/:client_id" element={<HomeCountry />} />
                {/* Обновлено: Маршрут для туров теперь ожидает country_id */}
                <Route path='/tours/:client_id/:country_id' element={<HomeTours />} />
                {/* Обновлено: Маршрут для транспорта теперь ожидает country_id и tour_id */}
                <Route path='/transport/:client_id/:country_id/:tour_id' element={<HomeTransport />} />
                {/* Обновлено: Маршрут для отелей теперь ожидает country_id, tour_id и transport_id */}
                <Route path="/hotels/:client_id/:country_id/:tour_id/:transport_id" element={<HomeHotel />} />
                {/* Обновлено: Маршрут для комнат теперь ожидает все предыдущие ID */}
                <Route path="/rooms/:client_id/:country_id/:tour_id/:transport_id/:hotel_id" element={<HomeRooms />} />
                {/* Обновлено: Маршрут для ClientSummary теперь ожидает все ID */}
                <Route path='/confirmation/:client_id/:country_id/:tour_id/:transport_id/:hotel_id/:room_id' element={<ClientSummary/>} />            </Routes>
        </BrowserRouter>
    );
}

export default App;