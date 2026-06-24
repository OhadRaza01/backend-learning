# Backend Learning Journey 

A collection of backend concepts and mini-projects built while learning Node.js and Express.js.

## What I'm Learning

- Node.js & Express.js — server setup, routing, middleware
- File uploads — Multer, express-fileupload, Cloudinary
- Authentication — JWT, bcrypt, access/refresh tokens
- Database — MongoDB, Mongoose, schema design
- REST API design — controllers, routes, error handling

## Projects / Experiments

### File Upload Mini Project
- File upload using Multer and express-fileupload
- Cloudinary integration for cloud storage
- Server-side cleanup with fs.unlinkSync

### User Authentication Model
- Mongoose User schema with password hashing (bcrypt)
- JWT access token and refresh token generation
- Pre-save middleware for automatic password encryption

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Multer / express-fileupload
- Cloudinary

## Status

🟡 Actively learning — updated regularly

## Latest Progress

### User Registration API ✅
- Complete REST API endpoint — `POST /register`
- Request validation — empty fields, duplicate email/username
- File upload handling — avatar (required) + cover image (optional)
- Cloudinary integration — cloud storage for images
- Password hashing via bcrypt (pre-save middleware)
- Sensitive fields hidden in response — password, refreshToken
- Proper HTTP status codes — 201, 400, 409, 500
- Custom error handling — ApiError, asyncHandler wrapper

### Concepts Covered
- Mongoose pre-save middleware
- bcrypt — password hashing and comparison
- Multer — file upload handling
- Cloudinary — cloud file storage + cleanup
- MongoDB operators — `$or`, `$and`
- REST API design patterns
- async/await error handling