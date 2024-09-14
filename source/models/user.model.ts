import Entity from './base.model';

type UserTable = {
    id: string;
    email: string;
    passwordHash: string;
    updated: Date;
    created: Date;
};

class User extends Entity<UserTable> {
	table = 'users';
	name = 'User';
}

export default new User();
