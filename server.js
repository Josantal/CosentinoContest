
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Base de Datos
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE maintenance_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderNumber TEXT,
        executor TEXT,
        startDate TEXT,
        endDate TEXT,
        noticeNumber TEXT,
        jobDescription TEXT,
        operatorName TEXT,
        orderStatus TEXT,
        priority TEXT,
        faultCause TEXT,
        repairTime TEXT,
        resourcesUsed TEXT,
        repairCost TEXT,
        technicianNotes TEXT,
        supervisorSignature TEXT,
        verificationComments TEXT,
        nextInspectionDate TEXT,
        operationConditions TEXT,
        correctiveMeasures TEXT,
        testResults TEXT
    )`);
});

// Rutas
app.delete('/clear-orders', (req, res) => {
    db.run("DELETE FROM maintenance_orders", function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(204).send();
    });
});

app.post('/order', (req, res) => {
    const data = req.body;
    db.run(`INSERT INTO maintenance_orders (
        orderNumber, executor, startDate, endDate, noticeNumber, jobDescription, operatorName, 
        orderStatus, priority, faultCause, repairTime, resourcesUsed, repairCost, technicianNotes, 
        supervisorSignature, verificationComments, nextInspectionDate, operationConditions, 
        correctiveMeasures, testResults
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [
        data.orderNumber, data.executor, data.startDate, data.endDate, data.noticeNumber, data.jobDescription, data.operatorName, 
        data.orderStatus, data.priority, data.faultCause, data.repairTime, data.resourcesUsed, data.repairCost, data.technicianNotes, 
        data.supervisorSignature, data.verificationComments, data.nextInspectionDate, data.operationConditions, 
        data.correctiveMeasures, data.testResults
    ], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).send({ id: this.lastID });
    });
});

app.get('/orders', (req, res) => {
    db.all("SELECT * FROM maintenance_orders", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Órdenes de Mantenimiento</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Aviso de Mantenimiento</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Número de Aviso</th>
                                <th>Creador del aviso</th>
                                <th>Fecha de Inicio</th>
                                <th>Hora del aviso</th>
                                <th>Maquina averiada</th>
                                <th>Descripción de la avería o la solicitud a mantenimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(row => `
                                <tr>
                                    <td>${row.orderNumber}</td>
                                    <td>${row.executor}</td>
                                    <td>${row.startDate}</td>
                                    <td>${row.noticeNumber}</td>
                                    <td>${row.jobDescription}</td>
                                    <td>${row.operatorName}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <button onclick="deleteAllData()">Borrar Todos los Datos</button>
                    <button onclick="downloadExcel()">Descargar Excel</button>
                </div>
                <script>
                    function downloadExcel() {
                        window.location.href = '/download-excel';
                    }
                    function deleteAllData() {
                        fetch('/delete-all-data', {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log('Todos los datos han sido borrados');
                                // Aquí puedes añadir lógica adicional si es necesario, como actualizar la página o mostrar un mensaje al usuario.
                            } else {
                                console.error('Error al borrar los datos');
                            }
                        })
                        .catch(error => {
                            console.error('Error de red:', error);
                        });
                    }
                </script>
            </body>
            </html>
        `);
    });
});

// Nueva ruta para descargar los datos en formato Excel
app.get('/download-excel', (req, res) => {
    db.all("SELECT * FROM maintenance_orders", [], async (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

// Agrega el encabezado
worksheet.columns = [
    { header: 'Número de Aviso', key: 'orderNumber', width: 20 },
    { header: 'Creador del aviso', key: 'executor', width: 20 },
    { header: 'Hora del aviso', key: 'startDate', width: 15 },
    { header: 'Número de Aviso', key: 'noticeNumber', width: 20 },
    { header: 'Maquina averiada', key: 'jobDescription', width: 30 },
    { header: 'Descripción de la avería o la solicitud a mantenimiento', key: 'operatorName', width: 20 },
];


        // Agrega las filas
        rows.forEach(row => {
            worksheet.addRow(row);
        });

        // Genera el archivo y lo envía al cliente
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    });
});

// Ruta para borrar todos los datos
app.delete('/delete-all-data', (req, res) => {
    db.run("DELETE FROM maintenance_orders", function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send({ message: 'Todos los datos han sido borrados' });
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
