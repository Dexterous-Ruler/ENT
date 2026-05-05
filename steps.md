# Setup & Getting Started Guide

Follow these steps to run the Sarvam DeployBridge platform and connect your real WhatsApp account using Unipile.

## 1. Start the Frontend Application

The frontend is built with React and Vite. It connects to the live Supabase Edge Function to fetch dashboard metrics and conversation history.

1. Open a terminal in the project root directory (`/Users/rudra/ent`).
2. Run the development server:
   ```bash
   npm install
   npm run dev
   ```
3. Open the local URL provided in the terminal (usually `http://localhost:5173`) in your browser to view the beautiful Sarvam-styled dashboard.

## 2. Connect Your WhatsApp Account to Unipile

Currently, the Edge Function has your API keys, but Unipile doesn't have a WhatsApp account linked to send/receive messages from. You must link your phone:

1. Go to the **[Unipile Dashboard](https://dashboard.unipile.com/)**.
2. **Log in** using your credentials:
   - **Email:** `tanishqaryan1095@gmail.com`
   - **Password:** `Tanishq@09`
3. On the left sidebar, navigate to **Accounts** (or Connections) and click **+ Add Account**.
4. Select **WhatsApp** from the list of providers.
5. A QR code will appear on your screen.
6. Open **WhatsApp** on your mobile phone:
   - Go to **Settings** > **Linked Devices**.
   - Tap **Link a Device**.
   - Scan the QR code on your computer screen.
7. Your WhatsApp account is now connected to Unipile!

## 3. Configure the Unipile Webhook

To make the AI reply automatically, Unipile needs to know where to send incoming WhatsApp messages. We need to point Unipile to your Supabase Edge Function.

1. Still in the Unipile Dashboard, navigate to **Developers** > **Webhooks**.
2. Click **Add Webhook** or **Create Webhook**.
3. **Webhook URL:** Paste the following exactly as written:
   ```text
   https://fjfobafukxuhhyeoqzlt.supabase.co/functions/v1/api?type=webhook
   ```
4. **Events:** Check the box for **New messages** (or `message_received`). 
5. Save the webhook.

## 4. Test the Integration

Everything is now fully wired up! 
1. Have a friend (or use a secondary phone number) send a WhatsApp message to the phone number you just linked.
2. Unipile will immediately catch the message and forward it to your Supabase Edge Function.
3. The Edge Function will send the text to OpenAI, wait for the AI's response, and tell Unipile to send the response back to your friend.
4. Your friend should receive an automated, polite AI response in their WhatsApp chat!
