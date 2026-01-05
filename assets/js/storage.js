// ===============================
//  Storage Helper for Riad Management
//  يستخدم localStorage لتخزين البيانات
// ===============================


// ✅ 1) تحميل البيانات من localStorage أو إنشاء بيانات افتراضية
function loadData(key, defaultValue) {
    let data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }
    return JSON.parse(data);
}

// ✅ 2) حفظ البيانات
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// ==============================1
function generateId(list) {
    return list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
}


// ✅ 3) Users (Login)
// إذا ما كان حتى مستخدم → نخزن admin تلقائياً
function getUsers() {
    return loadData("users", [
        { email: "admin@gmail.com", password: "1234" }
    ]);
}



// ✅ 4) Rooms
function getRooms() {
    return loadData("rooms", [
        { 
            id: 1, 
            number: "101", 
            price: 2000, 
            status: "available",
            image: "assets/image/ch101.jpg" // زدنا هاد السطر
        },
        { 
            id: 2, 
            number: "102", 
            price: 2500, 
            status: "occupied",
            image: "assets/image/ch102.jpg" // مسار مختلف للغرفة الثانية
        }
    ]);
}

function saveRooms(rooms) {
    saveData("rooms", rooms);
}



// ✅ 5) Clients
function getClients() {
    return loadData("clients", [
        { id: 1, name: "Mohamed", phone: "0612345678" },
        { id: 2, name: "Sara", phone: "0622334455" }
    ]);
}

function saveClients(clients) {
    saveData("clients", clients);
}



// ✅ 6) Services
function getServices() {
    return loadData("services", [
        { id: 1, name: "Petit déjeuner", price: 50 },
        { id: 2, name: "WiFi", price: 0 }
    ]);
}

function saveServices(services) {
    saveData("services", services);
}



// ✅ 7) Reservations
function getReservations() {
    return loadData("reservations", []);
}

function saveReservations(reservations) {
    saveData("reservations", reservations);
}



// ✅ 8) Utility: generate ID automatique
function generateId(list) {
    if (list.length === 0) return 1;

    return Math.max(...list.map(x => x.id)) + 1;
}



// ✅ Export functions (باش نستعملهم في ملفات أخرى)
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
    generateId
};
