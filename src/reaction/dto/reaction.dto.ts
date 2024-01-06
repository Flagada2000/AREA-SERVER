export class CreateReactionDto {
    readonly id: number;
    readonly service_id: number;
    readonly reaction_name: string;
}

export class CreateUserReactionDto {
    readonly user_id: string;
    readonly reaction_id: number;
    readonly reaction_config: string;
}

export class UpdateUserReactionDto {
    user_id: string;
    reaction_id: number;
    reaction_config: string;
    id: number;
}
