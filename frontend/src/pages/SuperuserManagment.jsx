import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/SuperuserManagement.css';

const SuperuserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    is_superuser: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Проверка прав доступа
  useEffect(() => {
    const pk = localStorage.getItem('pk');
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';
    
    if (!pk) {
      navigate('/error/');
    } else if (!isSuperuser) {
      navigate('/');
    } else {
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

  // Обработчик создания суперпользователя
  const handleCreateSuperuser = async (e) => {
    e.preventDefault();
    
    // Валидация
    const errors = {};
    if (!newUser.email) errors.email = 'Email обязателен';
    if (!newUser.password) errors.password = 'Пароль обязателен';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8002/user/user/', newUser);
      
      if (response.status === 201) {
        alert('Суперпользователь успешно создан!');
        setShowCreateForm(false);
        setNewUser({ email: '', password: '', is_superuser: true });
        fetchUsers(); // Обновляем список
      }
    } catch (error) {
      console.error('Ошибка при создании суперпользователя:', error);
      alert('Произошла ошибка при создании пользователя');
    }
  };

  // Обработчик повышения прав пользователя
  const handleMakeSuperuser = async (userId) => {
    try {
      await axios.patch(`http://localhost:8002/user-detail/${userId}/`, {
        is_superuser: true
      });
      
      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_superuser: true } : user
        )
      );
      
      alert('Пользователь успешно повышен до суперпользователя!');
    } catch (error) {
      console.error('Ошибка при повышении прав пользователя:', error);
      alert('Произошла ошибка при выполнении операции');
    }
  };

  // Обработчик понижения прав пользователя
  const handleRevokeSuperuser = async (userId) => {
    try {
      await axios.patch(`http://localhost:8002/user-detail/${userId}/`, {
        is_superuser: false
      });
      
      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.pk === userId ? { ...user, is_superuser: false } : user
        )
      );
      
      alert('Права суперпользователя успешно отозваны!');
    } catch (error) {
      console.error('Ошибка при понижении прав пользователя:', error);
      alert('Произошла ошибка при выполнении операции');
    }
  };

  // Возврат в админ-панель
  const handleBackToAdmin = () => {
    navigate('/admin-panel/');
  };

  // Обработчик изменений формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибки при изменении
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="superuser-management-loading-container">
          <div className="superuser-management-loading-spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="superuser-management-error-container">
          <p>{error}</p>
          <button 
            className="superuser-management-retry-button"
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
      <div className="superuser-management-container">
        <button 
          className="superuser-management-back-button"
          onClick={handleBackToAdmin}
        >
          &larr; Вернуться в админ-панель
        </button>
        
        <h1 className="superuser-management-title">Управление суперпользователями</h1>
        
        <div className="superuser-management-header">
          <button 
            className="superuser-management-create-button"
            onClick={() => setShowCreateForm(true)}
          >
            Создать суперпользователя
          </button>
        </div>
        
        <div className="superuser-management-grid">
          {users.map(user => (
            <div 
              key={user.pk} 
              className={`superuser-management-card ${user.deleted_at ? 'deleted-user' : ''}`}
            >
              <div className="superuser-management-email">
                {user.email}
                {user.deleted_at && (
                  <span className="superuser-management-status"> (Удалён)</span>
                )}
              </div>
              
              <div className="superuser-management-meta">
                <div className="superuser-management-info">
                  <span>ID: {user.pk}</span>
                  <span>Статус: {user.is_superuser ? 'Администратор' : 'Пользователь'}</span>
                </div>
                
                {!user.is_superuser && !user.deleted_at && (
                  <button 
                    className="superuser-management-action-button make-superuser-button"
                    onClick={() => handleMakeSuperuser(user.pk)}
                    disabled={user.deleted_at}
                  >
                    Сделать суперпользователем
                  </button>
                )}
                
                {user.is_superuser && !user.deleted_at && (
                  <button 
                    className="superuser-management-action-button revoke-superuser-button"
                    onClick={() => handleRevokeSuperuser(user.pk)}
                  >
                    Сделать обычным пользователем
                  </button>
                )}
                
                {user.deleted_at && (
                  <div className="superuser-management-disabled-text">
                    Учётная запись удалена
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Модальное окно создания суперпользователя */}
        {showCreateForm && (
          <div className="superuser-management-modal-overlay">
            <div className="superuser-management-modal-content">
              <button 
                className="superuser-management-modal-close"
                onClick={() => setShowCreateForm(false)}
              >
                &times;
              </button>
              
              <h2>Создание суперпользователя</h2>
              
              <form onSubmit={handleCreateSuperuser}>
                <div className="superuser-management-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className={`superuser-management-form-input ${formErrors.email ? 'input-error' : ''}`}
                    placeholder="Введите email"
                  />
                  {formErrors.email && <div className="superuser-management-error">{formErrors.email}</div>}
                </div>
                
                <div className="superuser-management-form-group">
                  <label>Пароль *</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className={`superuser-management-form-input ${formErrors.password ? 'input-error' : ''}`}
                    placeholder="Введите пароль"
                  />
                  {formErrors.password && <div className="superuser-management-error">{formErrors.password}</div>}
                </div>
                
                <div className="superuser-management-form-actions">
                  <button 
                    type="submit"
                    className="superuser-management-submit-button"
                  >
                    Создать
                  </button>
                  <button 
                    type="button"
                    className="superuser-management-cancel-button"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SuperuserManagement;