var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleware/autenticacion');
var app = express();



var Usuario = require('../models/usuario');

// Obtener todos los Usuario
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                res.status(500).json({
                    ok: fasle,
                    mensaje: 'Error cargando Usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarios
            });
        });

});




/// Actualizar un nuevo Usuarios

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuarui con el id' + id + 'no existe',
                errors: { message: 'No existe usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuairo: usuarioGuardado
            });
        });

    });

});

/// Crear un nuevo Usuarios
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Crear Usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuairotoken: req.usuario
        });
    });

});
/// Borrar Usuarios por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar Usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuairo: usuarioBorrado
        });
    })
});


module.exports = app;