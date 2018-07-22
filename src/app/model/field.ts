import { Fieldtype } from './fieldtyp';

export class Field {

    public constructor(public typ: Fieldtype) {}

    public static fromSign(type: Fieldtype) {
        return new Field(type);
    }

}
