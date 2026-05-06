import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const mockConversations = [
  {
    id: 'conv-001',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    language: 'Hindi',
    languageCode: 'hi',
    intent: 'appointment',
    intentLabel: 'Appointment Booking',
    summary: 'Patient wanted to book an appointment for a general checkup on Thursday afternoon.',
    summaryHi: 'मरीज़ गुरुवार दोपहर को सामान्य जाँच के लिए अपॉइंटमेंट बुक करना चाहती थीं।',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    duration: '2m 30s',
    messages: [
      { from: 'customer', text: 'नमस्ते, मुझे डॉक्टर साहब से मिलना है', time: '10:30 AM' },
      { from: 'bot', text: 'नमस्ते! आप किस दिन आना चाहेंगी? हमारे डॉक्टर सोमवार से शनिवार, सुबह 9 से शाम 6 बजे तक उपलब्ध हैं।', time: '10:30 AM' },
      { from: 'customer', text: 'गुरुवार को दोपहर में आ सकती हूँ', time: '10:31 AM' },
      { from: 'bot', text: 'बिल्कुल! गुरुवार दोपहर 2:00 बजे का अपॉइंटमेंट बुक कर दिया है। परामर्श शुल्क ₹500 है। कृपया अपना आधार कार्ड साथ लाएँ।', time: '10:31 AM' },
      { from: 'customer', text: 'धन्यवाद!', time: '10:32 AM' },
    ],
  },
  {
    id: 'conv-002',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 87654 32109',
    language: 'Hindi',
    languageCode: 'hi',
    intent: 'pricing',
    intentLabel: 'Price Inquiry',
    summary: 'Customer asked about the price of Tata Salt and Aashirvaad atta. Confirmed availability.',
    summaryHi: 'ग्राहक ने टाटा नमक और आशीर्वाद आटे की कीमत पूछी। उपलब्धता की पुष्टि की।',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    duration: '1m 45s',
    messages: [
      { from: 'customer', text: 'भाई, टाटा नमक और आशीर्वाद आटा कितने का है?', time: '09:45 AM' },
      { from: 'bot', text: 'टाटा नमक (1 kg) ₹28 और आशीर्वाद आटा (5 kg) ₹245 है। दोनों उपलब्ध हैं। होम डिलीवरी भी कर सकते हैं ₹500 से ऊपर के ऑर्डर पर।', time: '09:45 AM' },
      { from: 'customer', text: 'ठीक है, शाम को आता हूँ लेने', time: '09:46 AM' },
    ],
  },
  {
    id: 'conv-003',
    customerName: 'Anita Devi',
    customerPhone: '+91 76543 21098',
    language: 'Tamil',
    languageCode: 'ta',
    intent: 'services',
    intentLabel: 'Service Inquiry',
    summary: 'Parent inquired about available batches for 10th standard coaching and fees.',
    summaryHi: 'अभिभावक ने 10वीं कक्षा कोचिंग के बैच और फ़ीस के बारे में पूछा।',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    duration: '3m 10s',
    messages: [
      { from: 'customer', text: '10th class coaching available ah?', time: '08:30 AM' },
      { from: 'bot', text: 'Yes! We have morning batch (6-8 AM) and evening batch (4-6 PM) for 10th standard. Subjects: Maths, Science, English. Monthly fee: ₹2,000. Demo class is free.', time: '08:30 AM' },
      { from: 'customer', text: 'Evening batch timing change possible?', time: '08:32 AM' },
      { from: 'bot', text: 'The evening batch timing is fixed at 4-6 PM. But we also offer weekend-only batches on Saturday and Sunday, 10 AM to 1 PM, for ₹2,500/month. Would you like to try a free demo class?', time: '08:32 AM' },
      { from: 'customer', text: 'Ok, weekend batch for demo please', time: '08:33 AM' },
    ],
  },
  {
    id: 'conv-004',
    customerName: 'Mohammed Irfan',
    customerPhone: '+91 65432 10987',
    language: 'Hindi',
    languageCode: 'hi',
    intent: 'status',
    intentLabel: 'Order Status',
    summary: 'Customer checked on pending bike service. Informed about delay due to spare part availability.',
    summaryHi: 'ग्राहक ने बाइक सर्विस की स्थिति पूछी। स्पेयर पार्ट की उपलब्धता के कारण देरी बताई।',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    duration: '2m 00s',
    messages: [
      { from: 'customer', text: 'Meri bike ki service kab hogi? Token number 45 hai', time: '07:30 AM' },
      { from: 'bot', text: 'Token #45 check kar raha hoon... Aapki Honda Activa ki servicing chal rahi hai. Brake pad ka spare part aaj shaam tak aa jayega. Kal subah 11 baje tak ready ho jayegi.', time: '07:30 AM' },
      { from: 'customer', text: 'Total kitna lagega?', time: '07:31 AM' },
      { from: 'bot', text: 'Service charge ₹350 + Brake pad ₹450 + Oil change ₹200 = Total ₹1,000. Payment UPI ya cash dono chalega.', time: '07:31 AM' },
    ],
  },
  {
    id: 'conv-005',
    customerName: 'Lakshmi Narayanan',
    customerPhone: '+91 54321 09876',
    language: 'Telugu',
    languageCode: 'te',
    intent: 'hours',
    intentLabel: 'Business Hours',
    summary: 'Customer asked about Sunday opening hours. Informed about closure.',
    summaryHi: 'ग्राहक ने रविवार के खुलने के समय पूछा। बंद होने की जानकारी दी।',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    duration: '0m 45s',
    messages: [
      { from: 'customer', text: 'Sunday open unda?', time: '06:45 AM' },
      { from: 'bot', text: 'Sorry, Sunday is closed. We are open Monday to Saturday, 9 AM to 8 PM. Can I help you with anything for Monday?', time: '06:45 AM' },
    ],
  },
];

const mockMetrics = {
  today: {
    totalConversations: 23,
    activeLeads: 5,
    languagesUsed: 3,
    responseRate: 97,
  },
  week: {
    totalConversations: 147,
    activeLeads: 28,
    languagesUsed: 5,
    responseRate: 95,
  },
  month: {
    totalConversations: 589,
    activeLeads: 92,
    languagesUsed: 7,
    responseRate: 96,
  },
};

const mockIntentData = [
  { name: 'Pricing', value: 35 },
  { name: 'Appointments', value: 28 },
  { name: 'Services', value: 20 },
  { name: 'Order Status', value: 12 },
  { name: 'Hours', value: 5 },
];

const mockWeeklyTrend = [
  { day: 'Mon', conversations: 18 },
  { day: 'Tue', conversations: 25 },
  { day: 'Wed', conversations: 22 },
  { day: 'Thu', conversations: 30 },
  { day: 'Fri', conversations: 28 },
  { day: 'Sat', conversations: 35 },
  { day: 'Sun', conversations: 12 },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'all'

    // --- WEBHOOK HANDLER FOR UNIPILE & OPENAI ---
    if (type === 'webhook' && req.method === 'POST') {
      const body = await req.json()
      
      const event = body.event;
      // Only process new incoming messages
      if (event !== 'message_received') {
        return new Response(JSON.stringify({ success: true, status: 'ignored_event' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      // Read secrets early — needed for loop detection AND sending
      const unipileDsn = Deno.env.get('UNIPILE_DSN')
      const unipileApiKey = Deno.env.get('UNIPILE_API_KEY')

      // Extract data from Unipile webhook payload
      const text = body.message || '';
      const chatId = body.chat_id;
      const accountId = body.account_id;

      // ── Bulletproof infinite-loop prevention ──────────────────────
      // WhatsApp uses different ID formats (phone number vs LID),
      // so comparing account_info.user_id with sender.attendee_provider_id
      // does NOT work. Instead we ask Unipile for the latest message in
      // the chat and check is_sender (1 = we sent it, 0 = customer sent it).
      if (chatId && unipileDsn && unipileApiKey) {
        try {
          const latestResp = await fetch(
            `https://${unipileDsn}/api/v1/chats/${chatId}/messages?limit=1`,
            { headers: { 'X-API-KEY': unipileApiKey, 'Accept': 'application/json' } }
          );
          if (latestResp.ok) {
            const latestData = await latestResp.json();
            const latestMsg = latestData?.items?.[0];
            if (latestMsg && latestMsg.is_sender === 1) {
              console.log('Skipping: latest message was sent by us (is_sender=1)');
              return new Response(JSON.stringify({ success: true, status: 'ignored_own_message' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
              })
            }
          }
        } catch (e) {
          console.error('Loop-detection fetch failed:', e);
        }
      }
      // ─────────────────────────────────────────────────────────────

      if (text && chatId && accountId) {
        // 1. Prepare OpenAI Messages with Conversation History
        const openAiKey = Deno.env.get('OPENAI_API_KEY')

        let aiResponse = "Hello! I am your automated AI assistant."
        let openAiMessages = [
          { role: "system", content: "You are the advanced AI business assistant for Sarvam DeployBridge. You answer customer questions accurately, politely, and perfectly. You understand multiple Indian languages and always respond in the language the customer used. If asked about prices, services, or availability, provide helpful, realistic information. Maintain context of the conversation. Keep responses concise, warm, and human-like." }
        ];

        if (unipileDsn && unipileApiKey) {
          try {
            // Fetch recent chat history to give the AI context for follow-up questions
            const historyReq = await fetch(`https://${unipileDsn}/api/v1/chats/${chatId}/messages`, {
              headers: {
                'X-API-KEY': unipileApiKey,
                'Accept': 'application/json'
              }
            });
            
            if (historyReq.ok) {
              const historyData = await historyReq.json();
              const msgs = Array.isArray(historyData) ? historyData : (historyData.items || historyData.data || []);
              
              // Unipile returns most recent first. We take the last 6 messages and reverse for chronological order
              const recentMsgs = msgs.slice(0, 6).reverse();
              
              recentMsgs.forEach((m: any) => {
                const msgText = m.text || m.message || "";
                if (!msgText) return;
                
                // Compare sender to our connected account ID to know if it's the AI or the user
                const isFromUs = m.is_sender === 1;
                openAiMessages.push({
                  role: isFromUs ? "assistant" : "user",
                  content: msgText
                });
              });
            }
          } catch (e) {
            console.error("Error fetching history:", e);
          }
        }

        // Ensure the current message is included if it wasn't caught in the history fetch
        const hasCurrentMessage = openAiMessages.some((m: any) => m.content === text);
        if (!hasCurrentMessage && text) {
          openAiMessages.push({ role: "user", content: text });
        }
        
        if (openAiKey) {
          try {
            const aiReq = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: openAiMessages
              })
            })
            const aiData = await aiReq.json()
            if (aiData.choices && aiData.choices.length > 0) {
              aiResponse = aiData.choices[0].message.content
            }
          } catch (e) {
            console.error("OpenAI Error:", e);
          }
        }

        // 2. Send reply via Unipile API (MUST use multipart/form-data per Unipile docs)
        if (unipileDsn && unipileApiKey) {
          const formData = new FormData();
          formData.append('text', aiResponse);

          const sendResp = await fetch(`https://${unipileDsn}/api/v1/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
              'X-API-KEY': unipileApiKey,
              'Accept': 'application/json'
            },
            body: formData
          })
          const sendResult = await sendResp.text();
          console.log(`Unipile send status: ${sendResp.status}, body: ${sendResult}`);
        }
      }

      return new Response(JSON.stringify({ success: true, status: 'processed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    // ---------------------------------------------

    let payload = {}

    if (type === 'conversations') {
      payload = { conversations: mockConversations }
    } else if (type === 'metrics') {
      payload = { 
        metrics: mockMetrics,
        intentData: mockIntentData,
        weeklyTrend: mockWeeklyTrend
      }
    } else {
      payload = {
        conversations: mockConversations,
        metrics: mockMetrics,
        intentData: mockIntentData,
        weeklyTrend: mockWeeklyTrend
      }
    }

    return new Response(
      JSON.stringify(payload),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
