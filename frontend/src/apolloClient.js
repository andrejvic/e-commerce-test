import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://andrejvicanovic.com/api/public/graphql", // Zameni sa svojim backend URL-om
  cache: new InMemoryCache(),
});

export default client;
