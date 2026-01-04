const rooms = storage.getRooms();
const clients = storage.getClients();
const reservations = storage.getReservations();




document.getElementById("roomsCount").innerText = rooms.length;
document.getElementById("clientsCount").innerText = clients.length;
document.getElementById("reservationsCount").innerText = reservations.length;

const income = reservations.reduce((sum, r) => sum + r.total, 0);
document.getElementById("income").innerText = income + " DH";



let monthly = new Array(12).fill(0);

reservations.forEach(r => {
    const date = new Date(r.start);
    const month = date.getMonth();
    monthly[month]++;
});


new Chart(document.getElementById("chartBar"), {
    type: "bar",
    data: {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "Reservations",
                data: monthly,
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        }
    }
});




const occupied = rooms.filter(r => r.status === "occupied").length;
const available = rooms.filter(r => r.status === "available").length;




new Chart(document.getElementById("chartPie"), {
    type: "pie",
    data: {
        labels: ["Occupied", "Available"],
        datasets: [
            {
                data: [occupied, available]
            }
        ]
    },
    options: {
        responsive: true
    }
});



