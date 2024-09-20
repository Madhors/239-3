import { Authenticator, useAuthenticator, AuthStatus } from '@aws-amplify/ui-react'; // Amplify UI 라이브러리에서 Authenticator, useAuthenticator, AuthStatus 가져오기
import { Amplify } from 'aws-amplify'; // AWS Amplify 라이브러리 가져오기
import '@aws-amplify/ui-react/styles.css'; // Amplify UI 스타일 가져오기
import outputs from "../amplify_outputs.json"; // Amplify 구성 파일 가져오기
import { useEffect, useState } from 'react'; // React 훅 가져오기
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // React Router 라이브러리 가져오기

Amplify.configure(outputs); // Amplify 설정

export default function App() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]); // Amplify 인증 상태 가져오기
  const [initialAuthStatus, setInitialAuthStatus] = useState<AuthStatus | null>(null); // 초기 인증 상태 상태 변수 정의 (AuthStatus 타입 또는 null)

  useEffect(() => { // 인증 상태 변경 시 초기 인증 상태 업데이트
    setInitialAuthStatus(authStatus);
    console.log('Initial authStatus:', authStatus);
  }, [authStatus]);

  return (
    <Router> {/* React Router 설정 */}
      <div>
        <p>Initial Authentication Status: {initialAuthStatus}</p> {/* 초기 인증 상태 출력 */}
        <p>Authentication Status: {authStatus}</p> {/* 현재 인증 상태 출력 */}
        {authStatus === 'configuring' && 'Loading...'} {/* 인증 상태가 configuring일 때 Loading... 출력 */}
        {authStatus !== 'authenticated' ? ( // 인증되지 않았다면 Authenticator 컴포넌트 렌더링
          <Authenticator />
        ) : (
          <Routes> {/* 인증되었다면 라우트 경로에 따른 페이지 렌더링 */}
            <Route path="/" element={<Home initialAuthStatus={initialAuthStatus} />} /> {/* 홈 페이지 */}
            <Route path="/1" element={<ProtectedRoute><Page1 /></ProtectedRoute>} /> {/* /1 경로, ProtectedRoute로 보호 */}
            <Route path="/2" element={<ProtectedRoute><Page2 /></ProtectedRoute>} /> {/* /2 경로, ProtectedRoute로 보호 */}
            <Route path="/3" element={<ProtectedRoute><Page3 /></ProtectedRoute>} /> {/* /3 경로, ProtectedRoute로 보호 */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => { // ProtectedRoute 컴포넌트 정의
  const { authStatus } = useAuthenticator(context => [context.authStatus]); // 인증 상태 가져오기

  if (authStatus !== 'authenticated') { // 인증되지 않았다면 홈 페이지로 리디렉션
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // 인증되었다면 자식 컴포넌트 렌더링
};

type HomeProps = { // Home 컴포넌트의 prop 타입 정의
  initialAuthStatus: AuthStatus | null; // initialAuthStatus는 AuthStatus 타입 또는 null
};

const Home: React.FC<HomeProps> = ({ initialAuthStatus }) => { // Home 컴포넌트 정의
  const { signOut } = useAuthenticator(context => [context.user, context.signOut]); // signOut 함수 가져오기

  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>Initial Authentication Status: {initialAuthStatus}</p> {/* 초기 인증 상태 출력 */}
      {/* 홈 페이지 컨텐츠 */}
      <button onClick={signOut}>Sign Out</button> {/* 로그아웃 버튼 */}
    </div>
  );
};

const Page1 = () => { // Page1 컴포넌트 정의
  return <h1>Page 1</h1>;
};

const Page2 = () => { // Page2 컴포넌트 정의
  return <h1>Page 2</h1>;
};

const Page3 = () => { // Page3 컴포넌트 정의
  return <h1>Page 3</h1>;
};