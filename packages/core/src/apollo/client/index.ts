import * as apolloRaw from "@apollo/client";
const { ApolloClient, HttpLink, InMemoryCache } = ((apolloRaw as any).default ??
  apolloRaw) as typeof apolloRaw;
export function createApolloClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({
      uri,
    }),
    ssrMode: typeof window === "undefined",
    connectToDevTools:
      typeof window !== "undefined" && process.env.NODE_ENV === "development",
    cache: new InMemoryCache(),
  });
}
