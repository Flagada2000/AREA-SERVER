export class CreateActionDto {
    readonly id: number;
    readonly service_id: number;
    readonly action_name: string;
}

export class CreateUserActionDto {
    readonly id: number;
    readonly user_id: string;
    readonly action_id: number;
    readonly action_config: string;
}
