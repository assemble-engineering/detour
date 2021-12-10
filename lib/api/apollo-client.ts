// ./apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';
import env from '../../env';

const client = new ApolloClient({
  uri: `${env.githubGraphQlApi}`,
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${process.env.NEXT_APP_GITHUB_API_KEY}`,
  },
});

export default client;
