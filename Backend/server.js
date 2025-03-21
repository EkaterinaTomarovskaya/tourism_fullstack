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

app.post('/assign-country', (req, res) => {
    const { client_id, country_id } = req.body;
    const sql = "INSERT INTO client_countries (client_id, country_id) VALUES (?, ?)";
    
    db.query(sql, [client_id, country_id], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Страна успешно добавлена клиенту!" });
    });
});



// Получаем список туров для конкретного клиента
app.get('/tours', (req, res) => {
    const sql = "SELECT * FROM tours";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ message: "Error fetching tours", error: err });
        }

        console.log("Tours found:", result);
        return res.json(result);
    });
});

// Добавляем тур клиенту
app.post('/tours', (req, res) => {
    const { name, country_id, city, start_date, end_date, price } = req.body;
    const sql = "INSERT INTO tours (name, country_id, city, start_date, end_date, price) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, country_id, city, start_date, end_date, price], (err, result) => {
        if (err) {
            console.error("Error adding tour:", err);
            return res.json({ message: "Error adding tour", error: err });
        }
        return res.json({ id: result.insertId, name, country_id, city, start_date, end_date, price });
    });
});


// Привязка тура к клиенту
app.post('/assign-tour', (req, res) => {
    const { tour_id } = req.body; // Убираем client_id
    const sql = "INSERT INTO client_tours (tour_id) VALUES (?)";

    db.query(sql, [tour_id], (err, result) => {
        if (err) {
            console.error("Error assigning tour:", err);
            return res.json({ message: "Error assigning tour", error: err });
        }
        res.json({ message: "Tour successfully assigned!" });
    });
});


// Запускаем сервер
app.listen(8081, () => {
    console.log("Listening on port 8081");
});
