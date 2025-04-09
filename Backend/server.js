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
    const sql = "SELECT * FROM countries WHERE client_id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.json({ message: "Error fetching countries", error: err });
        return res.json(result);
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
    const sql = "INSERT INTO client_countries (client_id, country_id) VALUES (?, ?)";
    
    db.query(sql, [client_id, country_id], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Страна успешно добавлена клиенту!" });
    });
});

// Получаем список стран для клиента
app.get('/countries/:id', (req, res) => {
    const sql = "SELECT * FROM countries WHERE client_id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.json({ message: "Error fetching countries", error: err });
        return res.json(result);
    });
});




//------------------------------ТУРЫ------------------------------------//

// Получаем список туров для конкретного клиента и страны
app.get('/tours/:client_id/:country_id', (req, res) => {
    const { client_id, country_id } = req.params;
    const sql = "SELECT * FROM tours WHERE country = ?";
    db.query(sql, [country_id], (err, result) => {
        if (err) {
            console.error("Error fetching tours:", err);
            return res.json({ message: "Error fetching tours", error: err });
        }
        return res.json(result);
    });
});

// Добавляем тур клиенту
app.post('/tours', (req, res) => {
    const { name, country_id, city, start_date, end_date, price } = req.body;
    const sql = "INSERT INTO tours (name, country_id, end_city, start_date, end_date, price) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, country_id, city, start_date, end_date, price], (err, result) => {
        if (err) {
            console.error("Error adding tour:", err);
            return res.json({ message: "Error adding tour", error: err });
        }
        return res.json({ id: result.insertId, name, country_id, city, start_date, end_date, price });
    });
});


// Привязка тура к клиенту и стране
app.post('/assign-tours', (req, res) => {
    const { client_id, tour_id } = req.body; // Добавили client_id
    const sql = "INSERT INTO client_tours (client_id, tour_id) VALUES (?, ?)"; // Привязка по client_id и tour_id

    db.query(sql, [client_id, tour_id], (err, result) => {
        if (err) {
            console.error("Error assigning tour:", err);
            return res.json({ message: "Error assigning tour", error: err });
        }
        res.json({ message: "Tour successfully assigned!" });
    });
});



//------------------------------ТРАНСПОРТ------------------------------------//
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
            return res.json(transportResult);
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
    const { client_id, tour_id, transport_id } = req.body; // Добавили client_id
    const sql = "INSERT INTO client_transport (client_id, tour_id, transport_id) VALUES (?, ?, ?)"; // Привязка по client_id и tour_id

    db.query(sql, [client_id, tour_id, transport_id], (err, result) => {
        if (err) {
            console.error("Error assigning transport:", err);
            return res.json({ message: "Error assigning transport", error: err });
        }
        res.json({ message: "Transport successfully assigned!" });
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



// Добавляем транспорт клиенту
app.post('/hotel', (req, res) => {
    const { name, category, location, price, end_city } = req.body;
    const sql = "INSERT INTO hotels (name, category, end_city, price) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, category, location, price, end_city], (err, result) => {
        if (err) {
            console.error("Error adding hotel:", err);
            return res.json({ message: "Error adding hotel", error: err });
        }
        return res.json({ id: result.insertId, name, category, end_city, price });
    });
});


// Привязка тура к клиенту и стране
app.post('/assign-hotel', (req, res) => {
    const { client_id, tour_id, hotel_id } = req.body;
    const sql = "INSERT INTO client_hotel (client_id, tour_id, hotel_id) VALUES (?, ?, ?)";

    db.query(sql, [client_id, tour_id, hotel_id], (err, result) => {
        if (err) {
            console.error("Error assigning hotel:", err);
            return res.json({ message: "Error assigning hotel", error: err });
        }
        res.json({ message: "Hotel successfully assigned!" });
    });
});


// Запускаем сервер
app.listen(8081, () => {
    console.log("Listening on port 8081");
});