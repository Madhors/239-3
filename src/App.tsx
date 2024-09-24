import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
            <Route path="/1" element={<ProtectedPage component={Page1} />} />
            <Route path="/2" element={<ProtectedPage component={Page2} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

const ProtectedPage = ({ component: Component }) => {
  const { authStatus, signOut } = useAuthenticator(context => [context.authStatus, context.signOut]);

  console.log('ProtectedPage authStatus:', authStatus);

  if (authStatus !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    console.log('Current authStatus:', authStatus);
  };

  return (
    <div>
      <Component />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const Home = () => {
  console.log('Rendering Home component');
  const { authStatus, signOut, user } = useAuthenticator(context => {
    console.log('useAuthenticator hook triggered');
    return [context.authStatus, context.user, context.signOut];
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>Current user: {user ? user.username : 'None'}</p>
      <button onClick={handleLogout}>Sign Out</button>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/1">Go to Page 1</Link></li>
          <li><Link to="/2">Go to Page 2</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const Page1 = () => {
  return (
    <div>
      <h1>Page 1</h1>
      <nav>
        <ul>
          <li><Link to="/">Go to Home</Link></li>
          <li><Link to="/1">Page 1</Link></li>
          <li><Link to="/2">Go to Page 2</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const Page2 = () => {
  return (
    <div>
      <h1>Page 2</h1>
      <nav>
        <ul>
          <li><Link to="/">Go to Home</Link></li>
          <li><Link to="/1">Go to Page 1</Link></li>
          <li><Link to="/2">Page 2</Link></li>
        </ul>
      </nav>
    </div>
  );
};