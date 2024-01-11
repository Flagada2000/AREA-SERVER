export class CreateActionDto {
    readonly id: number;
    readonly service_id: number;
    readonly action_name: string;
}

export class CreateUserActionDto {
    readonly user_id: string;
    readonly action_id: number;
    readonly action_config: string;
}

export class UpdateUserActionDto {
    user_id: string;
    action_id: number;
    action_config: string;
    id: number;
}

export class UserActionDto {
    id: number;
    user_id: string;
    action_id: number;
    action_config: string;

    constructor(init?: Partial<UserActionDto>) {
        Object.assign(this, init);
    }
}

export class ActionDto {
    id: number;
    service_id: number;
    action_name: string;

    constructor(init?: Partial<ActionDto>) {
        Object.assign(this, init);
    }
}
