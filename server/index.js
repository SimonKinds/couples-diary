// @flow
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import GraphQlSchema from './Schema';
import Authentication from './Authentication';
import UserModel from './models/User';
import CoupleModel from './models/Couple';

const PORT = 3000;
const app = express();

app.use(
  '/graphql', bodyParser.json(),
  graphqlExpress({
    schema: GraphQlSchema,
    context: { Authentication, User: UserModel, Couple: CoupleModel },
  }),
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
app.listen(PORT);
