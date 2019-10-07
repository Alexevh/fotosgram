import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const postSchema = new Schema(
    {
        created: {type: Date},
        mensaje: {type: String},
        img:[{type: String}],
        coords: {type: String},
        usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required:[true, 'Debe existir un usuario']}

    }
    
);


/* esto viene a ser como un trigger, voy a guardar la fecha de hoy al grabar */
postSchema.pre<IPost>('save', function(next) {

    this.created = new Date();
    next();
})


/* creamos la interface para trabajarlo */
interface IPost extends Document{
    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    usuario: string
}

export const Post = model('Post', postSchema);