import React, { useState } from 'react';
import '../styles/ApplicationDetail.css';

const ApplicationDetails = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  
  if (!order) return <div className="loading">Загрузка данных...</div>;

  const { createdAt, status, quantity, totalPrice, product } = order;
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Цвета для статусов
  const statusColors = {
    'активна': '#4caf50',
    'в процессе': '#2196f3',
    'отклонена': '#f44336',
    'отменена': '#9e9e9e',
    'неизвестно': '#ff9800'
  };

  // Проверка прав администратора
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';
  
  // Обработчик кнопки "Изменить заявку"
  const handleEditClick = () => {
  if (isSuperuser) {
    // Перенаправляем на страницу редактирования с передачей ID заявки
    window.location.href = `/edit-application/${order.pk}`;
  } else {
    setShowModal(true);
  }
};

  return (
    <div className="order-container2">
      {/* Модальное окно для неадминистраторов */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Доступ запрещен</h3>
            <p>Извините, Вы не можете менять заявку, так как
              не являетесь администратором сайта</p>
            <button 
              className="modal-close-button"
              onClick={() => setShowModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
      
      <div className="order-card2">
        <div className="order-header2">
          <h2>Информация о заявке</h2>
          <div className="status-indicator2" 
               style={{ backgroundColor: statusColors[status] }}>
            {status}
          </div>
        </div>
        
        <div className="order-details2">
          <div className="detail-item2">
            <span className="detail-label2">Дата создания:</span>
            <span className="detail-value2">{formatDate(createdAt)}</span>
          </div>
          
          <div className="detail-item2">
            <span className="detail-label2">Количество:</span>
            <span className="detail-value2">{quantity} шт.</span>
          </div>
          
          <div className="detail-item2">
            <span className="detail-label2">Общая стоимость:</span>
            <span className="detail-value2 total-price2">{totalPrice} руб.</span>
          </div>
        </div>
        
        <div className="product-section2">
          <h3>Информация о товаре</h3>
          <div className="product-card2">
            <h4 className="product-title2">{product.name}</h4>
            
            <div className="product-description2">
              <p>{product.description}</p>
            </div>
            
            <div className="product-details2">
              <div className="product-info2">
                <span className="info-label2">Страна производства:</span>
                <span className="info-value2">{product.country}</span>
              </div>
              
              <div className="product-info2">
                <span className="info-label2">Цена за единицу:</span>
                <span className="info-value2 price2">{product.price} руб.</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Кнопка "Изменить заявку" */}
        <div className="edit-button-container">
          <button 
            className="edit-button"
            onClick={handleEditClick}
          >
            Изменить заявку
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;