var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var app = express();


var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuairoDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error buscar usuario',
                errors: err
            });
        }
        if (!usuairoDb) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuairoDb.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -pass',
                errors: err
            });
        }

        // crear un token 
        usuairoDb.password = ':)';
        var token = jwt.sign({ usuario: usuairoDb }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuairo: usuairoDb,
            token: token,
            id: usuairoDb.id
        });
    });

});

module.exports = app;