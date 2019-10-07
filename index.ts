import Server from "./clases/server";
import userRoutes from "./routes/usuario";
import mongoose from "mongoose";
import bodyparser from 'body-parser';
import fileUpload from 'express-fileupload';
import postRoutes from "./routes/post";


const server = new Server();

/* voy a inicializr el bodyparse, que es un middleware que va a escuchar las peticiones http
y me va a manejar las respiuestas por JS */
server.app.use(bodyparser.urlencoded({extended:true}));
server.app.use(bodyparser.json());

//FileUpload, si hay problemas en el temp podemos usar el parametreo server.app.use(fileUpload({useTempFiles: true}));
server.app.use(fileUpload({useTempFiles: true}));

/* le decimos que rutas escuhar */
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);


/* levantamos la BD */
mongoose.connect('mongodb://localhost:27017/fotosgram', 
{useNewUrlParser: true, useCreateIndex: true}, (err) =>{

    /* si me dio error me salgo */
    if(err) throw err;
    console.log('Base de datos online');


});

//levantamos express

server.start( ()=>{
    console.log(`El server esta arriba papai escuchando en el puerto ${server.port}`);
});