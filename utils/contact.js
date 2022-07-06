const fs = require('fs')

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

const dataPath = './data/data.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContact = () => {
    const dataBuffer = fs.readFileSync('data/data.json', 'utf-8');
    const dataJSON = JSON.parse(dataBuffer)
    return dataJSON;
}


module.exports = { loadContact }