# ArriveLocal Hyperlocal Inventory System - API Contract

## Base Configuration
- **Base URL**: `https://api.arrivelocal.com/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT) in Authorization header or httpcookie only
- **CORS**: Allowed origins for local dev and production domains

---

## Authentication APIs

### POST /auth/register
**Description**: Register a new user
```json
{
  "name": "string (required, 2-50 chars)",
  "email": "string (required, valid email)",
  "mobile": "string (required, 10 digits)",
  "password": "string (required, min 8 chars)",
  "referral_code": "string (optional)"
}
```
**Response (201)**:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "mobile": "string",
    "role": "user"
  },
  "accessToken": "string",
  "refreshToken": "string"
}
```

### POST /auth/login
**Description**: User login
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Response (200)**:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "mobile": "string",
    "role": "string"
  },
  "accessToken": "string",
  "refreshToken": "string"
}
```

### POST /auth/refresh
**Description**: Refresh access token
```json
{
  "refreshToken": "string (required)"
}
```

### POST /auth/logout
**Description**: Logout user
**Response (200)**: `{ "message": "Logged out successfully" }`

### GET /auth/me
**Description**: Get current user profile
**Response (200)**:
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "role": "string",
  "addresses": [
    {
      "id": "string",
      "address_line": "string",
      "lat_lng": "string",
      "type": "string"
    }
  ]
}
```

---

## User Management APIs

### PUT /users/profile
**Description**: Update user profile
```json
{
  "name": "string (optional)",
  "mobile": "string (optional)"
}
```

### POST /users/addresses
**Description**: Add new address
```json
{
  "address_line": "string (required)",
  "lat_lng": "string (required, format: 'lat,lng')",
  "type": "string (required: home|work|other)"
}
```

### PUT /users/addresses/{addressId}
**Description**: Update address
```json
{
  "address_line": "string (optional)",
  "lat_lng": "string (optional)",
  "type": "string (optional)"
}
```

### DELETE /users/addresses/{addressId}
**Description**: Delete address

---

## Location & City APIs

### GET /cities
**Description**: Get all cities
**Query Params**: 
- `zone` (optional): Filter by zone
- `district` (optional): Filter by district

**Response (200)**:
```json
{
  "cities": [
    {
      "id": "string",
      "name": "string",
      "pincode": "string",
      "zone": "string",
      "district": "string"
    }
  ]
}
```

### GET /cities/{cityId}
**Description**: Get city details

### GET /cities/{cityId}/sellers
**Description**: Get sellers in a city
**Query Params**:
- `category` (optional): Filter by product category
- `active` (optional): Filter by active status

---

## Seller APIs

### GET /sellers
**Description**: Get all sellers
**Query Params**:
- `city_id` (optional): Filter by city
- `category` (optional): Filter by product category
- `active` (optional): Filter by active status
- `lat_lng` (optional): "lat,lng" for distance sorting

**Response (200)**:
```json
{
  "sellers": [
    {
      "id": "string",
      "name": "string",
      "business_name": "string",
      "contact_info": "string",
      "geo_location": "string",
      "operating_hours": "string",
      "is_active": "boolean",
      "city": {
        "id": "string",
        "name": "string"
      },
      "rating": "number",
      "delivery_zones": [
        {
          "id": "string",
          "radius": "number"
        }
      ]
    }
  ]
}
```

### GET /sellers/{sellerId}
**Description**: Get seller details

### GET /sellers/{sellerId}/products
**Description**: Get products by seller
**Query Params**:
- `category` (optional): Filter by category
- `tags` (optional): Filter by tags (comma-separated)
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price
- `in_stock` (optional): Filter by stock availability

---

## Product APIs

### GET /products
**Description**: Get all products
**Query Params**:
- `seller_id` (optional): Filter by seller
- `category` (optional): Filter by category
- `tags` (optional): Filter by tags
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price
- `search` (optional): Search in name/description
- `lat_lng` (optional): "lat,lng" for nearby sellers
- `radius` (optional): Search radius in km (default: 10)

**Response (200)**:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "sku": "string",
      "unit": "string",
      "category": "string",
      "tags": [
        {
          "id": "string",
          "name": "string"
        }
      ],
      "seller": {
        "id": "string",
        "name": "string",
        "business_name": "string"
      },
      "stock": "number",
      "warehouses": [
        {
          "id": "string",
          "location": "string",
          "stock": "number"
        }
      ]
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "total_pages": "number"
  }
}
```

### GET /products/{productId}
**Description**: Get product details

### GET /products/categories
**Description**: Get all product categories

### GET /products/tags
**Description**: Get all product tags

---

## Cart APIs

### GET /cart
**Description**: Get user's cart
**Response (200)**:
```json
{
  "id": "string",
  "items": [
    {
      "id": "string",
      "product": {
        "id": "string",
        "name": "string",
        "price": "number",
        "unit": "string"
      },
      "seller": {
        "id": "string",
        "name": "string"
      },
      "quantity": "number",
      "added_at": "date"
    }
  ],
  "total_items": "number",
  "total_amount": "number"
}
```

### POST /cart/items
**Description**: Add item to cart
```json
{
  "product_id": "string (required)",
  "seller_id": "string (required)",
  "quantity": "number (required, min: 1)"
}
```

### PUT /cart/items/{itemId}
**Description**: Update cart item quantity
```json
{
  "quantity": "number (required, min: 1)"
}
```

### DELETE /cart/items/{itemId}
**Description**: Remove item from cart

### DELETE /cart
**Description**: Clear entire cart

---

## Order APIs

### POST /orders
**Description**: Create new order
```json
{
  "seller_id": "string (required)",
  "delivery_address_id": "string (required)",
  "payment_method": "string (required: cod|online|wallet)",
  "items": [
    {
      "product_id": "string (required)",
      "quantity": "number (required)"
    }
  ],
  "delivery_notes": "string (optional)"
}
```
**Response (201)**:
```json
{
  "order": {
    "id": "string",
    "status": "pending",
    "total_amount": "number",
    "delivery_charge": "number",
    "discount": "number",
    "tax": "number",
    "created_at": "date"
  },
  "payment": {
    "id": "string",
    "status": "string"
  }
}
```

### GET /orders
**Description**: Get user's orders
**Query Params**:
- `status` (optional): Filter by status
- `seller_id` (optional): Filter by seller
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200)**:
```json
{
  "orders": [
    {
      "id": "string",
      "status": "string",
      "total_amount": "number",
      "created_at": "date",
      "seller": {
        "id": "string",
        "name": "string"
      },
      "delivery": {
        "status": "string",
        "eta": "date"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

### GET /orders/{orderId}
**Description**: Get order details
**Response (200)**:
```json
{
  "id": "string",
  "status": "string",
  "total_amount": "number",
  "delivery_charge": "number",
  "discount": "number",
  "tax": "number",
  "created_at": "date",
  "seller": {
    "id": "string",
    "name": "string",
    "contact_info": "string"
  },
  "delivery_address": {
    "address_line": "string",
    "lat_lng": "string"
  },
  "products": [
    {
      "product": {
        "id": "string",
        "name": "string",
        "price": "number"
      },
      "quantity": "number",
      "price_at_order_time": "number"
    }
  ],
  "payment": {
    "id": "string",
    "method": "string",
    "status": "string"
  },
  "delivery": {
    "id": "string",
    "status": "string",
    "eta": "date",
    "agent": {
      "id": "string",
      "name": "string",
      "contact": "string"
    }
  }
}
```

### POST /orders/{orderId}/cancel
**Description**: Cancel order
**Response (200)**: `{ "message": "Order cancelled successfully" }`

### POST /orders/{orderId}/feedback
**Description**: Submit order feedback
```json
{
  "rating": "number (required, 1-5)",
  "feedback": "string (required, max 500 chars)"
}
```

---

## Payment APIs

### POST /payments/{paymentId}/process
**Description**: Process payment
```json
{
  "payment_method": "string (required)",
  "gateway_data": "object (optional)"
}
```

### GET /payments/{paymentId}
**Description**: Get payment status

---

## Delivery APIs

### GET /deliveries/{deliveryId}/track
**Description**: Track delivery
**Response (200)**:
```json
{
  "id": "string",
  "status": "string",
  "eta": "date",
  "current_location": "string",
  "agent": {
    "id": "string",
    "name": "string",
    "contact": "string"
  },
  "route": {
    "waypoints": ["string"],
    "distance": "number",
    "estimated_duration": "string"
  }
}
```

---

## Admin APIs (Role-based access)

### GET /admin/users
**Description**: Get all users (admin only)
**Query Params**:
- `role` (optional): Filter by role
- `page` (optional): Page number
- `limit` (optional): Items per page

### GET /admin/sellers
**Description**: Get all sellers (admin only)

### POST /admin/sellers
**Description**: Create seller (admin only)
```json
{
  "name": "string (required)",
  "business_name": "string (required)",
  "contact_info": "string (required)",
  "geo_location": "string (required)",
  "operating_hours": "string (required)",
  "city_id": "string (required)"
}
```

### PUT /admin/sellers/{sellerId}
**Description**: Update seller (admin only)

### GET /admin/orders
**Description**: Get all orders (admin only)

### GET /admin/delivery-agents
**Description**: Get all delivery agents (admin only)

---

## Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

## Common Error Codes
- `INVALID_CREDENTIALS`: Wrong email/password
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `RESOURCE_NOT_FOUND`: Entity not found
- `INSUFFICIENT_STOCK`: Product out of stock
- `DELIVERY_ZONE_NOT_COVERED`: Address not in delivery zone
- `PAYMENT_FAILED`: Payment processing failed

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

---

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "referral_code": "string",
  "role": "string",
  "addresses": [
    {
      "id": "string",
      "address_line": "string",
      "lat_lng": "string",
      "type": "string"
    }
  ]
}
```

### Seller
```json
{
  "id": "string",
  "name": "string",
  "business_name": "string",
  "contact_info": "string",
  "geo_location": "string",
  "operating_hours": "string",
  "is_active": "boolean",
  "city": {
    "id": "string",
    "name": "string",
    "pincode": "string"
  },
  "delivery_zones": [
    {
      "id": "string",
      "lat": "number",
      "lng": "number",
      "radius": "number"
    }
  ]
}
```

### Product
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "sku": "string",
  "unit": "string",
  "category": "string",
  "tags": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "seller": {
    "id": "string",
    "name": "string",
    "business_name": "string"
  },
  "stock": "number"
}
```

### Order
```json
{
  "id": "string",
  "status": "string",
  "total_amount": "number",
  "delivery_charge": "number",
  "discount": "number",
  "tax": "number",
  "created_at": "date",
  "user_id": "string",
  "seller_id": "string",
  "products": [
    {
      "product_id": "string",
      "quantity": "number",
      "price_at_order_time": "number"
    }
  ]
}
```

### Delivery
```json
{
  "id": "string",
  "order_id": "string",
  "agent_id": "string",
  "status": "string",
  "eta": "date",
  "actual_time": "date",
  "delay_reason": "string",
  "delivery_notes": "string"
}
```

---

## Implementation Notes

### Authentication Flow
1. User registers/logs in → receives access + refresh tokens
2. Access token used for API calls (expires in 15 minutes)
3. Refresh token used to get new access token (expires in 7 days)
4. Logout invalidates both tokens

### Hyperlocal Features
- Products filtered by seller's delivery zones
- Distance-based sorting for nearby sellers
- Real-time stock updates from warehouses
- Location-based delivery time estimates

### Security Considerations
- JWT tokens stored in httpOnly cookies (preferred) or secure localStorage
- CORS configured for specific domains
- Rate limiting on auth endpoints
- Input validation on all endpoints
- Role-based access control for admin APIs

### Performance Optimizations
- Pagination on list endpoints
- Indexed queries for location-based searches
- Caching for static data (cities, categories, tags)
- Efficient stock aggregation queries 