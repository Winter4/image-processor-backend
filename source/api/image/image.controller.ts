import {Request, Response} from 'express';
import {scryptSync as crypt} from 'crypto';

import config from '@config';
import {db} from '@ctx';
import type {UserTable} from '@tables';
import * as errors from '@err';

const User = db<UserTable>('users');

/* - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - */

export {signIn, signUp, me, logout};
