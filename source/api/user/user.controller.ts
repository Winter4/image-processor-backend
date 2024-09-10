import {Request, Response} from 'express';

import {db} from '@ctx';
import type {UserTable} from '@tables';

const User = db<UserTable>('users');

/* - - - - - - - - - - - - - - - - - - */

async function get(req: Request, res: Response) {
	res.json({data: await User.select('*').limit(1000)});
}

/* - - - - - - - - - - - - - - - - - - */

export {get};
