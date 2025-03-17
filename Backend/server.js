import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express();
app.use(cors());  // Разрешает запросы с других доменов
app.use(express.json()); // Сервер понимал JSON-запросы



const db = mysql.createConnection({
        host: "localhost",
        user: 'root',
        password: 'katytom',
        database: 'tourism_db'
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM clients";
    db.query(sql, (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    });
});


app.post('/clients', (req, res) => {
    const sql = "INSERT INTO clients (`full_name`, `contact_info`) VALUES (?)"; //
    const values = [
        req.body.name,
        req.body.email
    ];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});


app.get('/read/:id', (req, res) => {
    const sql = "SELECT * FROM clients WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    });
});

app.put('/update/:id', (req, res) => {
    const { full_name, contact_info } = req.body; // Извлекаем данные из тела запроса

    const sql = "UPDATE clients SET full_name = ?, contact_info = ? WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [full_name, contact_info, id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM clients WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    });
})



app.listen(8081, ()=> {
  console.log("Listening on port 8081");
})
