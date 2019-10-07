"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
/* voy a inicializr el bodyparse, que es un middleware que va a escuchar las peticiones http
y me va a manejar las respiuestas por JS */
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload, si hay problemas en el temp podemos usar el parametreo server.app.use(fileUpload({useTempFiles: true}));
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
/* le decimos que rutas escuhar */
server.app.use('/user', usuario_1.default);
server.app.use('/post', post_1.default);
/* levantamos la BD */
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    /* si me dio error me salgo */
    if (err)
        throw err;
    console.log('Base de datos online');
});
//levantamos express
server.start(() => {
    console.log(`El server esta arriba papai escuchando en el puerto ${server.port}`);
});
