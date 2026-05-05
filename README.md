# Sarvam DeployBridge 🚀

**DeployBridge** is a premium, AI-powered platform designed for Indian local businesses. It combines a sophisticated, multi-lingual WhatsApp AI assistant with a beautiful, "Sarvam-inspired" soothing dashboard to manage customer conversations, view analytics, and automate support in real time.

---

## 🌟 Key Features

- **Automated AI WhatsApp Assistant:** Responds to customers intelligently in multiple Indian languages (Hindi, Tamil, English, etc.) using OpenAI's `gpt-3.5-turbo`.
- **Real-Time Integration:** Built securely on top of the **Unipile Messaging API** and powered by **Supabase Edge Functions**.
- **Premium Analytics Dashboard:** A React-based SPA with a high-end, soothing pastel aesthetic that visualizes conversational metrics, active leads, and intent breakdowns.
- **Infinite Loop Protection:** Smart webhook parsing to ensure the AI only replies to actual customers and never to itself.

---

## 🏗️ Architecture Stack

- **Frontend:** React, Vite, Recharts, Lucide React
- **Backend:** Supabase Deno Edge Functions
- **APIs:** Unipile (WhatsApp), OpenAI (Conversational AI)
- **Deployment:** Vercel (Frontend), Supabase (Serverless Backend)

---

## 🛠️ Local Development & Setup

### 1. Start the Frontend Application
The frontend is built with React and Vite. It connects to the live Supabase Edge Function to fetch dashboard metrics and conversation history.

```bash
# Clone the repository
git clone https://github.com/Dexterous-Ruler/ENT.git
cd ENT

# Install dependencies and start the server
npm install
npm run dev
```

### 2. Connect Your WhatsApp Account (Unipile)
To allow the AI to receive and send messages on your behalf, you must link your WhatsApp account via Unipile.

1. Go to the **[Unipile Dashboard](https://dashboard.unipile.com/)**.
2. Navigate to **Accounts** -> **+ Add Account** -> **WhatsApp**.
3. Open WhatsApp on your phone, go to **Settings** > **Linked Devices**, and scan the QR code on your screen.

### 3. Configure the Webhook
To route incoming messages to the AI engine, configure the Unipile Webhook:

1. In the Unipile Dashboard, navigate to **Developers** > **Webhooks**.
2. Click **Create Webhook**.
3. **Webhook URL:** `https://fjfobafukxuhhyeoqzlt.supabase.co/functions/v1/api?type=webhook`
4. **Events:** Check **New messages** (`message_received`).
5. Save the webhook.

---

## 🔐 Environment Secrets & API Keys
The serverless Edge Function requires secure keys to function. Do **not** place these inside the source code. Instead, upload them directly to your Supabase project using the CLI:

```bash
npx supabase secrets set OPENAI_API_KEY="your-openai-key" UNIPILE_DSN="your-unipile-dsn" UNIPILE_API_KEY="your-unipile-key" --project-ref fjfobafukxuhhyeoqzlt
```

---

## 📂 Codebase Overview

- `/src`: Contains the React SPA.
  - `/src/pages`: Key views like Dashboard, Conversations, Settings.
  - `/src/lib/api.js`: The central API client for fetching backend data.
  - `/src/index.css`: Global styling tokens implementing the custom Sarvam pastel design system.
- `/supabase/functions/api/index.ts`: The central Deno Edge Function. It acts as both a REST API serving data to the React dashboard and a robust Webhook receiver for the WhatsApp AI integration.

---
*Built with ❤️ for Local Businesses.*
