# QR Code Generator & Verification System - Implementation TODO

## Backend Setup
- [ ] Create backend/package.json with all deps
- [ ] Create backend/server.js (Express app, middleware, routes)
- [ ] Create backend/config/database.js (Mongoose connect)
- [ ] Create backend/models/QR.js (schema)
- [ ] Create backend/controllers/qrController.js (generate, verify logic)
- [ ] Create backend/routes/qr.js (routes)
- [ ] Create backend/middleware/rateLimit.js, multer.js, errorHandler.js
- [ ] Create backend/utils/qrHelpers.js (HMAC, decode)
- [ ] Create backend/.env.example
- [ ] cd backend && npm install
- [ ] Test backend: npm run dev (port 5000)

## Frontend Integration
- [x] Create frontend/src/api/qrApi.js (axios service)
- [x] Update frontend/src/pages/Generate.jsx (integrate generateQR)
- [x] Update frontend/src/pages/Verify.jsx (integrate verifyQR)
- [x] Update frontend/src/components/VerifyResult.jsx (new fields display)
- [ ] cd frontend && npm i axios
- [ ] Test integration

## Final
- [ ] MongoDB running (local: mongodb://localhost:27017/qrdb)
- [ ] Full test: generate → download image → verify
- [ ] attempt_completion

