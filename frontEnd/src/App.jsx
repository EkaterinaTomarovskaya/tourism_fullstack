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
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/read/:id' element={<Read />} />
            <Route path='/edit/:id' element={<Update />} />
            <Route path='/country/:id' element={<HomeCountry />} />
            <Route path='/tours/:client_id/:country_id' element={<HomeTours />} />
            <Route path='/transport/:client_id/:country_id/:tours_id' element={<HomeTransport />} />    
            <Route path="/hotels/:client_id/:tours_id" element={<HomeHotel />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
