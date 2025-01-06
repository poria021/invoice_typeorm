Services Overview

1. Invoice Service
   Technologies Used: MongoDB, RabbitMQ
   Runs on default ports.
2. Email Sender Service
   Technologies Used: MongoDB, RabbitMQ, Redis
   Runs on default ports.
   Local Setup
   MongoDB: mongodb://localhost:27017/invoices
   Redis: redis://localhost:6379

after that just run :
npm install
npm run start:dev

Additional Notes
Each service includes a .env file for configuration.
A Postman collection is provided for testing the APIs.
# invoice_typeorm
