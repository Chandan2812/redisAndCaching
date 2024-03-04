# Stock Management System

This is a stock management system backend application built with Node.js, Express.js, MongoDB, and Redis. It provides APIs for managing companies, orders, and retrieving statistics about orders for a particular company.

## Project Type

 **Backend**

## Deployed App

- Backend - 

## Installation

```bash
# Clone the repository
git clone <repository_url>

# Navigate to project directory
cd <project_directory>

# Install dependencies
npm install

# Create .env file
PORT=8000
MONGODB_URI=<your_mongodb_uri>
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_DB_INDEX=your_redis_database_index


#Start the server
npm run server
```

## Technologies Used

![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![Mongoose](https://img.shields.io/badge/-Mongoose-880000?logoColor=white&style=for-the-badge)
![Winston](https://img.shields.io/badge/-Winston-002F6C?style=for-the-badge)
![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white&style=for-the-badge)


## Endpoints

### Companies API
- **Create Company**: `POST /company`
- **Get All Company**: `GET /company`
- **Get a specific company by symbol**: `GET /company/:symbol`
- **Update Company**: `PUT /company/:id`
- **Delete Company**: `DELETE /company/:id`

### Orders API
- **Create Order**: `POST /order`
- **Get all orders**: `GET /order`
- **Get orders for a specific company**: `GET /order/company/:symbol`
- **Delete Order**: `DELETE /order/:id`

### Stats API
- **Day Stats**: `GET /stats/company/:symbol/day-stats`
- **Month Stats**: `GET /stats/company/:symbol/month-stats`

