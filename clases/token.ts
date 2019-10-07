import jwt from "jsonwebtoken";

export default class Token {
  private static seed: string = "sarasa";
  private static caducidad: string = "30d";

  constructor() {}

  /* aca meto el contenido del payload en la variable usuario dentro del token, entonces cuando retorne
  o desencrypte el token tengo acceso a esos datos */
  static getJwtToken(payload: any): string {
    return jwt.sign({ usuario: payload }, this.seed, {
      expiresIn: this.caducidad
    });
  }

  static comprobarToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.seed, (err, decoded) => {
        if (err) {
          //no se confia
          reject();
        } else {
          //token valido
          resolve(decoded);
        }
      });
    });
  }
}
