import {Request, Response} from 'express';

import User from '@models/user.model';

/* - - - - - - - - - - - - - - - - - - */

async function get(req: Request, res: Response) {
	res.json({data: await User.getMany({})});
}

/* - - - - - - - - - - - - - - - - - - */

export {get};
