import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

Amplify.configure(outputs);

export default function App() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  return (
    <Router>
      <div>
        <p>Authentication Status: {authStatus}</p>
        {authStatus === 'configuring' && 'Loading...'}
        {authStatus !== 'authenticated' ? (
          <Authenticator />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/1" element={<ProtectedRoute><Page1 /></ProtectedRoute>} />
            <Route path="/2" element={<ProtectedRoute><Page2 /></ProtectedRoute>} />
            <Route path="/3" element={<ProtectedRoute><Page3 /></ProtectedRoute>} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  if (authStatus !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Home: React.FC = () => {
  const { signOut } = useAuthenticator(context => [context.user, context.signOut]);

  return (
    <div>
      <h1>Welcome to the Home page!</h1>
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