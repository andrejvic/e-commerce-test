import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql", // Zameni sa svojim backend URL-om
  cache: new InMemoryCache(),
});

export default client;
