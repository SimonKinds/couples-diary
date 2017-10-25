// @flow

import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';

import GraphQlSchema from './Schema';

const PORT = 3000;
const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: GraphQlSchema }));
app.listen(PORT);
