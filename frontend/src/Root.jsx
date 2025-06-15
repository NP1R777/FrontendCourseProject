import App from './App';
import React from 'react';
import Login from './pages/Login.jsx';
import Basket from './pages/Basket.jsx';
import ProductPage from './pages/ProductPage';
import EditUsers from './pages/EditUsers.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Registration from './pages/Registration.jsx';
import AddProduct from './components/AddProduct.jsx';
import EditProduct from './components/EditProduct.jsx';
import ErrorBasket from './components/ErrorBasket.jsx';
import DeleteUsers from './components/DeleteUsers.jsx';
import EditProductList from './components/EditProductList.jsx';
import EditApplication from './components/EditApplication.jsx';
import DeleteProductsPage from './pages/DeleteProductsPage.jsx';
import SuperuserManagement from './pages/SuperuserManagment.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Root() {
  const [userName, setUserName] = React.useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App userName={userName} />} />
        <Route path="/products/:pk/" element={<ProductPage />} />
        <Route path='/register/' element={<Registration />} />
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/basket/" element={<Basket />} />
        <Route path="/edit-application/:pk/" element={<EditApplication />}/>
        <Route path='/admin-panel/' element={<AdminPanel />}/>
        <Route path='/error/' element={<ErrorBasket />}/>
        <Route path='/delete-products' element={<DeleteProductsPage />}/>
        <Route path='/add-product/' element={<AddProduct />}/>
        <Route path='/edit-product-list/' element={<EditProductList />}/>
        <Route path='/edit-product/:pk/' element={<EditProduct />}/>
        <Route path='/delete-users/' element={<DeleteUsers />}/>
        <Route path='/create-superuser' element={<SuperuserManagement />}/>
        <Route path='/edit-users/' element={<EditUsers />}/>
        <Route path='/profile/' element={<ProfilePage />}/>
      </Routes>
    </Router>
  );
}

export default Root;