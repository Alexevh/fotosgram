import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import   bcrypt  from 'bcrypt';
import Token from "../clases/token";
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();


/*genero el servicio de posteo */
postRoutes.post('/', [verificarToken], (req: any, resp: Response) =>{

const body = req.body;

/* meto el usuario */
body.usuario = req.usuario._id;

/* con este metodo muevo todas las imagenes subidas y me las guardo */
const imagenes = fileSystem.imagenesTempHaciaPost(req.usuario._id)

/* ahora las asigno al elemento a guardar */
body.img = imagenes;


/*insertamos en BD, el resultado de la operacion la giardamos en postDB y operamos 
como el populate es una promesa tenemos que hacer la funcion async*/
Post.create(body).then( async postDB => {

    /* esto lo puedo hacer por que hay una relacion definida en el modelo lo que en sql seria una FK, como voy a devolver
    el elemento postDB a la aplciaiocn luego del insert le voy a mandar los datos del usuario tambien 
    el argumento -password hace que el populate no retorne el password*/
    await postDB.populate('usuario', '-password').execPopulate();


    resp.json({
        ok: true,
        post: postDB
    });
}).catch(err =>{

    resp.json(err);

}); //fin post.create



});//fin metodo



/* obtener posts paginados, si al sort le ponemos _id -1 es descendente el ordem */
postRoutes.get('/', [verificarToken], async (req: any, resp: Response)=> {

/* a este metodo le voy a poner parametros por URL opcionales para la paginacion */
let pagina = Number(req.query.pagina) || 1;
let skip = pagina -1;
skip = skip*10


    const posts = await Post.find()
                            .sort({_id: -1}) 
                            .limit(10)
                            .skip(skip)
                            .populate('usuario', '-password')
                            .exec();

                            


    resp.json({
        ok: true,
        posts: posts,
        pagina
    })
});





//Servicio para subir archicos
postRoutes.post('/upload', [verificarToken], async (req: any, resp: Response) => {

if(!req.files){
    return resp.status(400).json({
        ok: false,
        mensaje: 'No se subio ningun archivo'
    });
}

/*  si vino la imagen la guardo, hice una interfaz con el esqueleto de un tipo de imagen*/
const file: FileUpload = req.files.image;

/* si no me vino un file doy error */
if (!file)
{
    return resp.status(400).json({
        ok: false,
        mensaje: 'No se subio ningun archivo de imagen'
    });
}

/* si me vino un file pero no es una imagen doy error */
if(!file.mimetype.includes('image'))
{
    return resp.status(400).json({
        ok: false,
        mensaje: 'Solo se pueden subir imagenes'
    });
}


/* crear carpetas si no existe */
await fileSystem.guardarImagenTemporal(file, req.usuario._id);




resp.json({
    ok: true,
    fichero: file.mimetype
})

});

/* cuando especificamos estos parametros entonces son obligatorios */
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    
    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});




export default postRoutes;