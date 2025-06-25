import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-5 col-lg-4">
          <h2 className="text-center mb-4">Registrazione</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
