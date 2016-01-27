# Online store API design and implementation


# Installation

1. git clone git@github.com:satish-zol/online-store.git
2. cd online-store && npm install
3. npm start

# Test
1. mocha src/test

# USER REGISTRATION API call
once the server is up on port 3000
Open the postman utility and 
hit the url 
#POST Sign up
/api/v1/users/sign_up.json 
#with data in body
#example
{
  “username”: “abc”,
  “email”: “abc@yopmail.com”,
  “password”: “123456”,
  “password_confirmation”: “123456”
}
#POST Sign in
/api/v1/users/sign_in.json
#with data in body
#example
{
  “email”: “abc@yopmail.com”,
  “password”: “123456”
}

#GET User
/api/v1/user/:id

#POST Product
#Note: you need to pass x-access-token in request header for every api call on product
#body
{
  “name”: “Product1”,
  “description”: “This is a test product”,
  “price”: 10.00
}

#Paginated list of products
#GET
/api/v1/products?page=1&limit=10

#Show product 
#GET
/api/v1/product/:id

#Update product
#PUT
/api/v1/product/:id
#body
{
  “name”: “Product1”,
  “description”: “This is a test product with updated price”,
  “price”: 20.00
}

#Delete Product
#DELETE
/api/v1/product/:id

#Search product
#GET
/api/v1/products/search?q=product1


