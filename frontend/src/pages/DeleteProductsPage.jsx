import axios from 'axios';
import '../styles/DeleteProductsPage.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const DeleteProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8002/admin-panel/');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        setError('Не удалось загрузить товары');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Обработчик удаления/восстановления
  const handleToggleDelete = async (productId, isDeleted) => {
    try {
        const endpoint = isDeleted 
            ? `http://localhost:8002/products/${productId}/` 
            : `http://localhost:8002/products/${productId}/`;
      
      const method = isDeleted ? 'PATCH' : 'DELETE';
      
      await axios({
        method: method,
        url: endpoint
      });

      // Обновляем состояние
      setProducts(products.map(product => 
        product.pk === productId 
          ? { ...product, deleted_at: isDeleted ? null : new Date().toISOString() } 
          : product
      ));
    } catch (error) {
      console.error('Ошибка при изменении статуса товара:', error);
      alert('Произошла ошибка при выполнении операции');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="delete-products-container1">
        <div className="header-section1">
          <button 
            className="back-button1"
            onClick={() => navigate('/admin-panel')}
          >
            &larr; Назад к админ-панели
          </button>
          <h1>Управление товарами</h1>
          <p>Удаляйте и восстанавливайте товары на платформе</p>
        </div>

        <div className="products-grid1">
          {products.map(product => (
            <div 
              key={product.pk} 
              className={`product-card1 ${product.deleted_at ? 'deleted' : ''}`}
            >
              <h3 className="product-name1">{product.name}</h3>
              
              <div className="product-status1">
                {product.deleted_at ? (
                  <span className="status-deleted1">Удален</span>
                ) : (
                  <span className="status-active1">Активен</span>
                )}
              </div>
              
              <button
                className={`action-button1 ${product.deleted_at ? 'restore-button1' : 'delete-button1'}`}
                onClick={() => handleToggleDelete(product.pk, !!product.deleted_at)}
              >
                {product.deleted_at ? 'Восстановить' : 'Удалить'}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeleteProductsPage;