 var express = require('express');


 var app = express();

 app.get('/', (req, res, next) => {

     res.status(200).json({
         ok: true,
         mensaje: 'Peticion Realizada Correctamente'
     });
     // res.send('Hello World!');
 });

 module.exports = app;