import axios from 'axios';
import '../styles/AddProduct.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBasket from '../components/ErrorBasket.jsx'

const AddProduct = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    country: '',
    price: '',
    pictures_url: ''
  });
  const [errors, setErrors] = useState({});

  // Проверка авторизации и прав
  const isAuthenticated = !!localStorage.getItem('pk');
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  // Если пользователь не авторизован - сразу редирект на 404
  if (!isAuthenticated) {
    return (
        <div>
            <Header />
            <ErrorBasket />
            <Footer />
        </div>
    );
  }

  // Если пользователь не суперпользователь - показываем модалку
  if (!isSuperuser && !showModal) {
    setShowModal(true);
  }

  // Обработчик изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Валидация в реальном времени
    if (name === 'description' && value.length > 500) {
      setErrors(prev => ({ ...prev, description: 'Описание не должно превышать 500 символов' }));
    } else if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Название обязательно';
    if (!formData.description) newErrors.description = 'Описание обязательно';
    if (formData.description.length > 500) newErrors.description = 'Описание слишком длинное';
    if (!formData.quantity) newErrors.quantity = 'Количество обязательно';
    if (!formData.country) newErrors.country = 'Страна обязательна';
    if (!formData.price) newErrors.price = 'Цена обязательна';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8002/products/', formData, {
      });
      
      if (response.status === 201) {
        alert('Товар успешно добавлен!');
        navigate('/');
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      alert('Произошла ошибка при добавлении товара');
    }
  };

  // Закрытие модального окна с редиректом
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div>
        <Header />
        <div className="add-product-container">
        {/* Модальное окно для неадминистраторов */}
        {showModal && (
            <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <h3>Доступ запрещен</h3>
                <p>У Вас нет прав администратора, поэтому Вы не можете добавлять товары на платформу</p>
                <button 
                className="admin-modal-close-button"
                onClick={handleCloseModal}
                >
                Закрыть
                </button>
            </div>
            </div>
        )}

        {/* Форма добавления товара (только для администраторов) */}
        {isSuperuser && (
            <div className="add-product-card3">
              {/* Кнопка возврата в админ-панель */}
              <button 
                className="back-to-admin-btn"
                onClick={() => navigate('/admin-panel/')}
              >
                &larr; Вернуться в админ-панель
              </button>
            
            <h2>Добавление нового товара</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group3">
                <label>Название товара *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input3 ${errors.name ? 'input-error3' : ''}`}
                    placeholder="Введите название товара"
                />
                {errors.name && <div className="error-message3">{errors.name}</div>}
                </div>
                
                <div className="form-group3">
                <label>Описание *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`form-textarea3 ${errors.description ? 'input-error3' : ''}`}
                    placeholder="Опишите товар (максимум 500 символов)"
                    maxLength={500}
                ></textarea>
                <div className="char-counter">
                    {formData.description.length}/500 символов
                </div>
                {errors.description && <div className="error-message3">{errors.description}</div>}
                </div>
                
                <div className="form-row">
                <div className="form-group3">
                    <label>Количество *</label>
                    <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className={`form-input3 ${errors.quantity ? 'input-error3' : ''}`}
                    placeholder="Введите количество"
                    />
                    {errors.quantity && <div className="error-message3">{errors.quantity}</div>}
                </div>
                
                <div className="form-group3">
                    <label>Цена *</label>
                    <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`form-input31 ${errors.price ? 'input-error3' : ''}`}
                    placeholder="Введите цену"
                    />
                    {errors.price && <div className="error-message3">{errors.price}</div>}
                </div>
                </div>
                
                <div className="form-group3">
                <label>Страна производства *</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`form-input3 ${errors.country ? 'input-error3' : ''}`}
                    placeholder="Введите страну производства"
                />
                {errors.country && <div className="error-message3">{errors.country}</div>}
                </div>
                
                <div className="form-group3">
                <label>Ссылка на изображение (необязательно)</label>
                <input
                    type="url"
                    name="pictures_url"
                    value={formData.pictures_url}
                    onChange={handleChange}
                    className="form-input3"
                    placeholder="https://example.com/image.jpg"
                />
                </div>
                
                <div className="form-actions">
                <button 
                    type="submit"
                    className="submit-button3"
                >
                    Добавить товар
                </button>
                <button 
                    type="button"
                    className="cancel-button3"
                    onClick={() => navigate('/admin-panel/')}
                >
                    Отмена
                </button>
                </div>
            </form>
            </div>
        )}
        </div>
        <Footer />
    </div>
  );
};

export default AddProduct;