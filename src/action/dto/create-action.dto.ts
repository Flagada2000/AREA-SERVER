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
