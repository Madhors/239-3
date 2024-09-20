import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

Amplify.configure(outputs);

export default function App() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [initialAuthStatus, setInitialAuthStatus] = useState(null);

  useEffect(() => {
    setInitialAuthStatus(authStatus);
    console.log('Initial authStatus:', authStatus);
  }, [authStatus]);

  return (
    <Router>
      <div>
        <p>Initial Authentication Status: {initialAuthStatus}</p>
        <p>Authentication Status: {authStatus}</p>
        {authStatus === 'configuring' && 'Loading...'}
        {authStatus !== 'authenticated' ? (
          <Authenticator />
        ) : (
          <Switch>
            <Route exact path="/">
              <Home initialAuthStatus={initialAuthStatus} />
            </Route>
            <Route path="/1">
              <ProtectedRoute>
                <Page1 />
              </ProtectedRoute>
            </Route>
            <Route path="/2">
              <ProtectedRoute>
                <Page2 />
              </ProtectedRoute>
            </Route>
            <Route path="/3">
              <ProtectedRoute>
                <Page3 />
              </ProtectedRoute>
            </Route>
          </Switch>
        )}
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  if (authStatus !== 'authenticated') {
    return <Redirect to="/" />;
  }

  return children;
};

const Home = ({ initialAuthStatus }) => {
  const { signOut } = useAuthenticator(context => [context.user, context.signOut]);

  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>Initial Authentication Status: {initialAuthStatus}</p>
      {/* Add your home page content here */}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

const Page1 = () => {
  return <h1>Page 1</h1>;
};

const Page2 = () => {
  return <h1>Page 2</h1>;
};

const Page3 = () => {
  return <h1>Page 3</h1>;
};