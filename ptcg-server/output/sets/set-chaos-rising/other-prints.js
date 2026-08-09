"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationTomeCRI = void 0;
const book_of_transformation_1 = require("./book-of-transformation");
class TransformationTomeCRI extends book_of_transformation_1.BookOfTransformation {
    constructor() {
        super(...arguments);
        this.set = 'CRI';
        this.setNumber = '83';
        this.usSetNumber = 'CRI 83';
        this.name = 'Transformation Tome';
        this.fullName = 'Transformation Tome CRI';
    }
}
exports.TransformationTomeCRI = TransformationTomeCRI;
