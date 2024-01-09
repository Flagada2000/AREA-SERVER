
enum FieldType {
    DROPDOWN = 1,
    TEXT = 2,
    NUMBER = 3,
    BOOLEAN = 4,
    DATE = 5,
    TIME = 6,
}

export class Field {
    name: string;
    label: string;
    type: FieldType;
    source?: string;
    value: string;
    required: boolean;
}

export class ActionInputConfig {
    fields: Field[];
}

export class DropDownInfo {
    label: string;
    value: string;

    constructor(init?: Partial<DropDownInfo>) {
        Object.assign(this, init);
    }
}
