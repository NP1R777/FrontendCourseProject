import axios from 'axios';
import '../styles/EditProduct.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const { pk } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  // Проверка авторизации и прав
  const isAuthenticated = !!localStorage.getItem('pk');
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  // Загрузка данных товара
  useEffect(() => {
    if (!isAuthenticated || !isSuperuser) {
      setShowModal(true);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8002/products/${pk}/`);
        setFormData(response.data);
        setInitialData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pk, isAuthenticated, isSuperuser]);

  // Проверка изменений
  useEffect(() => {
    if (formData && initialData) {
      const changed = Object.keys(formData).some(key => 
        formData[key] !== initialData[key]
      );
      setIsChanged(changed);
    }
  }, [formData, initialData]);

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
    
    // Если нет изменений - просто возвращаемся
    if (!isChanged) {
      navigate('/edit-product-list/');
      return;
    }
    
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
      const response = await axios.put(
        `http://localhost:8002/products/${pk}/`, 
        formData
      );
      
      if (response.status === 200) {
        alert('Товар успешно обновлен!');
        navigate('/edit-product-list/');
      }
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      alert('Произошла ошибка при обновлении товара');
    }
  };

  // Закрытие модального окна с редиректом
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  // Возврат к списку товаров
  const handleBackToList = () => {
    navigate('/edit-product-list/');
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container4">
          <div className="loading-spinner4"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
        <Header />
        <div className="edit-product-container4">
        {/* Модальное окно для неадминистраторов */}
        {showModal && (
            <div className="admin-modal-overlay4">
            <div className="admin-modal-content4">
                <h3>Доступ запрещен</h3>
                <p>У Вас нет прав администратора, поэтому Вы не можете редактировать товары</p>
                <button 
                className="admin-modal-close-button4"
                onClick={handleCloseModal}
                >
                Закрыть
                </button>
            </div>
            </div>
        )}

        {/* Форма редактирования товара (только для администраторов) */}
        {isSuperuser && formData && (
            <div className="edit-product-card4">
              <button 
                className="back-to-list-btn4"
                onClick={handleBackToList}
              >
                &larr; К списку товаров
              </button>
            
            <h2>Редактирование товара</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group4">
                <label>Название товара *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input4 ${errors.name ? 'input-error4' : ''}`}
                    placeholder="Введите название товара"
                />
                {errors.name && <div className="error-message4">{errors.name}</div>}
                </div>
                
                <div className="form-group4">
                <label>Описание *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`form-textarea4 ${errors.description ? 'input-error4' : ''}`}
                    placeholder="Опишите товар (максимум 500 символов)"
                    maxLength={255}
                ></textarea>
                <div className="char-counter4">
                    {formData.description.length}/500 символов
                </div>
                {errors.description && <div className="error-message4">{errors.description}</div>}
                </div>
                
                <div className="form-row4">
                <div className="form-group4">
                    <label>Количество *</label>
                    <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className={`form-input4 ${errors.quantity ? 'input-error4' : ''}`}
                    placeholder="Введите количество"
                    />
                    {errors.quantity && <div className="error-message4">{errors.quantity}</div>}
                </div>
                
                <div className="form-group4">
                    <label>Цена *</label>
                    <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`form-input41 ${errors.price ? 'input-error4' : ''}`}
                    placeholder="Введите цену"
                    />
                    {errors.price && <div className="error-message4">{errors.price}</div>}
                </div>
                </div>
                
                <div className="form-group4">
                <label>Страна производства *</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`form-input4 ${errors.country ? 'input-error4' : ''}`}
                    placeholder="Введите страну производства"
                />
                {errors.country && <div className="error-message4">{errors.country}</div>}
                </div>
                
                <div className="form-group4">
                <label>Ссылка на изображение (необязательно)</label>
                <input
                    type="url"
                    name="pictures_url"
                    value={formData.pictures_url || ''}
                    onChange={handleChange}
                    className="form-input4"
                    placeholder="https://example.com/image.jpg"
                />
                </div>
                
                <div className="form-actions4">
                <button 
                    type="submit"
                    className={`submit-button4 ${!isChanged ? 'unchanged-button4' : ''}`}
                    disabled={!isChanged && Object.keys(errors).length === 0}
                >
                    {isChanged ? 'Изменить товар' : 'Вернуться к списку'}
                </button>
                <button 
                    type="button"
                    className="cancel-button4"
                    onClick={handleBackToList}
                >
                    Отменить
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

export default EditProduct;