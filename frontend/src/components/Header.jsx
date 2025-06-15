import React, { useEffect, useState } from 'react';
import '../styles/App.css';

const Header = ({ onSortAsc, onSortDesc }) => {
  const [isLogin, setIsLogin] = useState(null);

  useEffect(() => {
    const key = localStorage.getItem("pk");
    if (key) {
      setIsLogin(key);
    } else {
      setIsLogin(null);
    }
  }, []);

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>Marketplace</h1>
        </div>
        <nav>
          <ul>
            <li><a href="/admin-panel/">Админ-панель</a></li>
            <li><a href="/">Товары</a></li>
            <li><a href="/basket/">Корзина</a></li>
            {isLogin === null && (
              <>
                <li><a href="/login">Войти</a></li>
                <li><a href="/register/">Регистрация</a></li>
              </>
            )}
            {isLogin && (
              <>
                <li><a href="/profile/">Личный кабинет</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;