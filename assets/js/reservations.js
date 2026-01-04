document.addEventListener("DOMContentLoaded", () => {
  
  if (document.getElementById("client")) {
    loadClients();
    loadRooms();
  }

  
  if (document.getElementById("reservationsTable")) {
    renderReservations();
  }
});

function loadClients() {
  const select = document.getElementById("client");
  const clients = storage.getClients();
  select.innerHTML = `<option value="">Choisir client</option>`;
  clients.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

function loadRooms() {
  const select = document.getElementById("room");
  const rooms = storage.getRooms();
  select.innerHTML = `<option value="">Choisir chambre</option>`;
  rooms.forEach(r => {
    select.innerHTML += `<option value="${r.id}">${r.number} - ${r.price} DH</option>`;
  });
}

function saveReservation() {
  const clientId = Number(document.getElementById("client").value);
  const roomId = Number(document.getElementById("room").value);
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!clientId || !roomId || !start || !end) {
    alert("عمر جميع الخانات");
    return;
  }

  let reservations = storage.getReservations();
  const room = storage.getRooms().find(r => r.id === roomId);

  
  const days = Math.max(
    1,
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
  );
  const total = days * room.price;

  reservations.push({
    id: storage.generateId(reservations),
    clientId,
    roomId,
    start,
    end,
    total
  });

  storage.saveReservations(reservations);
  alert("Réservation ajoutée avec succès");
  window.location.href = "reservation.html";
}

function renderReservations() {
  const tbody = document.getElementById("reservationsTable");
  if (!tbody) return;

  const reservations = storage.getReservations();
  const clients = storage.getClients();
  const rooms = storage.getRooms();

  tbody.innerHTML = "";

  reservations.forEach(r => {
    const client = clients.find(c => c.id === r.clientId);
    const room = rooms.find(ro => ro.id === r.roomId);

    tbody.innerHTML += `
      <tr>
        <td>${client?.name || ""}</td>
        <td>${room?.number || ""}</td>
        <td>${r.start} → ${r.end}</td>
        <td>${r.total} DH</td>
        <td>
          <button onclick="deleteReservation(${r.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function deleteReservation(id) {
  let reservations = storage.getReservations();
  reservations = reservations.filter(r => r.id !== id);
  storage.saveReservations(reservations);
  renderReservations();
}

