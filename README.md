<div style="position: relative; width: 100%;">
<img src="https://i.imghippo.com/files/Nnwl8073AuI.jpg" alt="Main img" style="width: 100%; display: block; opacity: 0.6;">
<div style="position: absolute; bottom: 1em; left: 1em; color: #ffffff;">
<h1 style="font-size: 3rem; font-family: monospace; font-weight: 700; margin: 0;">Anon</h1>
</div>
</div>


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
- A VPS of your choice (e.g., Replit, Heroku, Railway, Render, KataBump).

---
### 2. Installation
Clone the directory in your terminal
```bash
git clone https://github.com/amanumar32/anon.git anon
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
pm2 start npm --name "anon" --run start
pm2 logs anon
```
> A package manager is a tool that helps manage and maintain your project. It handles auto-restarts when ever your bot stops or crashes, so you can keep it running with minimal maintenance.
---
### 4. Connecting
To connect the bot to your WhatsApp account, you can scan the QR code generated when you start the server

---
<span style="display: flex; justify-content: center"><img src="" alt="Terminal scanning"></span>
---
or connect using the pairing code generated

---
<span style="display: flex; justify-content: center"><img src="" alt="pairing code"></span>
---
> You must have specified your WhatsApp number _(with the country code)_ in [**configs.json**](configs.json), or inputted it when prompted in the terminal, to use the pairing code method.
---

### 5. Your first command
Once `Bot connected successfully!` is printed in the terminal, you can start using the bot. Check the stats with:
```command
stats
```
Get a list of all available commands with:
```command
.menu
```
Need help with a command? See how to use it with `.help <command>`. E.g.,
```command
.help menu
```
Anon is a periodically maintained repository, so you can expect updates frequently. Fortunately, you don't need to download the zip file and extract it every time, or even update manually from your terminal. The bot handles this automatically.

Whenever you notice an update available in `stats`, update the bot with:
```command
.update
```
> Depending on the VPS you're using, you may need to start up the bot manually from your server after a restart.
---

You can explore through commands in the menu and figure out how they work yourself, or check our command documentation on [**Cyan+**](https://cyan.halostudios.xyz/commands)

**_Thank you for choosing Anon!_**

---
<br/>
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; text-align: center;">
<strong style="font-size: 30px; color: #5A55FA; font-family: monospace; font-weight: 700">Anon</strong>
<span>Powered by <a href="https://cyan.halostudios.xyz">Cyan+</a> — A world of automation.</span>
<span>Copyright 2026</span>
</div>