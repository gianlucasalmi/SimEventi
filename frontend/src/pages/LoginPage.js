import LoginForm from '../components/LoginForm';

function LoginPage({ onLogin }) {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-5 col-lg-4">
          <h2 className="text-center mb-4">Login</h2>
          <LoginForm onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
