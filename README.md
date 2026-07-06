# 🛡️ AuraFind: AI Cognitive Lost & Found Recovery Network

AuraFind is a production-ready, AI-powered Lost & Found Recovery Platform that automates object re-identification and user notifications. By combining structural computer vision with natural language matching, the platform automatically connects lost item listings with found reports.

---

## 🌟 Key Features

*   **🧠 AI Match Engine**: Utilizes image preprocessing (sharp auto-trim) combined with discrete cosine transform (DCT) perceptual hashing (pHash) and semantic TF-IDF text similarity algorithms to verify matches.
*   **📱 Real-Time SMS Notifications**: Integrated with Twilio API to automatically text geofenced coordinates to the owner’s registered number when a match crosses the 75% similarity threshold.
*   **📍 Interactive Radar Map**: Dynamic Leaflet maps detailing coordinate locations of reports, complete with geofenced recovery hotspots.
*   **💬 Anonymous WebSocket Chat**: Secure communication channel enabling finders and owners to coordinate recoveries without revealing personal contact details.
*   **🪪 QR Tag Verification**: Generate printable cryptographic sticker codes to stick to valuables, enabling instant scanning and owner messaging.
*   **📈 Enterprise Analytics Dashboard**: Comprehensive metrics covering reports, active matches, category distribution, and recovery rates.

---

## 🏛️ Project Architecture

```
AuraFind/
├── backend/            # Express REST & WebSocket Server
│   ├── services/       # Twilio SMS notification service
│   ├── uploads/        # Multer image storage directory
│   ├── server.js       # Main server entrypoint
│   └── compare.js      # Perceptual Image hashing engine
├── frontend/           # React + Vite Web Portal
│   ├── src/
│   │   ├── pages/      # Routed views (Wizard steps, Map, Analytics, QR)
│   │   └── App.tsx     # Main application layout & global AI assistant
└── mobile/             # React Native Expo Client
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   npm (v9+)

### 1. Backend Server Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment in `.env`:
    ```env
    TWILIO_ACCOUNT_SID=your_actual_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_actual_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_assigned_twilio_phone_number
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    *The backend runs on `http://localhost:5000`.*

### 2. Frontend Portal Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The web portal runs on `http://localhost:5173`.*

### 3. Mobile Client Setup
1.  Navigate to the mobile directory:
    ```bash
    cd ../mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start Metro Bundler:
    ```bash
    npm start
    ```

---

## 📄 License
This project is licensed under the MIT License.
