"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() {
    }
    /* aca meto el contenido del payload en la variable usuario dentro del token, entonces cuando retorne
    o desencrypte el token tengo acceso a esos datos */
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({ usuario: payload }, this.seed, {
            expiresIn: this.caducidad
        });
    }
    static comprobarToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.seed, (err, decoded) => {
                if (err) {
                    //no se confia
                    reject();
                }
                else {
                    //token valido
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = "sarasa";
Token.caducidad = "30d";
