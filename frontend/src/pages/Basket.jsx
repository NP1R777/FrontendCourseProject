import axios from 'axios';
import '../styles/OrderForm.css';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import React, { useEffect, useState } from 'react';
import ErrorBasket from '../components/ErrorBasket.jsx';
import ApplicationDetail from '../components/ApplicationDetail.jsx';

const OrderForm = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Функция для загрузки данных о заявках
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const pk = localStorage.getItem('pk');
        const response = await axios.get('http://localhost:8002/application/', {
          params: {
            pk: pk
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных о заявках:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleString('ru-RU', options);
  };

  // Функция для определения цвета статуса
  const getStatusColor = (order) => {
    if (order.is_active) return '#4CAF50'; // Зеленый
    else if (order.is_progress) return '#2196F3'; // Синий
    else if (order.is_close) return '#9E9E9E'; // Серый
    else if (order.is_draft) return '#FFC107'; // Желтый
    else if (order.is_reject) return '#F44336'; // Красный
    return '#000'; // Черный
  };

  // Функция для определения текста статуса
  const getStatusText = (order) => {
    if (order.is_active) return 'Активна';
    if (order.is_progress) return 'В процессе';
    if (order.is_close) return 'Закрыта';
    if (order.is_draft) return 'Черновик';
    if (order.is_reject) return 'Отклонена';
    return 'Неизвестно';
  };

  // Обработчик клика по заявке
  const handleOrderClick = (order) => {
    // Сбрасываем текущую выбранную заявку
    setSelectedOrder(null);
    
    // Получаем ID продукта из заявки
    const productId = order.id_product;
    localStorage.setItem('pk_application', order.pk);
    
    // Отправляем запрос на бэкенд для получения деталей продукта
    axios.get(`http://localhost:8002/products/${productId}/`)
      .then(response => {
        const productData = response.data;
        
        // Формируем данные для детального просмотра
        const orderDetails = {
          createdAt: order.created_at,
          status: getStatusText(order),
          quantity: order.quantity_product,
          totalPrice: order.quantity_product * productData.price,
          product: {
            name: productData.name,
            description: productData.description,
            country: productData.country,
            price: productData.price
          }
        };
        setSelectedOrder(orderDetails);
      })
      .catch(error => {
        console.error('Ошибка при получении данных о продукте:', error);
        // В случае ошибки показываем заглушку
        const orderDetails = {
          createdAt: order.created_at,
          status: getStatusText(order),
          quantity: "N/A",
          totalPrice: "N/A", 
          product: {
            name: "Товар",
            description: "Информация о товаре временно недоступна",
            country: "N/A",
            price: "N/A"
          }
        };
        setSelectedOrder(orderDetails);
      });
  };

  // Если выбрана заявка - показываем детали
  if (selectedOrder) {
    return (
      <div>
        <Header />
        <div className="back-button-container2">
          <button className="back-button2" onClick={() => setSelectedOrder(null)}>
            &larr; Назад к списку заявок
          </button>
        </div>
        <ApplicationDetail order={selectedOrder} />
        <Footer />
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <ErrorBasket />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="order-form">
        <h2>ЗАЯВКИ</h2>
        {orders.map((order, index) => (
          <div 
            key={index} 
            className="order-item"
            onClick={() => handleOrderClick(order)}
          >
            <div className="order-header">
              <div className="order-id">Заявка #{index + 1}</div>
              <div className="order-status" style={{ backgroundColor: getStatusColor(order) }}>
                {getStatusText(order)}
              </div>
            </div>
            <div className="order-details">
              <div className="order-detail">
                <span className="detail-label">Дата создания:</span>
                <span className="detail-value">{formatDate(order.created_at)}</span>
              </div>
              <div className="order-detail">
                <span className="detail-label">Дата удаления:</span>
                <span className="detail-value">{formatDate(order.deleted_at)}</span>
              </div>
              <div className="order-detail">
                <span className="detail-label">Количество товара:</span>
                <span className="detail-value">{order.quantity_product}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OrderForm;