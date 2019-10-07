import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema(
    {
        nombre: {
            type: String, required: [true, 'El nombre no puede estar vacio']
        },
        avatar: {
            type: String,
            default: 'av-1.png'
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'El correo no puede estar vacio']
        },
        password: {
            type: String,
            required: [true, 'el pass es necesario']
        }

    }
);


/* voy a hacer un metoo a niel del modelo para comprar contrasema , aca uso una funcion nomral de js en ves de una funcion
de flecha por que necesito poder referenciar el this*/
usuarioSchema.method('compararPass', function(password: string=''):boolean{

    if (bcrypt.compareSync(password, this.password)){
        return true;
    } else {
        return false;
    }

});


interface IUsuario extends Document{

    nombre: string;
    email: string;
    password: string;
    avatar: string;

    compararPass(password:string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
