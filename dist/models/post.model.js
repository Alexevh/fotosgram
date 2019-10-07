"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: { type: Date },
    mensaje: { type: String },
    img: [{ type: String }],
    coords: { type: String },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Debe existir un usuario'] }
});
/* esto viene a ser como un trigger, voy a guardar la fecha de hoy al grabar */
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
