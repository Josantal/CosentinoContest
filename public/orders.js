document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#ordersTable tbody');
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.orderNumber}</td>
                    <td>${order.executor}</td>
                    <td>${order.startDate}</td>
                    <td>${order.endDate}</td>
                    <td>${order.noticeNumber}</td>
                    <td>${order.jobDescription}</td>
                    <td>${order.operatorName}</td>
                    <td>${order.orderStatus}</td>
                    <td>${order.priority}</td>
                    <td>${order.faultCause}</td>
                    <td>${order.repairTime}</td>
                    <td>${order.resourcesUsed}</td>
                    <td>${order.repairCost}</td>
                    <td>${order.technicianNotes}</td>
                    <td>${order.supervisorSignature}</td>
                    <td>${order.verificationComments}</td>
                    <td>${order.nextInspectionDate}</td>
                    <td>${order.operationConditions}</td>
                    <td>${order.correctiveMeasures}</td>
                    <td>${order.testResults}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener las órdenes:', error));

    document.getElementById('clearOrders').addEventListener('click', function() {
        fetch('/clear-orders', { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Todas las órdenes han sido borradas.');
                    location.reload();
                } else {
                    alert('Error al borrar las órdenes.');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
