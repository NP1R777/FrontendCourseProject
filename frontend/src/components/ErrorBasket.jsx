import React from 'react';
import '../styles/NotFound.css'
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-header">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">
              <p className='article-new'>
                Чтобы совершить это действие,
                нажмите на кнопку для регистрации,
                или войдите, если у Вас есть аккаунт!
              </p>
            </p>
          </div>
          <button
            className="register-button1"
            onClick={handleRegister}
          >
            Зарегистрироваться!
          </button>
          <p>
            <button
              className='login-button1'
              onClick={handleLogin}
            >
              Войдите, если есть аккаунт!
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
