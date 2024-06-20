// db.js
const DB_NAME = 'myAppDB';
const DB_VERSION = 1; // Use a higher version number if you need to make schema changes later
const STORE_NAME = 'myDataStore';

/**
 * Open connection to IndexedDB
 */
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id' }); // Create an object store with a key
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject('IndexedDB error: ' + event.target.errorCode);
        };
    });
}

/**
 * Save data to the store
 */
async function saveData(id, data) {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ id, ...data });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = function() {
            resolve();
        };

        transaction.onerror = function(event) {
            reject('Data save error: ' + event.target.errorCode);
        };
    });
}

/**
 * Get data from the store
 */
async function getData(id) {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME]);
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject('Data fetch error: ' + event.target.errorCode);
        };
    });
}

export { saveData, getData };
