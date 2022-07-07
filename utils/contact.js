const fs = require('fs')

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

const dataPath = './data/data.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}
// get all
const loadContact = () => {
    const dataBuffer = fs.readFileSync('data/data.json', 'utf-8');
    const dataJSON = JSON.parse(dataBuffer)
    return dataJSON;
}

// cari contact berdasarkan nama
const findContact = (nama) => {
    const dataJSON = loadContact();
    const contact = dataJSON.find(contact => contact.nama === nama);
    return contact;
}


// ADD CONTACT
const saveContact = (contacts) => {
    fs.writeFileSync('data/data.json', JSON.stringify(contacts), 'utf-8');
}
const addContact = (contact) => {
    const dataJSON = loadContact();
    dataJSON.push(contact);
    saveContact(dataJSON);
}

// CEK NAMA DUPLIKAT
const cekDuplikat = (nama) => {
    const dataJSON = loadContact();
    const contact = dataJSON.find(contact => contact.nama === nama);
    return contact;
}

module.exports = { loadContact, findContact, addContact, cekDuplikat }