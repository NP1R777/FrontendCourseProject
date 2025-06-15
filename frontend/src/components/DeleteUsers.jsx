import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/DeleteUsers.css';

const DeleteUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);

  // Проверка прав доступа
  useEffect(() => {
    const pk = localStorage.getItem('pk');
    const superuser = localStorage.getItem('is_superuser') === 'true';
    
    if (!pk) {
      navigate('/error/');
    } else if (!superuser) {
      navigate('/');
    } else {
      setIsSuperuser(true);
      fetchUsers();
    }
  }, [navigate]);

  // Загрузка пользователей
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8002/user-list/');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      setLoading(false);
    }
  };

  // Обработчик удаления/восстановления
  const handleToggleDelete = async (userId, isDeleted) => {
    try {
      const action = isDeleted ? 'восстановление' : 'удаление';
      const url = `http://localhost:8002/user-detail/${userId}/`;
      
      await axios.patch(url, {
        deleted_at: isDeleted ? null : new Date().toISOString().split('T')[0]
      });
      
      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.pk === userId 
            ? { ...user, deleted_at: isDeleted ? null : new Date().toISOString().split('T')[0] } 
            : user
        )
      );
      
      alert(`Пользователь успешно ${isDeleted ? 'восстановлен' : 'удален'}!`);
    } catch (error) {
      console.error(`Ошибка при ${isDeleted ? 'восстановлении' : 'удалении'} пользователя:`, error);
      alert('Произошла ошибка при выполнении операции');
    }
  };

  // Возврат в админ-панель
  const handleBackToAdmin = () => {
    navigate('/admin-panel/');
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="delete-users-loading-container">
          <div className="delete-users-loading-spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="delete-users-error-container">
          <p>{error}</p>
          <button 
            className="delete-users-retry-button"
            onClick={fetchUsers}
          >
            Повторить попытку
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="delete-users-container">
        <button 
          className="delete-users-back-button"
          onClick={handleBackToAdmin}
        >
          &larr; Вернуться в админ-панель
        </button>
        
        <h1 className="delete-users-title">Управление пользователями</h1>
        <p className="delete-users-subtitle">Удаление и восстановление аккаунтов</p>
        
        <div className="delete-users-grid">
          {users.map(user => (
            <div 
              key={user.pk} 
              className={`delete-users-card ${user.deleted_at ? 'deleted-user' : ''}`}
            >
              <div className="delete-users-email">
                {user.email}
                {user.deleted_at && (
                  <span className="delete-users-status"> (Удалён)</span>
                )}
              </div>
              
              <div className="delete-users-meta">
                <div className="delete-users-info">
                  <span>ID: {user.pk}</span>
                  <span>Админ: {user.is_superuser ? 'Да' : 'Нет'}</span>
                </div>
                
                <button 
                  className={`delete-users-action-button ${user.deleted_at ? 'restore-button' : 'delete-button'}`}
                  onClick={() => handleToggleDelete(user.pk, !!user.deleted_at)}
                >
                  {user.deleted_at ? 'Восстановить' : 'Удалить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeleteUsers;