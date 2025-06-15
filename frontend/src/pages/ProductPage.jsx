import '../styles/order.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import React, { useState, useEffect } from 'react';
import ErrorBasket from '../components/ErrorBasket.jsx'
import { useParams, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const { pk } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Обработчик изменения количества
  const handleQuantityChange = (e) => {
    let value = e.target.value;

    // Удаляем ведущие нули, кроме случая, когда вводится "0"
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Убедимся, что значение не пустое и это число
    if (value === '' || !isNaN(value)) {
      setQuantity(value === '' ? 1 : Number(value));
    }
  };

  // Обработчик уменьшения количества
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Обработчик увеличения количества
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8002/products/${pk}/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Ошибка при получении данных товара:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pk]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!product) {
      setError('Товар не загружен');
      return;
    }

    const pk_user = localStorage.getItem('pk');
    const applicationData = {
      id_product: product.pk,
      quantity_product: quantity,
      is_active: true,
      is_progress: false,
      is_close: false,
      is_draft: false,
      is_reject: false,
      pk_user: pk_user
    };

    try {
      const response = await fetch('http://localhost:8002/application/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Заявка создана успешно:', result);
      console.log(applicationData);
      alert('Ваш заказ принят!');
      navigate('/');
    } catch (err) {
      console.error('Ошибка при создании заявки:', err);
      setError(err.message);
      // alert('Произошла ошибка при создании заявки.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка данных товара...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBasket />
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Товар не найден</h2>
        <p>Извините, но запрашиваемый товар не существует.</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <Header />
      <div className="order-root">
        <h1 className="order-text">Информация о товаре</h1>

        <div className="product-container">
          <div className="image-container">
            <img
              className="image-order-page"
              src={product.pictures_url}
              alt={product.name}
            />
          </div>
          <div className="product-details">
            <h2 className="product-title">{product.name}</h2>
            <div className="product-description-container">
              <h3>Описание:</h3>
              <p className='product-description-content'>
                {product.description}
              </p>
            </div>
            <ul className="product-specs">
              <li>
                <span className="spec-label">Страна производства:</span>
                <span className="spec-value">{product.country}</span>
              </li>
              <li>
                <span className="spec-label">Цена:</span>
                <span className="spec-value price">{product.price} руб.</span>
              </li>
            </ul>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="quantity-input">
                <label htmlFor="quantity">Количество:</label>
                <div className="quantity-control">
                  <button type="button" onClick={decrementQuantity} className="quantity-btn">
                    -
                  </button>
                  <input
                    className="text-input"
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    required
                  />
                  <button type="button" onClick={incrementQuantity} className="quantity-btn">
                    +
                  </button>
                </div>
              </div>
              <button className="order-button" type="submit">
                Заказать
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
