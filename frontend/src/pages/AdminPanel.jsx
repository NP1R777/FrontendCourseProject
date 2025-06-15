import '../styles/AdminPanel.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

  // Проверка прав доступа
  useEffect(() => {
    const pk = localStorage.getItem('pk');
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';
    
    if (!pk) {
      navigate('/error/');
    } else if (!isSuperuser) {
      setShowAccessDeniedModal(true);
    }
  }, [navigate]);

  // Обработчики кнопок
  const handleDeleteProduct = () => {
    navigate('/delete-products/');
  };

  const handleEditProduct = () => {
    navigate('/edit-product-list/');
  };

  const handleAddProduct = () => {
    navigate('/add-product/');
  };

  const handleDeleteUser = () => {
    navigate('/delete-users/');
  };

  const handleCreateSuperuser = () => {
    navigate('/create-superuser/');
  };

  const handleEditUser = () => {
    navigate('/edit-users/');
  };

  // Закрытие модального окна с редиректом
  const handleCloseModal = () => {
    setShowAccessDeniedModal(false);
    navigate('/');
  };

  return (
    <div>
      <Header />
      <div className="admin-panel-container1">
        {/* Модальное окно для пользователей без прав администратора */}
        {showAccessDeniedModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <h3>Доступ запрещен</h3>
              <p>Вы не можете попасть в админ-панель, так как не являетесь администратором сайта</p>
              <button 
                className="admin-modal-close-button"
                onClick={handleCloseModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        
        {/* Основной контент админ-панели */}
        {!showAccessDeniedModal && (
          <div className="admin-panel-card1">
            <h1 className="admin-title1">Панель администратора</h1>
            <p className="admin-subtitle1">Управление платформой</p>
            
            <div className="admin-buttons-grid1">
              {/* Управление товарами */}
              <div 
                className="admin-button-card1"
                onClick={handleDeleteProduct}
              >
                <div className="button-icon1 delete-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                </div>
                <h3>Удалить товар</h3>
                <p>Удаление товара с платформы</p>
              </div>
              
              <div 
                className="admin-button-card1"
                onClick={handleEditProduct}
              >
                <div className="button-icon1 edit-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </div>
                <h3>Изменить товар</h3>
                <p>Редактирование информации о товаре</p>
              </div>
              
              <div 
                className="admin-button-card1"
                onClick={handleAddProduct}
              >
                <div className="button-icon1 add-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                </div>
                <h3>Добавить товар</h3>
                <p>Добавление нового товара на платформу</p>
              </div>
              
              {/* Управление пользователями */}
              <div 
                className="admin-button-card1"
                onClick={handleDeleteUser}
              >
                <div className="button-icon1 user-delete-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" />
                  </svg>
                </div>
                <h3>Удалить пользователя</h3>
                <p>Удаление пользователя с платформы</p>
              </div>
              
              <div 
                className="admin-button-card1"
                onClick={handleCreateSuperuser}
              >
                <div className="button-icon1 superuser-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
                  </svg>
                </div>
                <h3>Создать суперпользователя</h3>
                <p>Назначение прав администратора пользователю</p>
              </div>
              
              <div 
                className="admin-button-card1"
                onClick={handleEditUser}
              >
                <div className="button-icon1 user-edit-icon1">
                  <svg viewBox="0 0 24 24">
                    <path d="M12,12C14.21,12 16,14.21 16,16C16,17.71 14.21,20 12,20C9.79,20 8,17.71 8,16C8,14.21 9.79,12 12,12M12,4C16.42,4 20,7.58 20,12C20,13.03 17.76,19.61 16.67,21.83C15.27,20.95 13.71,20.5 12,20.5C10.29,20.5 8.73,20.95 7.33,21.83C6.24,19.61 4,13.03 4,12C4,7.58 7.58,4 12,4M15,9L13.74,6.25L15,3L12.25,4.26L9.5,3L10.76,5.74L9.03,8.5L11.27,9.96L12,12.5L12.73,9.96L14.97,8.5L13.24,6.25L15,9Z" />
                  </svg>
                </div>
                <h3>Изменить пользователя</h3>
                <p>Редактирование данных пользователей платформы</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;