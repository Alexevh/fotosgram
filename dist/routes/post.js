"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../clases/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
/*genero el servicio de posteo */
postRoutes.post('/', [autenticacion_1.verificarToken], (req, resp) => {
    const body = req.body;
    /* meto el usuario */
    body.usuario = req.usuario._id;
    /* con este metodo muevo todas las imagenes subidas y me las guardo */
    const imagenes = fileSystem.imagenesTempHaciaPost(req.usuario._id);
    /* ahora las asigno al elemento a guardar */
    body.img = imagenes;
    /*insertamos en BD, el resultado de la operacion la giardamos en postDB y operamos
    como el populate es una promesa tenemos que hacer la funcion async*/
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        /* esto lo puedo hacer por que hay una relacion definida en el modelo lo que en sql seria una FK, como voy a devolver
        el elemento postDB a la aplciaiocn luego del insert le voy a mandar los datos del usuario tambien
        el argumento -password hace que el populate no retorne el password*/
        yield postDB.populate('usuario', '-password').execPopulate();
        resp.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        resp.json(err);
    }); //fin post.create
}); //fin metodo
/* obtener posts paginados, si al sort le ponemos _id -1 es descendente el ordem */
postRoutes.get('/', [autenticacion_1.verificarToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    /* a este metodo le voy a poner parametros por URL opcionales para la paginacion */
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .skip(skip)
        .populate('usuario', '-password')
        .exec();
    resp.json({
        ok: true,
        posts: posts,
        pagina
    });
}));
//Servicio para subir archicos
postRoutes.post('/upload', [autenticacion_1.verificarToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    /*  si vino la imagen la guardo, hice una interfaz con el esqueleto de un tipo de imagen*/
    const file = req.files.image;
    /* si no me vino un file doy error */
    if (!file) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo de imagen'
        });
    }
    /* si me vino un file pero no es una imagen doy error */
    if (!file.mimetype.includes('image')) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Solo se pueden subir imagenes'
        });
    }
    /* crear carpetas si no existe */
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    resp.json({
        ok: true,
        fichero: file.mimetype
    });
}));
/* cuando especificamos estos parametros entonces son obligatorios */
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
