// @flow
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import GraphQlSchema from './Schema';

const PORT = 3000;
const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: GraphQlSchema }));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
app.listen(PORT);
