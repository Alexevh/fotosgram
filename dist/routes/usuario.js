"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
/*login de usuario */
userRoutes.post('/login', (req, resp) => {
    /* me guard el body */
    const body = req.body;
    /* busco al usuario en mi BD y como el id unico es el mail lo busco por eso */
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, usrDB) => {
        //si da un error aca es de base de datos por eso lo tiro
        if (err)
            throw err;
        /* si no existe el userDB entonces devuelvo un json */
        if (!usrDB) {
            return resp.json({
                ok: false,
                mensaje: 'No existe el usuario o el pass esta mal'
            });
        }
        /* si llego aca es que el mail existe */
        if (usrDB.compararPass(body.password)) {
            const tokenUSR = token_1.default.getJwtToken({
                _id: usrDB._id,
                nombre: usrDB.nombre,
                email: usrDB.email,
                avatar: usrDB.avatar
            });
            return resp.json({
                ok: true,
                mensaje: 'Login correcto',
                token: tokenUSR
            });
        }
        else {
            return resp.json({
                ok: false,
                mensaje: 'No existe el usuario o el pass esta mal'
            });
        }
    });
});
/* crear un usuario */
userRoutes.post("/create", (req, resp) => {
    /* extrago la informacion del posteo */
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    /* lo grabo den la BD */
    /* usuario. creaye devuelve una promesa, podria usar el await o como hago ahora el then
     */
    usuario_model_1.Usuario.create(user).then(usrDB => {
        const tokenUSR = token_1.default.getJwtToken({
            _id: usrDB._id,
            nombre: usrDB.nombre,
            email: usrDB.email,
            avatar: usrDB.avatar
        });
        resp.json({
            ok: "true",
            user: usrDB,
            token: tokenUSR
        });
    }).catch(err => {
        resp.json({
            ok: "false",
            mensaje: err
        });
    });
});
/* actualizar usuario, le paso como segundo argumento el middleware, si necesito meter mas d eun mideware
los pudo poner entre llaves [verificartoke, verificarsarasa] */
userRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    /* lo de usuario con el id aparece solo por el metodo verificar tolken, si no no lo tenrdiamos */
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        /* si llego aca la actualizaciones correcta y ahra necistamos generar un nuevo token ya que pudo haber cambiado algo de esos
        datos */
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
userRoutes.get('/', [autenticacion_1.verificarToken], (req, resp) => {
    const usuario = req.usuario;
    resp.json({
        ok: true,
        user: usuario
    });
});
exports.default = userRoutes;
