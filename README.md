# Pokémon Memory Game 🃏🔥  

A Pokémon-themed memory game, developed using **PokeAPI** to fetch Pokémon data and **Firebase** for authentication and data storage.  

![image (19)](https://github.com/user-attachments/assets/a49bb147-ba9e-43c0-a64b-d04cd3a88f20)

## 🚀 Features  

- Dynamically fetch Pokémon using **PokeAPI**.  
- Store user scores and data with **Firebase**.  
- Attractive Pokémon-themed design (featuring Gengar, Haunter, and Gastly 👻).  
- Visual effects and animations to enhance the gaming experience.  

## 🛠️ Technologies Used  

- **HTML, CSS, and JavaScript**  
- **PokeAPI** (https://pokeapi.co/)  
- **Firebase** (Authentication and Firestore)  

## 📦 Installation  

Follow these steps to run the project in your local environment:  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/your-username/your-repository.git
cd your-repository
```  

### 2️⃣ Install dependencies (if using Node.js)  
```sh
npm install
```  

### 3️⃣ Configure Firebase  
1. Create a project in [Firebase](https://firebase.google.com/).  
2. Go to **Project settings > Web app configuration** and copy the setup details.  
3. Add the Firebase configuration in `firebase.js`:  

```js
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

### 4️⃣ Start the local server  
If you're using a Node.js environment and a development server, start the project with:  
```sh
npm start
```  

### 5️⃣ Open the game in your browser  
Once started, open your browser and go to:  
```
http://localhost:3000
```  
(Adjust the port if necessary).  
