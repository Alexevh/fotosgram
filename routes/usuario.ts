import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import   bcrypt  from 'bcrypt';
import Token from "../clases/token";
import { verificarToken } from '../middlewares/autenticacion';

const userRoutes = Router();


/*login de usuario */
userRoutes.post('/login', (req: Request, resp: Response)=>
{
    /* me guard el body */
    const body = req.body;

    /* busco al usuario en mi BD y como el id unico es el mail lo busco por eso */
    Usuario.findOne({email: body.email}, (err, usrDB) => {
        //si da un error aca es de base de datos por eso lo tiro
        if(err) throw err;
        /* si no existe el userDB entonces devuelvo un json */
        if(!usrDB) {
            return resp.json({
                ok: false,
                mensaje: 'No existe el usuario o el pass esta mal'
            });
        }
        
        /* si llego aca es que el mail existe */
        if (usrDB.compararPass(body.password)){

            const tokenUSR = Token.getJwtToken({
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
        } else {
            return resp.json({
                ok: false,
                mensaje: 'No existe el usuario o el pass esta mal'
            });
        }
        

    });

});


/* crear un usuario */
userRoutes.post("/create", (req: Request, resp: Response) => {
  /* extrago la informacion del posteo */
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };

  /* lo grabo den la BD */

  /* usuario. creaye devuelve una promesa, podria usar el await o como hago ahora el then
   */
  Usuario.create(user).then(usrDB => {

    const tokenUSR = Token.getJwtToken({
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
  })
});


/* actualizar usuario, le paso como segundo argumento el middleware, si necesito meter mas d eun mideware
los pudo poner entre llaves [verificartoke, verificarsarasa] */
userRoutes.post('/update', verificarToken, (req: any, res: Response ) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email : req.body.email  || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    /* lo de usuario con el id aparece solo por el metodo verificar tolken, si no no lo tenrdiamos */
    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

         /* si llego aca la actualizaciones correcta y ahra necistamos generar un nuevo token ya que pudo haber cambiado algo de esos
         datos */

        const tokenUser = Token.getJwtToken({
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


userRoutes.get('/', [verificarToken], (req: any, resp: Response) => {

    const usuario = req.usuario;
    resp.json({
        ok: true,
        user: usuario
    })
});




export default userRoutes;
