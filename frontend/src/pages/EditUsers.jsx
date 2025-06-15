import axios from 'axios';
import '../styles/EditUsers.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const EditUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
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

  // Открытие модального окна для редактирования
  const handleEditClick = (user) => {
    // Запрещаем редактирование удалённых пользователей
    if (user.deleted_at) return;
    
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username || '',
      is_superuser: user.is_superuser,
      is_staff: user.is_staff
    });
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({});
    setFormErrors({});
  };

  // Обработчик изменений в форме
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Очищаем ошибки при изменении
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Обработчик сохранения изменений
  const handleSaveChanges = async () => {
    // Валидация
    const errors = {};
    if (!formData.email) errors.email = 'Email обязателен';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Подготовка данных для отправки
      const updateData = { ...formData };
      
      // Отправляем PATCH запрос
      await axios.patch(`http://localhost:8002/user-detail/${editingUser.pk}/`, updateData);
      
      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.pk === editingUser.pk ? { ...user, ...updateData } : user
        )
      );
      
      alert('Данные пользователя успешно обновлены!');
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      alert('Произошла ошибка при обновлении данных');
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
        <div className="edit-users-loading-container">
          <div className="edit-users-loading-spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="edit-users-error-container">
          <p>{error}</p>
          <button 
            className="edit-users-retry-button"
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
      <div className="edit-users-container">
        <button 
          className="edit-users-back-button"
          onClick={handleBackToAdmin}
        >
          &larr; Вернуться в админ-панель
        </button>
        
        <h1 className="edit-users-title">Редактирование пользователей</h1>
        <p className="edit-users-subtitle">Изменение данных зарегистрированных пользователей</p>
        
        <div className="edit-users-grid">
          {users.map(user => (
            <div 
              key={user.pk} 
              className={`edit-users-card ${user.deleted_at ? 'deleted-user' : ''}`}
            >
              <div className="edit-users-email">
                {user.email}
                {user.deleted_at && (
                  <span className="edit-users-status"> (Удалён)</span>
                )}
              </div>
              
              <div className="edit-users-meta">
                <div className="edit-users-info">
                  <span>ID: {user.pk}</span>
                  <span>Статус: {user.is_superuser ? 'Администратор' : 'Пользователь'}</span>
                </div>
                
                <button 
                  className={`edit-users-action-button ${user.deleted_at ? 'edit-users-action-disabled' : ''}`}
                  onClick={() => handleEditClick(user)}
                  disabled={!!user.deleted_at}
                >
                  Изменить
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Модальное окно редактирования */}
        {editingUser && (
          <div className="edit-users-modal-overlay">
            <div className="edit-users-modal-content">
              <button 
                className="edit-users-modal-close"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              
              <h2>Редактирование пользователя</h2>
              <p className="edit-users-user-pk">ID: {editingUser.pk}</p>
              
              <form>
                <div className="edit-users-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`edit-users-form-input ${formErrors.email ? 'input-error' : ''}`}
                    placeholder="Введите email"
                  />
                  {formErrors.email && <div className="edit-users-error">{formErrors.email}</div>}
                </div>
                
                <div className="edit-users-form-row">
                  <div className="edit-users-form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_superuser"
                        checked={formData.is_superuser || false}
                        onChange={handleInputChange}
                      />
                      Администратор
                    </label>
                  </div>
                </div>
                
                <div className="edit-users-form-actions">
                  <button 
                    type="button"
                    className="edit-users-save-button"
                    onClick={handleSaveChanges}
                  >
                    Сохранить
                  </button>
                  <button 
                    type="button"
                    className="edit-users-cancel-button"
                    onClick={handleCloseModal}
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

export default EditUsers;