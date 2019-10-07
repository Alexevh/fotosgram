import { FileUpload } from '../interfaces/file-upload';
import  path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem{


constructor(){}

guardarImagenTemporal(file: FileUpload, userID: string){

    return new Promise((resolve, reject) =>{
        const path = this.crearCarpetaUsuario(userID);
        //nombre archivo
        const nombreArchivo = this.generarNombreUnico(file.name);
       
        //lo muevo a la carpeta
        file.mv(`${path}/${nombreArchivo}`, (err: any) =>{
            if (err){
                //no se pudo mover
                reject(err);
            } else {
               resolve();
            }
        });
    });
 
}


private crearCarpetaUsuario(userid: string){

    const pathUser = path.resolve(__dirname, '../uploads', userid);
    const pathUserTemp =pathUser + '/temp';

    const existe = fs.existsSync(pathUser);
    if(!existe)
    {
        fs.mkdirSync(pathUser);
        fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;

}

private generarNombreUnico(nombreOriginal: string)
{
    const nombreArr = nombreOriginal.split('.');
    const extension = nombreArr[nombreArr.length-1];
    const nombreUnico = uniqid();
    return `${nombreUnico}.${extension}`;
}

imagenesTempHaciaPost(userID: string){
    const pathTemp = path.resolve(__dirname, '../uploads', userID, 'temp');
    const pathPost = path.resolve(__dirname, '../uploads', userID, 'posts');

    if (!fs.existsSync(pathTemp)){
        return [];
    }

    if (!fs.existsSync(pathPost)){
        fs.mkdirSync(pathPost);
    }

    const imagenesTmp = this.obtenerImagenesTemp(userID);

    imagenesTmp.forEach(imagen => {
        fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
    });

    return imagenesTmp;
}

private obtenerImagenesTemp(userId: string){
    const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');

    return fs.readdirSync(pathTemp) || [];
}

getFotoUrl( userId: string, img: string ) {

    // Path POSTs
    const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img );


    // Si la imagen existe
    const existe = fs.existsSync( pathFoto );
    if ( !existe ) {
        return path.resolve( __dirname, '../assets/400x250.jpg' );
    }


    return pathFoto;

}

}