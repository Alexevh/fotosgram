
import express from 'express';
import { eventNames } from 'cluster';

export default class Server {

    public app:  express.Application;
    public port: number =3000;



    /* constructor  */
    constructor(){

        this.app = express();
    }

    start( callback: any){

        this.app.listen(this.port, callback);
    }

}