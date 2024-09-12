import {Request, Response} from 'express';
import {scryptSync as crypt} from 'crypto';

import config from '@config';
import {db} from '@ctx';
import type {UserTable} from '@tables';
import * as errors from '@err';

const User = db<UserTable>('users');

/* - - - - - - - - - - - - - - - - - - */

async function signIn(req: Request, res: Response) {
	const {email, password} = req.body;
	const [existingUser] = await User.where({email});
	if(!existingUser) throw new errors.NotFoundError('User');

	const passwordHash = await crypt(password, config.passwordSalt, 32).toString('hex');
	if(existingUser.passwordHash !== passwordHash) throw new errors.InvalidAuthError();

	req.session.user = {
		id: existingUser.id,
		email: existingUser.email
	};

	res.json({value: req.session.user});
}

async function signUp(req: Request, res: Response) {
	const {email, password} = req.body;

	const [existingUser] = await User.where({email});
	if(existingUser) throw new errors.AlreadyExistsError('User');

	const passwordHash = await crypt(password, config.passwordSalt, 32).toString('hex');
	await User.insert({email, passwordHash}).returning('*');

	res.send();
}

async function logout(req: Request, res: Response) {
	req.session.destroy(err => {if(err) throw err;});
	res.send();
}

async function me(req: Request, res: Response) {
	res.json({value: req.session.user});
}

/* - - - - - - - - - - - - - - - - - - */

export {signIn, signUp, me, logout};
