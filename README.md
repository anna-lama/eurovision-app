# 🌐 Ionic + Vue + Vite Web App

Un'applicazione web con [Ionic Framework](https://ionicframework.com/), [Vue 3](https://vuejs.org/) e [Vite](https://vitejs.dev/). 
Pensata per dispositivi mobili.

## 🧰 Stack Tecnologico

- ⚙️ **Ionic Framework** 
- 🔧 **Vue 3** 
- ⚡ **Vite** 

## 🚀 Avvio rapido

### 1. Clona il repository

```bash
git clone https://github.com/anna-lama/eurovision-app.git
cd eurovision-app
```

### 2. Installa le dipendenze

```bash
npm install

```

### 3. Avvia il server di sviluppo

```bash
npm run dev

```

L'app sarà disponibile su `http://localhost:5173` (di default).


## 🔌 Plugin e Librerie

- **@ionic/vue** – Supporto Vue per Ionic
- **vue-router** – Routing ufficiale Vue
- **pinia** – Gestione stato moderna per Vue
- **axios** – HTTP client

## 📱 Build mobile (opzionale)

Per generare app native:

```bash
npm install -g @ionic/cli
ionic capacitor add android
ionic capacitor run android
```

Richiede Android Studio o Xcode.
