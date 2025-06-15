import axios from 'axios';
import '../styles/Registration.css';
import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';


const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8002/user/user/', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        console.log(response);
        console.log(response.data);
        localStorage.setItem('email', response.data.data.email);
        alert('Вы успешно зарегистрировались!');
        navigate('/login/'); // Перенаправление на страницу авторизации
      }
    } catch (error) {
      setError('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div>
      <Header />
      <div className="registration-page">
        <div className="registration-container">
          <h2 className="registration-title">Регистрация</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Придумайте пароль:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Повторите пароль:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="register-button">Зарегистрироваться!</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
