"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
/* un middleware no es mas que una funcion que se llama antes de que suceda algo */
exports.verificarToken = (req, resp, next) => {
    const usrToken = req.get('x-token') || ' ';
    /* si el yokem es valido el resultado de la decodificacion me queda en de oded, como se que eso es el usuairo
    guardo en el mismo request la variable usuario con ese contenito */
    token_1.default.comprobarToken(usrToken).then((decoded) => {
        req.usuario = decoded.usuario;
        /* si llego a este unto entonces mi token es correcto por eso llamo al next que le dice a la persona
        que puede seguir con el siguiente paso que queria ejecutar*/
        next();
    }).catch(err => {
        resp.json({
            ok: false,
            msj: 'token invalido'
        });
    });
};
