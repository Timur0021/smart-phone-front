import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";


export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: "http://smart-phone.test/graphql",
    }),
    cache: new InMemoryCache()
})