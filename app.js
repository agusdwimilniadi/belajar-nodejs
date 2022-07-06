const express = require('express')
const expresLayout = require('express-ejs-layouts')
const { loadContact, findContact } = require('./utils/contact')

const app = express()
const port = 3000



// GUNAKAN EJS

app.set('view engine', 'ejs')
app.use(expresLayout)
app.use(express.static('public'))

app.get('/', (req, res) => {
    const mhs = [
        {
            nama: 'Rizki',
            nim: '10116071',
            jurusan: 'Teknik Informatika'
        },
        {
            nama: 'Agus',
            nim: '123',
            jurusan: 'Teknik Sipil'
        },
        {
            nama: 'Ihiw',
            nim: '35113434',
            jurusan: 'Teknik Industri'
        },
    ]
    res.render('index', {
        mhs,
        layout: 'layouts/main-layout'
    })
})
app.get('/contact', (req, res) => {

    const contacts = loadContact()

    res.render('contact', {
        layout: 'layouts/main-layout',
        contacts,
    })
})

app.get('/contact/:nama', (req, res) => {

    const contact = findContact(req.params.nama)

    res.render('detail', {
        layout: 'layouts/main-layout',
        contacts: contact,
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout'
    })
})
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})