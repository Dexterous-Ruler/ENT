# Codebase Architecture & Explanation

This document explains the entire architecture of the Sarvam DeployBridge platform, detailing how the React frontend interacts with the serverless backend, and how the WhatsApp AI integration works.

## 1. High-Level Architecture

The project is split into two main parts:
1. **Frontend:** A React Single Page Application (SPA) built using Vite. It handles the UI, routing, and displaying data.
2. **Backend:** A serverless architecture hosted on **Supabase Edge Functions**. It serves data to the frontend and acts as a central brain (webhook) connecting Unipile (WhatsApp) and OpenAI.

---

## 2. The Frontend (React + Vite)

The frontend code lives inside the `/src` directory.

### UI & Styling
- **Aesthetic:** We transitioned from a standard bold template to a premium, soothing "Sarvam AI" pastel aesthetic. This is controlled globally in `src/index.css` via CSS variables (e.g., `--color-primary-500` set to soft lavenders and peaches).
- **Pages:** 
  - `src/pages/DashboardPage.jsx`: The main overview showing charts, metrics, and recent conversations.
  - `src/pages/ConversationsPage.jsx`: A detailed view of conversation histories with users.

### Data Fetching (`src/lib/api.js`)
Instead of using static mock files, the frontend dynamically requests data from the backend. 
- The file `src/lib/api.js` contains asynchronous functions like `fetchConversations()` and `fetchMetrics()`.
- It uses the native `fetch` API to make `GET` requests to `https://fjfobafukxuhhyeoqzlt.supabase.co/functions/v1/api`.
- It authenticates these requests by sending your public **Supabase Anon Key** in the `Authorization: Bearer` header.
- In the React components (e.g., `DashboardPage.jsx`), we use the `useEffect` hook to call these fetch functions when the page loads, updating the UI state once the data arrives.

---

## 3. The Backend (Supabase Edge Functions)

We migrated the backend logic to a serverless Edge Function hosted by Supabase. The code is located at:
`supabase/functions/api/index.ts`

Edge Functions are written in TypeScript and run on Deno (a modern, secure runtime similar to Node.js). This single function serves two completely different purposes based on the URL query parameter (`?type=`).

### Purpose A: Serving Frontend Data
When the React frontend makes a `GET` request (e.g., `?type=conversations`), the Edge Function:
1. Validates the CORS headers so the browser allows the request.
2. Formats a JSON payload containing structured conversation history and analytics metrics.
3. Returns this JSON back to the frontend to populate the charts and tables.

### Purpose B: WhatsApp Webhook & AI Engine
When Unipile receives a WhatsApp message, it makes a `POST` request to `?type=webhook`. Here is exactly what happens in the code:

1. **Payload Extraction:** The function reads the incoming JSON payload from Unipile and extracts the user's message (`body.message`), the `chat_id`, and the `account_id`.
2. **Infinite Loop Prevention:** It compares the ID of the person who sent the message against your connected WhatsApp account ID. If they match, it means *the bot* just sent a message. The function immediately stops to prevent the bot from endlessly talking to itself.
3. **OpenAI Integration:**
   - It fetches the `OPENAI_API_KEY` securely from the server environment.
   - It makes a `POST` request to `https://api.openai.com/v1/chat/completions`.
   - It sends a **System Prompt**: *"You are a helpful business assistant for an Indian local business. You understand multiple Indian languages..."* alongside the user's incoming text.
   - It waits for OpenAI to generate a text response.
4. **Sending the Reply (Unipile API):**
   - It fetches the `UNIPILE_DSN` and `UNIPILE_API_KEY` from the server environment.
   - It makes a `POST` request back to Unipile at `https://{UNIPILE_DSN}/api/v1/chats/{chat_id}/messages`.
   - Unipile receives this command and instantly sends the AI's text back to the specific WhatsApp chat.

---

## 4. API Keys & Secrets Management

Security is critical. You **never** want to hardcode your OpenAI or Unipile API keys into your source code (like `index.ts`), because if someone sees your code, they can steal your paid API credits.

### How We Set Them Up
Instead of putting keys in the code, we injected them directly into the secure environment of the Supabase server using the Supabase Command Line Interface (CLI):

```bash
npx supabase secrets set OPENAI_API_KEY="sk-proj-..." UNIPILE_DSN="api30.unipile.com:16073" UNIPILE_API_KEY="xvtj..." --project-ref fjfobafukxuhhyeoqzlt
```

### How The Code Reads Them
In the Deno Edge Function (`index.ts`), the code dynamically asks the server for the keys at runtime:
```typescript
const openAiKey = Deno.env.get('OPENAI_API_KEY')
const unipileDsn = Deno.env.get('UNIPILE_DSN')
```
If the keys exist, the API calls succeed. If they don't, the function safely ignores the request without crashing or exposing anything.
