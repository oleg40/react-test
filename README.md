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

You need two Telegram accounts: a sender linked to GREEN-API and a recipient who replies.

1. Register at [console.green-api.com](https://console.green-api.com) and choose **Create Telegram**
   (not "Create an instance", which is WhatsApp). The free Developer plan is enough.
2. Authorize the instance with the sender's phone number (login code, 2FA password if set)
   and wait for status **Authorized**.
3. In the instance settings, set **Receive webhooks on incoming messages and files** to **Yes**
   and keep **Webhook Url** empty. Without this, replies never reach the app. Settings apply in about a minute.
4. Open the app and enter `idInstance` and `apiTokenInstance` from the console.
5. Enter the recipient's phone number in international format and create the chat.
6. Send a message; replies from Telegram appear in the chat within a few seconds.

Messages are sent via `SendMessage` and received by polling `ReceiveNotification` / `DeleteNotification`.

## Notes

- Messages are sent from the Telegram account linked to the instance.
- `apiTokenInstance` gives full access to that account and is stored in the browser's localStorage.
- The app drains the instance notification queue; notifications from other chats are discarded.
