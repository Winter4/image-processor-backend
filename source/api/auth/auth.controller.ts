import {Request, Response} from 'express';
import {scryptSync as crypt} from 'crypto';

import config from '@config';
import * as errors from '@err';

import User from '@models/user.model';

/* - - - - - - - - - - - - - - - - - - */

async function signIn(req: Request, res: Response) {
	const {email, password} = req.body;
	const existingUser = await User.getOne({email});
	if(!existingUser) throw new errors.NotFoundError('User');

	const passwordHash = await crypt(password, config.passwordSalt, 32).toString('hex');
	if(existingUser.passwordHash !== passwordHash) throw new errors.InvalidAuthError();

	req.session.user = {
		id: existingUser.id,
		email: existingUser.email
	};

	res.json({data: req.session.user});
}

async function signUp(req: Request, res: Response) {
	const {email, password} = req.body;

	const existingUser = await User.getOne({email});
	if(existingUser) throw new errors.AlreadyExistsError('User');

	const passwordHash = await crypt(password, config.passwordSalt, 32).toString('hex');
	await User.create({email, passwordHash});

	res.send();
}

async function logout(req: Request, res: Response) {
	req.session.destroy(err => {if(err) throw err;});
	res.send();
}

async function me(req: Request, res: Response) {
	res.json({data: req.session.user});
}

/* - - - - - - - - - - - - - - - - - - */

export {signIn, signUp, me, logout};
