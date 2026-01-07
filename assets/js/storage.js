// ===============================
//  Storage Helper for Riad Management
// ===============================

// 1) تحميل البيانات
function loadData(key, defaultValue) {
    let data = localStorage.getItem(key);
    // إلا كانت الـ data خاوية أو مصفوفة خاوية وعطيناها بيانات افتراضية، كنعاودو نعمروها
    if (!data || (JSON.parse(data).length === 0 && defaultValue.length > 0)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }
    return JSON.parse(data);
}

// 2) حفظ البيانات
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 3) Users
function getUsers() {
    return loadData("users", [
        { email: "admin@gmail.com", password: "1234" }
    ]);
}

// 4) Rooms
function getRooms() {
    return loadData("rooms", [
        { id: 1, number: "101", price: 2800, status: "occupied", image: "assets/image/ch101.jpg" },
        { id: 2, number: "102", price: 4400, status: "occupied", image: "assets/image/ch102.jpg" },
        { id: 3, number: "103", price: 3400, status: "occupied", image: "assets/image/ch103.jpg" },
        { id: 4, number: "104", price: 3400, status: "available", image: "assets/image/ch104.jpg" }
    ]);
}
function saveRooms(rooms) { saveData("rooms", rooms); }

// 5) Clients
function getClients() {
    return loadData("clients", [
        { id: 1, name: "Mohamed", phone: "0612345678" ,email: "mohamed@email.com", pays: "Maroc", cin: "AB123456"},
        { id: 2, name: "Sara", phone: "0622334455" ,email: "sara@email.com", pays: "Maroc", cin: "CD789012"},
        { id: 3, name: "Yassine", phone: "0633445566" , pays: "Maroc", cin: "EF345678"},
        { id: 4, name: "Laila", phone: "0644556677" ,email: "laila@email.com", pays: "Maroc", cin: "GH901234"}
            
            
    ]);
}
function saveClients(clients) { saveData("clients", clients); }

// 6) Services (Mise à jour)
function getServices() {
    return loadData("services", [
        { id: 1, name: "Petit-déjeuner", price: 100, description: "Petit-déjeuner complet traditionnel", status: "actif", image: "assets/image/breakfast.jpg" },
        { id: 2, name: "Spa & Hamman", price: 350, description: "Hammam marocain traditionnel et massage", status: "actif", image: "assets/image/spa.jpg" },
        { id: 3, name: "Restaurant", price: 200, description: "Plats marocains variés", status: "inactif", image: "assets/image/restaurant.jpg" }
        
    ]);
}
function saveServices(services) { saveData("services", services); }


// 7) Reservations (زدت ليك هنا البيانات باش يتفيكسا المشكل)
function getReservations() {
    return loadData("reservations", [
        { id: 1, clientName: "Mohamed El Alami", roomNumber: "101", checkIn: "2024-05-20", 
            checkOut: "2024-05-23", totalPrice: 8400 },
        { id: 2, clientName: "Sara Mansouri", roomNumber: "102", checkIn: "2024-05-22", checkOut: "2024-05-24", totalPrice: 4400 },
        { id: 3, clientName: "Yassine Rouani", roomNumber: "103", checkIn: "2024-05-25", checkOut: "2024-05-27", totalPrice: 3200 }
    ]);
}
function saveReservations(reservations) { saveData("reservations", reservations); }
// 8) personnel
function getPersonnel() {
    return loadData("personnel", [
        {
            id: 1,
            cin: "AB16631",
            nom: "Fatima Zahra",
            prenom: "El Amrani",
            poste: "Réception",
            telephone: "0612345678",
            email: "fz.elamrani@email.com",
            statut: "actif",
            dateEmbauche: "2023-03-01"
        },
        {
            id: 2,
            cin: "CD98765",
            nom: "Youssef",
            prenom: "Alaoui",
            poste: "Sécurité",
            telephone: "0698765432",
            email: "y.alaoui@email.com",
            statut: "actif",
            dateEmbauche: "2022-11-15"
        },
        {
            id: 3,
            cin: "EF54321",
            nom: "Nadia",
            prenom: "Bennani",
            poste: "Ménage",
            telephone: "0654321987",
            email: "n.bennani@email.com",
            statut: "inactif",
            dateEmbauche: "2023-01-20"
        }
    ]);
}

function savePersonnel(personnel) { saveData("personnel", personnel); }
// 8) Utility
function generateId(list) {
    if (!list || list.length === 0) return 1;
    return Math.max(...list.map(x => x.id)) + 1;
}

// Export
window.storage = {
    getUsers,
    getRooms,
    saveRooms,
    getClients,
    saveClients,
    getServices,
    saveServices,
    getReservations,
    saveReservations,
    getPersonnel,
    savePersonnel,
    generateId
};