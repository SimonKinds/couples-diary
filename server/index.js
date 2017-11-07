// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async

import express from 'express';
import type { $Request, $Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import uuid from 'uuid/v4';

import GraphQlSchema from './Schema';
import Authentication from './Authentication';
import UserModel from './models/User';
import CoupleModel from './models/Couple';

const PORT = 3000;
const app = express();

const buildOptions = async (req: $Request, res: $Response) => {
  const clientId = req.cookies.client_id;
  if (!clientId) {
    res.cookie(
      'client_id', uuid(),
      {
        httpOnly: true, expires: new Date(2080, 0, 0),
      },
    );
  }

  return {
    schema: GraphQlSchema,
    context: {
      clientId,
      user: await Authentication.getUserFromHeader(req.header('Authorization')),
      Authentication,
      User: UserModel,
      Couple: CoupleModel,
    },
  };
};

app.use(cookieParser());
app.use(
  '/graphql', bodyParser.json(),
  graphqlExpress(buildOptions),
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
app.listen(PORT);
