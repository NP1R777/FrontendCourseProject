import React from 'react';
import '../styles/App.css';
import Footer from '../components/Footer.jsx'
import { useNavigate } from 'react-router-dom';

const Main = ({ data }) => {
  const navigate = useNavigate();

  const handleGoToProduct = (pk) => {
    navigate(`/products/${pk}/`);
  };

  return (
    <div>
      <main>
        {data.map((elem) => (
          <div key={elem.pk} className="product-card">
            <div className="product-image">
              <img
                src={elem.pictures_url}
                alt={`Изображение продукта: ${elem.name}`}
              />
            </div>
            <div className="product-details">
              <h2 className="product-title">{elem.name}</h2>
              <p className="product-description">{elem.description}</p>
              <div className="product-price">{elem.price} руб.</div>
              <button
                className="add-to-cart"
                onClick={() => handleGoToProduct(elem.pk)}
              >
                Перейти
              </button>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Main;
