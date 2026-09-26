# **Anon**
**_..get a response yesterday!_**

<span style="display: flex; justify-content: center; width: 100%"><img src="" alt="Main img"></span>

## About Anon

**Anon** is a self-hosted, multi-feature WhatsApp bot developed by [**Cyan+**](https://cyan.halostudios.xyz). It's written in **JavaScript** and runs on **Node.js** using the **@whiskeysockets/baileys** node library.

---
<span style="display: flex; justify-content: center"><img src="" alt="screenshot 1"></span>
---
The bot hosts a number of features ranging from _games_ and _AI tools_, to _group management_ and _media processing tools_, that maximize convenience and efficiency on WhatsApp.

---
<span style="display: flex; justify-content: center"><img src="" alt="screenshot 2"></span>
---

It was developed with **security**, **stability** and **efficiency**, as well as _response_ and _processing_ **speed** as priorities. Hence the name **_anon_** (_def_. straight away).

---
<span style="display: flex; justify-content: center"><img src="" alt="screenshot 3"></span>
---

So just kick back and let _**anon**_ handle it for you.


## Getting started

### 1. Requirements
- **Node.js** v20 or higher
- npm
- A WhatsApp account
- A VPS of your choice (e.g., Replit, Heroku, Railway, Render, Katabump).

### 2. Installation
Clone the directory in your terminal
```bash
git clone https://github.com/amanumar32/anon.git
cd anon
```
Install the dependencies
```bash
npm install
```
If a [**configs.json**](configs.json) file doesn't already exist, you can create one with this:
```json
{
    "name": "YOUR_NAME",
    "number": "YOUR_WHATSAPP_NUMBER"
}
```
> Make sure you replace `YOUR_NAME` and `YOUR_WHATSAPP_NUMBER` with your actual name and WhatsApp phone number (with the country code).

> Creating [**configs.json**](configs.json) is optional because the bot will handle it automatically. You can create it if you're unable to scan a QR code and prefer using a pairing code.
---

### 3. Starting the bot
You can start the bot normally with:
```bash
npm run start
```

#### **_..or, if you prefer using a package manager_**
Install pm2
```bash
npm install pm2 -g
```
start the bot with:
```bash
# pm2 start logic
```
> A package manager is a tool that helps manage and maintain your project. It handles auto-restarts when ever your bot stops or crashes, so you can keep it running with minimal maintenance.
---
### 4. Connecting