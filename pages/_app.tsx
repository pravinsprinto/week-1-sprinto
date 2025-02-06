import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import '../styles/global.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import * as Toast from '@radix-ui/react-toast';
import '../styles/toast.css';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Theme>
          <Toast.Provider swipeDirection="right">
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toast.Viewport className="ToastViewport" />
          </Toast.Provider>
        </Theme>
      </ApolloProvider>
    </AuthProvider>
  );
}
