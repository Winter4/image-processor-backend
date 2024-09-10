
import {UUID} from 'crypto';

type User = {
    id: UUID;
    email: string;
    passwordHash: string;
    updated: Date;
    created: Date;
};

export type {User as UserTable};
