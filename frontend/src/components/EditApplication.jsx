import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditApplication.css';

const EditApplication = () => {
  const navigate = useNavigate();
  const [/*order*/, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    is_active: false,
    is_progress: false,
    is_reject: false,
    is_close: false,
    is_draft: false
  });

  // Загрузка данных заявки
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const pk_application = localStorage.getItem("pk_application");
        const response = await axios.get(`http://localhost:8002/application/${pk_application}/`);
        const orderData = response.data;
        setOrder(orderData);
        setFormData({
          status: orderData.status
        });
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке заявки:', error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  // Обработчик изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменений
  const handleSave = async () => {
    try {
      const pk_application = localStorage.getItem("pk_application");
      await axios.put(`http://localhost:8002/application/${pk_application}/`, {
        ...formData
      });
      alert('Изменения сохранены!');
      navigate('/basket/');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении изменений');
    }
  };

  // Удаление заявки
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        const pk_application = localStorage.getItem("pk_application");
        await axios.delete(`http://localhost:8002/application/${pk_application}/`);
        alert('Заявка удалена!');
        navigate('/basket/');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении заявки');
      }
    }
  };

  if (loading) {
    return <div className="edit-loading">Загрузка данных заявки...</div>;
  }

  return (
    <div className="edit-order-container1">
      <div className="edit-order-card1">
        <h2>Редактирование заявки #{localStorage.getItem("pk_application")}</h2>
        <div className="form-section1">
          <div className="form-group1">
            <label>Статус заявки</label>
            <select 
              name="status" 
              value={formData.status}
              onChange={handleChange}
              className="form-select1"
            >
              <option value="is_active">Активна</option>
              <option value="is_progress">В процессе</option>
              <option value="is_reject">Отклонена</option>
              <option value="is_close">Закрыта</option>
              <option value="without_status">Неизвестно</option>
            </select>
          </div>
        </div>
        <div className="action-buttons1">
          <button 
            className="save-button1"
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
          <button 
            className="delete-button1"
            onClick={handleDelete}
          >
            Удалить заявку
          </button>
          <button 
            className="cancel-button1"
            onClick={() => navigate('/basket/')}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditApplication;