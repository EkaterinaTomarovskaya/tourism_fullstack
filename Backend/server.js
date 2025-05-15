import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());  // Разрешает запросы с других доменов
app.use(express.json()); // Сервер понимал JSON-запросы

// Подключение к mysql
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'katytom',
    database: 'tourism_db'
});

//------------------------------КЛИЕНТЫ------------------------------------//

// Маршрут для получения всех клиентов
app.get('/', (req, res) => {
    const sql = "SELECT * FROM clients";
    db.query(sql, (err, result) => { // Выполняем запрос к базе
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
});

// Маршрут для добавления клиента
app.post('/clients', (req, res) => {
    const sql = "INSERT INTO clients (first_name, middle_name, last_name, passport_number, phone, contact_info) VALUES (?, ?, ?, ?, ?, ?)";
    const { first_name, middle_name, last_name, passport_number, phone, contact_info } = req.body; // Получаем данные из запроса

    db.query(sql, [first_name, middle_name, last_name, passport_number, phone, contact_info], (err, result) => { // Выполняем SQL-запрос
        if (err) return res.json({ Message: "Error inside server", error: err });
        return res.json({ Message: "Client added successfully", result });
    });
});

// Маршрут для получения одного клиента
app.get('/read/:id', (req, res) => {
    const sql = "SELECT * FROM clients WHERE ID = ?"; // SQL-запрос по ID
    const id = req.params.id; // Берём ID из URL

    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
});

// Маршрут для обновления клиента
app.put('/update/:id', (req, res) => {
    const { first_name, middle_name, last_name, passport_number, phone, contact_info } = req.body; // Извлекаем данные из тела запроса
    const id = req.params.id;

    const sql = "UPDATE clients SET first_name = ?, middle_name = ?, last_name = ?, passport_number = ?, phone = ?, contact_info = ? WHERE id = ?";
    db.query(sql, [first_name, middle_name, last_name, passport_number, phone, contact_info, id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server", error: err });
        return res.json({ Message: "Client updated successfully", result });
    });
});

// Маршрут для удаления клиента
app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM clients WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json({ Message: "Client deleted successfully", result });
    });
});

// Маршрут для получения всех клиентов
app.get('/countries', (req, res) => {
    const sql = "SELECT * FROM countries";
    db.query(sql, (err, result) => { // Выполняем запрос к базе
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
});

// Маршрут для добавления клиента
app.post('/countries', (req, res) => {
    const sql = "INSERT INTO clients (country_name) VALUES (?)";
    const { country_name } = req.body; // Получаем данные из запроса

    db.query(sql, [country_name], (err, result) => { // Выполняем SQL-запрос
        if (err) return res.json({ Message: "Error inside server", error: err });
        return res.json({ Message: "Client added successfully", result });
    });
});


//------------------------------СТРАНЫ------------------------------------//

// Получаем список стран для клиента
app.get('/countries/:id', (req, res) => {
    const sql = "SELECT * FROM countries WHERE id = ?"; // Обратите внимание на WHERE id = ?
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.json({ message: "Error fetching countries", error: err });
        if (result.length === 0) {
            return res.status(404).json({ message: "Country not found" });
        }
        return res.json(result[0]); // Или просто result, если ожидаете массив
    });
});

// Добавляем страну клиенту
app.post('/countries/:id', (req, res) => {
    const { country_name } = req.body;
    const sql = "INSERT INTO countries (client_id, country_name) VALUES (?, ?)";
    
    db.query(sql, [req.params.id, country_name], (err, result) => {
        if (err) return res.json({ message: "Error adding country", error: err });
        return res.json({ id: result.insertId, country_name });
    });
});

// Привязка страны к клиенту
app.post('/assign-country', (req, res) => {
    const { client_id, country_id } = req.body;
    const sql = "INSERT INTO client_itineraries (client_id, country_id) VALUES (?, ?)";
    
    db.query(sql, [client_id, country_id], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Страна успешно добавлена клиенту!" });
    });
});

// Исправленный POST /countries
app.post('/countries', (req, res) => {
    const { country_name, flag_url } = req.body;
    const sql = "INSERT INTO countries (country_name, flag_url) VALUES (?, ?)";
    
    db.query(sql, [country_name, flag_url], (err, result) => {
        if (err) return res.json({ Message: "Error adding country", error: err });
        return res.json({ Message: "Country added successfully", result });
    });
});



//------------------------------ТУРЫ------------------------------------//

// Получаем список туров для конкретного клиента и страны
app.get('/tours/:client_id/:country_id', (req, res) => {
    const { client_id, country_id } = req.params;
    const sql = "SELECT * FROM tours WHERE country_id = ?";
    db.query(sql, [country_id], (err, result) => {
        if (err) {
            console.error("Error fetching tours:", err);
            return res.json({ message: "Error fetching tours", error: err });
        }
        return res.json(result);
    });
});
app.get('/tours/:tour_id', (req, res) => {
    const { tour_id } = req.params;
    const sql = "SELECT * FROM tours WHERE id = ?";
    db.query(sql, [tour_id], (err, result) => {
        if (err) {
            console.error("Error fetching tour:", err);
            return res.status(500).json({ message: "Error fetching tour", error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Tour not found" });
        }
        return res.json(result[0]); // Или просто result, если ожидаете массив
    });
});

// Исправленный POST /tours
app.post('/tours', (req, res) => {
    const { name, country, country_id, end_city, start_date, end_date, price } = req.body;
    const sql = "INSERT INTO tours (name, country, country_id, end_city, start_date, end_date, price) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, country, country_id, end_city, start_date, end_date, price], (err, result) => {
        if (err) return res.json({ message: "Error adding tour", error: err });
        return res.json({ id: result.insertId, name, country, country_id, end_city, start_date, end_date, price });
    });
});


// Привязка тура к клиенту и стране
app.post('/assign-tours', (req, res) => {
    const { client_id, country_id, tour_id } = req.body; // Добавили client_id
    const sql = "INSERT INTO client_itineraries (client_id, country_id, tour_id) VALUES (?, ?, ?)"; // Привязка по client_id и tour_id

    db.query(sql, [client_id, country_id, tour_id], (err, result) => {
        if (err) {
            console.error("Error assigning tour:", err);
            return res.json({ message: "Error assigning tour", error: err });
        }
        res.json({ message: "Tour successfully assigned!" });
    });
});



//------------------------------ТРАНСПОРТ------------------------------------//
app.get('/transport/details/:transport_id', (req, res) => { // Изменили название маршрута, чтобы избежать конфликтов
    const { transport_id } = req.params;
    const sql = "SELECT * FROM transport WHERE id = ?"; 
    db.query(sql, [transport_id], (err, result) => {
        if (err) {
            console.error("Ошибка при получении транспорта по ID:", err);
            return res.status(500).json({ message: "Ошибка при получении транспорта", error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Транспорт не найден" });
        }
        return res.json(result[0]); // Возвращаем ТОЛЬКО ОДИН объект
    });
});

// Маршрут для получения транспорта по стране и туру
app.get('/transport/:tour_id', (req, res) => {
    const { tour_id } = req.params;
    const tourSql = "SELECT end_city FROM tours WHERE id = ?";
    
    db.query(tourSql, [tour_id], (tourErr, tourResult) => {
        if (tourErr || tourResult.length === 0) {
            return res.status(404).json({ message: "Tour not found" });
        }
        const city = tourResult[0].end_city;
        const transportSql = "SELECT * FROM transport WHERE end_city = ?";
        db.query(transportSql, [city], (transportErr, transportResult) => {
            if (transportErr) {
                return res.status(500).json({ message: "Error fetching transport", error: transportErr });
            }
            return res.json(transportResult); // Возвращаем МАССИВ объектов
        });
    });
});


// Добавляем транспорт клиенту
app.post('/transport', (req, res) => {
    const { transport_type, company, flight_number, start_city, end_city, start_date, end_date, travel_time, price, country } = req.body;
    const sql = "INSERT INTO transport (transport_type, company, flight_number, start_city, end_city, start_date, end_date, travel_time, price, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [transport_type, company, flight_number, start_city, end_city, start_date, end_date, travel_time, price, country], (err, result) => {
        if (err) {
            console.error("Error adding transport:", err);
            return res.json({ message: "Error adding transport", error: err });
        }
        return res.json({ id: result.insertId, transport_type, company, flight_number, start_city, end_city, start_date, end_date, travel_time, price, country });
    });
});


// Привязка тура к клиенту и стране
app.post('/assign-transport', (req, res) => {
    const { client_id, country_id, tour_id, transport_id } = req.body;
    // Исправленный SQL-запрос для включения country_id и других существующих полей в client_itineraries
    const sql = "INSERT INTO client_itineraries (client_id, country_id, tour_id, transport_id, created_at) VALUES (?, ?, ?, ?, NOW())";

    db.query(sql, [client_id, country_id, tour_id, transport_id], (err, result) => {
        if (err) {
            console.error("Ошибка при назначении транспорта:", err);
            return res.json({ message: "Ошибка при назначении транспорта", error: err });
        }
        res.json({ message: "Транспорт успешно назначен!" });
    });
});


//------------------------------ОТЕЛИ------------------------------------//
// Маршрут для получения транспорта по стране и туру
app.get('/hotel/:tour_id', (req, res) => {
    const { tour_id } = req.params;
    const tourSql = "SELECT end_city FROM tours WHERE id = ?";
    
    db.query(tourSql, [tour_id], (tourErr, tourResult) => {
        if (tourErr) {
            console.error("Error fetching tour:", tourErr);
            return res.status(500).json({ message: "Error fetching tour", error: tourErr });
        }
        if (tourResult.length === 0) {
            return res.status(404).json({ message: "Tour not found" });
        }
        const city = tourResult[0].end_city;
        const hotelSql = "SELECT * FROM hotels WHERE end_city = ?";
        db.query(hotelSql, [city], (hotelErr, hotelResult) => {
            if (hotelErr) {
                console.error("Error fetching hotels:", hotelErr);
                return res.status(500).json({ message: "Error fetching hotels", error: hotelErr });
            }
            return res.json(hotelResult);
        });
    });
});



// Получение информации об отеле по ID
app.get('/hotels/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM hotels WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching hotel:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        
        res.json(result[0]);
    });
});



// Добавляем транспорт клиенту
app.post('/hotel', (req, res) => {
    const { name, category, end_city, price, description, amenities, rooms, distance_to_sea, contact_info } = req.body;
    const sql = "INSERT INTO hotels (name, category, end_city, price, description, amenities, rooms, distance_to_sea, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, category, end_city, price, description, amenities, rooms, distance_to_sea, contact_info], (err, result) => {
        if (err) {
            console.error("Error adding hotel:", err);
            return res.json({ message: "Error adding hotel", error: err });
        }
        return res.json({ id: result.insertId, name, category, end_city, price, description, amenities, rooms, distance_to_sea, contact_info });
    });
});


// Привязка тура к клиенту и стране
// Исправленный POST /assign-hotel
app.post('/assign-hotel', (req, res) => {
    const { client_id, country_id, tour_id, transport_id, hotel_id } = req.body;
    // Исправленный SQL-запрос для включения всех соответствующих полей
    const sql = "INSERT INTO client_itineraries (client_id, country_id, tour_id, transport_id, hotel_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())";

    db.query(sql, [client_id, country_id, tour_id, transport_id, hotel_id], (err, result) => {
        if (err) return res.json({ message: "Ошибка при назначении отеля", error: err });
        res.json({ message: "Отель успешно назначен!" });
    });
});


//------------------------------КОМНАТЫ------------------------------------//
// Получаем информацию о конкретной комнате по ID
app.get('/rooms/details/:room_id', (req, res) => {
    const { room_id } = req.params;
    const sql = "SELECT * FROM rooms WHERE id = ?";
    db.query(sql, [room_id], (err, result) => {
        if (err) {
            console.error("Error fetching room details:", err);
            return res.status(500).json({ message: "Error fetching room details", error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.json(result[0]);
    });
});


// Получаем список комнат для конкретного отеля
app.get('/rooms/:hotel_id', (req, res) => {
    const { hotel_id } = req.params;
    const sql = "SELECT * FROM rooms WHERE hotel_id = ?";
    
    db.query(sql, [hotel_id], (err, result) => {
        if (err) {
            console.error("Error fetching rooms:", err);
            return res.status(500).json({ message: "Error fetching rooms", error: err });
        }
        return res.json(result);
    });
});

// Добавляем комнату в отель
app.post('/rooms', (req, res) => {
    const { hotel_id, room_number, room_type, description, amenities, capacity, available_rooms, photo_url } = req.body;
    const sql = "INSERT INTO rooms (hotel_id, room_number, room_type, description, amenities, capacity, available_rooms, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [hotel_id, room_number, room_type, description, amenities, capacity, available_rooms, photo_url], (err, result) => {
        if (err) {
            console.error("Error adding room:", err);
            return res.status(500).json({ message: "Error adding room", error: err });
        }
        return res.json({ 
            id: result.insertId, 
            hotel_id, 
            room_number, 
            room_type, 
            description, 
            amenities ,
            capacity,
            available_rooms,
            photo_url
        });
    });
});

// Привязка комнаты к клиенту, туру и отелю
app.post('/assign-room', async (req, res) => {
    console.log("Данные из фронта:", req.body);

    // Исправленная деструктуризация на основе требуемых полей
    const { client_id, country_id, tour_id, transport_id, hotel_id, room_id } = req.body;

    if (!client_id || !country_id || !tour_id || !transport_id || !hotel_id || !room_id) {
        return res.status(400).json({ message: "Отсутствуют обязательные поля" });
    }

    try {
        // Раскомментировать и использовать правильный SQL-запрос для client_itineraries
        const sql = "INSERT INTO client_itineraries (client_id, country_id, tour_id, transport_id, hotel_id, room_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        await db.query(sql, [client_id, country_id, tour_id, transport_id, hotel_id, room_id]);

        res.status(200).json({ message: "Успешно назначено" });
    } catch (err) {
        console.error("Ошибка при записи в БД:", err);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
});



















// Маршрут для сохранения выбора страны
app.post('/clients/:client_id/countries', (req, res) => {
    const { client_id } = req.params;
    const { country_id } = req.body;
    
    const sql = 'INSERT INTO client_countries (client_id, country_id) VALUES (?, ?)';
    db.query(sql, [client_id, country_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Country selected successfully', result });
    });
});

// Маршрут для сохранения выбора тура
app.post('/clients/:client_id/tours', (req, res) => {
    const { client_id } = req.params;
    const { tour_id } = req.body;
    
    const sql = 'INSERT INTO client_tours (client_id, tour_id) VALUES (?, ?)';
    db.query(sql, [client_id, tour_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Tour selected successfully', result });
    });
});

// Маршрут для сохранения выбора транспорта
app.post('/clients/:client_id/transports', (req, res) => {
    const { client_id } = req.params;
    const { transport_id } = req.body;
    
    const sql = 'INSERT INTO client_transports (client_id, transport_id) VALUES (?, ?)';
    db.query(sql, [client_id, transport_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Transport selected successfully', result });
    });
});

// Маршрут для сохранения выбора отеля
app.post('/clients/:client_id/hotels', (req, res) => {
    const { client_id } = req.params;
    const { hotel_id } = req.body;
    
    const sql = 'INSERT INTO client_hotels (client_id, hotel_id) VALUES (?, ?)';
    db.query(sql, [client_id, hotel_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Hotel selected successfully', result });
    });
});

// Маршрут для сохранения выбора комнаты
app.post('/clients/:client_id/rooms', (req, res) => {
    const { client_id } = req.params;
    const { room_id, check_in, check_out } = req.body;
    
    const sql = 'INSERT INTO client_rooms (client_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)';
    db.query(sql, [client_id, room_id, check_in, check_out], (err, result) => {
        if (err) return res.status(508).json({ error: err.message });
        return res.json({ message: 'Room booked successfully', result });
    });
});



// Запускаем сервер
app.listen(8081, () => {
    console.log("Listening on port 8081");
});