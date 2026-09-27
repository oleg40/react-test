# GREEN-API Telegram Chat

Minimal Telegram Web-style chat for sending and receiving text messages via
[GREEN-API for Telegram](https://green-api.com/telegram).

## Setup

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm test`.

## Usage

1. Create and authorize a Telegram instance in the GREEN-API console.
2. Open the app and enter `apiUrl`, `idInstance` and `apiTokenInstance` from the GREEN-API console.
3. Enter the recipient phone number in international format and create the chat.
4. Send a message; replies from Telegram appear in the chat.

Messages are sent via `SendMessage` and received by polling `ReceiveNotification` / `DeleteNotification`.

## Notes

- Messages are sent from the Telegram account linked to the instance.
- `apiTokenInstance` gives full access to that account and is stored in the browser's localStorage.
- The app drains the instance notification queue; notifications from other chats are discarded.
