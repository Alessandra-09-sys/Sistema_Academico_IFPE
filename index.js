const express = require('express');
require('dotenv/config');
const path = require('path');
const mongoose = require('mongoose');
const session = require("express-session");
const app = express();

mongoose.connect(process.env.MONGO_URI)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'ifpe',
    saveUninitialized: false,
    resave: false
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

const auth = require('./middlewares/usuarioAuth');
const alunoRoutes = require('./routes/alunoRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');

app.use('/alunos', auth, alunoRoutes);
app.use('/usuarios',usuariosRoutes);
app.use('/disciplinas', auth, disciplinaRoutes);

const UsuarioController = require('./controllers/usuarioController');

app.get("/login", UsuarioController.loginGet);
app.post("/login", UsuarioController.loginPost);
app.post("/usuarios/cadastro", UsuarioController.cadastrar);
app.get("/logout", UsuarioController.logout);

app.get('/', function (req, res) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    res.render('index');
});

app.use(function (req, res) {
    res.status(404).render('404');
});

app.listen(process.env.PORT, function () {
    console.log("RODANDO NA PORTA 999...");
});