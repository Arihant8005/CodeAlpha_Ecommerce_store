# 🛒 CodeAlpha E-Commerce Store

A full-stack e-commerce web application built as part of the **CodeAlpha Full Stack Development Internship**.

The application provides a complete shopping experience including product browsing, authentication, shopping cart, checkout, order management, and an admin dashboard for managing products and orders.

---

## 🚀 Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Browse available products
- View product details
- Add products to shopping cart
- Increase/decrease product quantity
- Remove products from cart
- View cart total
- Place orders
- View personal order history
- Track order status

### 🔐 Admin Features

- Admin authentication and authorization
- View all customer orders
- Update order status
- Add new products
- Edit existing products
- Delete products
- Upload product images
- Manage product information

### 🖼️ Image Management

- Product images uploaded using **Cloudinary**
- Image preview before saving
- Maximum upload size validation

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- Multer

### Database

- MongoDB
- Mongoose

### Cloud Services

- MongoDB Atlas
- Cloudinary

---

## 📁 Project Structure

```text
CodeAlpha_Ecommerce_store/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md