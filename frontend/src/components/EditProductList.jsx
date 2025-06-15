import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import '../styles/EditProductList.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const EditProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка прав администратора
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  useEffect(() => {
    if (!isSuperuser) {
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8002/products/');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке товаров');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isSuperuser, navigate]);

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleBackToAdmin = () => {
    navigate('/admin-panel/');
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container5">
          <div className="loading-spinner5"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="error-container5">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="edit-product-list-container5">
        <button 
          className="back-to-admin-btn5"
          onClick={handleBackToAdmin}
        >
          &larr; Вернуться в админ-панель
        </button>
        
        <div className='h11'>
            <h1>Редактирование товаров</h1>
            <p className="subtitle5">Выберите товар для редактирования</p>
        </div>
        
        <div className="products-grid5">
          {products.map(product => (
            <div 
              key={product.pk} 
              className="product-card5"
            >
              <div className="product-image-container5">
                {product.pictures_url ? (
                  <img 
                    src={product.pictures_url} 
                    alt={product.name} 
                    className="product-image5"
                  />
                ) : (
                  <div className="image-placeholder5">Нет изображения</div>
                )}
              </div>
              <div className="product-info5">
                <h3>{product.name}</h3>
                <p className="product-country5">Страна: {product.country || 'Без категории'}</p>
                <p className="product-price5">Цена: {product.price} руб.</p>
              </div>
              <button 
                onClick={() => handleEdit(product.pk)}
                className="edit-button5"
              >
                Изменить
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProductList;