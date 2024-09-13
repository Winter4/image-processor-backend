
import {UUID} from 'crypto';

type User = {
    id: UUID;
    email: string;
    passwordHash: string;
    updated: Date;
    created: Date;
};

type Image = {
    id: UUID;
    userId: UUID;
    title: string;
    data: Buffer;
    mimeType: string;
    handleType: string;
    md5: string;
    update: Date;
    created: Date;
}

export type {
	User as UserTable,
	Image as ImageTable
};
