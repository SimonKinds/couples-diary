// @flow

import express from 'express';
import type {$Application, $Request, $Response} from 'express';
const app = express();

app.get('/', (req: $Request, res: $Response) => res.status(200).send());
app.get('/signup', (req: $Request, res: $Response) => res.status(200).send());

export default app;
