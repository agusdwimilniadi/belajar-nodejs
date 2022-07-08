const express = require("express");
const expresLayout = require("express-ejs-layouts");
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express();
const port = 3000;

// GUNAKAN EJS

app.set("view engine", "ejs");
app.use(expresLayout);
app.use(express.static("public"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser('secret'))
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.get("/", (req, res) => {
    const mhs = [
        {
            nama: "Rizki",
            nim: "10116071",
            jurusan: "Teknik Informatika",
        },
        {
            nama: "Agus",
            nim: "123",
            jurusan: "Teknik Sipil",
        },
        {
            nama: "Ihiw",
            nim: "35113434",
            jurusan: "Teknik Industri",
        },
    ];
    res.render("index", {
        mhs,
        layout: "layouts/main-layout",
    });
});
app.get("/contact", (req, res) => {
    const contacts = loadContact();

    res.render("contact", {
        layout: "layouts/main-layout",
        contacts,
        msg: req.flash("msg"),
    });
});

app.post(
    "/contact",
    [
        check("email", "Email tidak valid!").isEmail(),
        check("noHp", "Nomor HP Tidak valid").isMobilePhone("id-ID"),
        body("nama").custom((value) => {
            const duplikat = cekDuplikat(value);
            if (duplikat) {
                throw new Error("Nama sudah ada!");

            }
            return true;
        }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                layout: "layouts/main-layout",
                errors: errors.array(),
            });
        } else {
            addContact(req.body)
            req.flash('msg', 'Data berhasil ditambahkan')
            res.redirect('/contact')
        }


    }
);

app.get("/contact/add", (req, res) => {
    res.render("add-contact", {
        layout: "layouts/main-layout",
    });
});

// PROSES DELETE CONTACT
app.get('/contact/delete/:nama', (req, res) => {
    const nama = req.params.nama;
    const contacts = findContact(nama);
    if (!contacts) {
        req.flash('msg', 'Data tidak ditemukan')
        res.redirect('/contact')
    } else if (contacts) {
        deleteContact(nama);
        req.flash('msg', 'Data berhasil dihapus ')
        res.redirect('/contact');
    } else {
        res.redirect('/contact');
    }
})


// FORM UBAH DATA CONTACT
app.get("/contact/edit/:nama", (req, res) => {
    const contact = findContact(req.params.nama)
    res.render("edit-contact", {
        layout: "layouts/main-layout",
        contact,
    });
});

// PROSES UBAH DATA
app.post(
    "/contact/update",
    [
        check("email", "Email tidak valid!").isEmail(),
        check("noHp", "Nomor HP Tidak valid").isMobilePhone("id-ID"),
        body("nama").custom((value, { req }) => {
            const duplikat = cekDuplikat(value);
            if (value !== req.body.oldNama && duplikat) {
                throw new Error("Nama sudah ada!");
            }
            return true;
        }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                layout: "layouts/main-layout",
                errors: errors.array(),
                contact: req.body,
            });
        } else {

            updateContacts(req.body)
            req.flash('msg', 'Data berhasil dihbah')
            res.redirect('/contact')
        }


    }
);

app.get("/contact/:nama", (req, res) => {
    const contact = findContact(req.params.nama);

    res.render("detail", {
        layout: "layouts/main-layout",
        contacts: contact,
    });
});
app.get("/about", (req, res) => {
    res.render("about", {
        layout: "layouts/main-layout",
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
