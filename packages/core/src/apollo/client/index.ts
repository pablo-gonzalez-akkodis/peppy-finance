import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({
      uri,
    }),
    ssrMode: typeof window === "undefined",
    connectToDevTools: typeof window !== "undefined", // FixMe: && process.NODE_ENV === "development"
    cache: new InMemoryCache(),
  });
}
