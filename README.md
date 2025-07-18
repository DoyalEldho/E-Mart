#E-mart
E-Mart is a full-featured e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). Users can browse products, add to cart, wishlist,place orders,
and manage their shopping experience seamlessly.

 Features

    1. User Authentication using jwt and google sign in (Register, Login)
    2. Product Listing with Pagination
    3. Add to Cart / Remove from Cart
    4. Add to WishList,Move to cart from wishlist and removce from wishlst
    5. Place Order with Address & Payment Options
    6. Order Confirmation Modal
    7.Admin: Add / Manage Products 
    8.update status of product -shipped or delivered
    8.State Management with Redux

    # Loading Spinners and Toast Notifications

 #Getting Started
 1. Clone the repo
 **git clone https://github.com/yourusername/e-mart.git**
  **cd e-mart**

2. Setup Backend
**cd ecommerce-backend**
**npm install**
**Create a .env file in ecommerce-backend:**

PORT=5000,
MONGODB_URI=your_mongodb_uri,
JWT_SECRET=your_jwt_secret,
CLOUDINARY_NAME=your_cloud_name,
CLOUDINARY_API_KEY=your_key,
CLOUDINARY_API_SECRET=your_secret,

3. Setup Frontend
   **cd ecommerce-frontend**
   **npm install**

 **Create a .env file in ecommerce-frontend:**
VITE_GOOGLE_CLIENT_ID=your_google_client_id

5.To start the project 
  **npm run dev**
