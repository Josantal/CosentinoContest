// document.getElementById('maintenanceForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const form = event.target;

//     // Crea un objeto FormData para enviar los datos del formulario, incluidos los archivos
//     const formData = new FormData(form);

//     fetch('/order', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error al enviar el formulario');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Datos de la orden de mantenimiento:', data);
//         alert('Formulario enviado exitosamente');
//         form.reset();
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Error al enviar el formulario');
//     });
// });

// // Manejar clic en el botón de borrar todos los datos
// document.getElementById('deleteAllData').addEventListener('click', function(event) {
//     event.preventDefault();

//     // Realizar una solicitud DELETE a la ruta /delete-all-data
//     fetch('/delete-all-data', {
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error al borrar los datos');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Datos borrados:', data);
//         alert('¡Todos los datos han sido borrados del servidor!');
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Error al borrar los datos');
//     });
// });
document.getElementById('maintenanceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;

    // Crea un objeto FormData para enviar los datos del formulario
    const formData = new FormData(form);

    // Convertir FormData a un objeto JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('/order', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar el formulario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de la orden de mantenimiento:', data);
        alert('Formulario enviado exitosamente');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al enviar el formulario');
    });
});

// Manejar clic en el botón de borrar todos los datos
document.getElementById('deleteAllData').addEventListener('click', function(event) {
    event.preventDefault();

    // Realizar una solicitud DELETE a la ruta /delete-all-data
    fetch('/delete-all-data', {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al borrar los datos');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos borrados:', data);
        alert('¡Todos los datos han sido borrados del servidor!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al borrar los datos');
    });
});
