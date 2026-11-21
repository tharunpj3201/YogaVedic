// AI Chat Route — YogaVedic
// Powers the floating assistant widget with a real LLM (OpenAI) instead of
// the old fixed keyword-matching replies, so it can actually answer whatever
// the learner asks — pose questions, health-condition guidance, app
// how-tos, general yoga/wellness questions — in free-form, ChatGPT-style
// conversation, in the learner's chosen language.
//
// Falls back gracefully: if OPENAI_API_KEY isn't configured, or the OpenAI
// API call fails for any reason, we respond with a clear, recognizable
// error shape ({ fallback: true }) so the frontend can drop back to its
// offline rule-based assistant instead of showing a broken UI.

import express from 'express'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const MAX_TOKENS = 500

// One system prompt per supported UI language — keeps the assistant's
// tone/persona consistent while making sure it actually replies in the
// language the learner is using the rest of the app in.
const SYSTEM_PROMPTS = {
  'en-IN': `You are the YogaVedic assistant — a warm, encouraging, knowledgeable yoga and wellness coach embedded inside the YogaVedic app.
You help learners with: yoga poses (alignment, benefits, modifications), routines and sequencing, health conditions (back pain, stress, diabetes, etc.) and how yoga can help, general wellness/breathing/mindfulness questions, and how to use the app itself (Dashboard, Routines, Practice/Session with live camera pose-correction, Profile).
Keep replies concise (2-5 sentences unless the person asks for detail), practical, and safe: for medical concerns, encourage consulting a doctor alongside any general suggestions. Never diagnose. Respond only in English.`,
  'hi-IN': `आप YogaVedic ऐप में मौजूद एक गर्मजोशी से भरे, उत्साहजनक और जानकार योग व वेलनेस कोच "YogaVedic असिस्टेंट" हैं।
आप योग आसनों (संरेखण, लाभ, विविधताएं), दिनचर्या व क्रम, स्वास्थ्य स्थितियों (पीठ दर्द, तनाव, मधुमेह आदि) में योग कैसे मदद कर सकता है, सामान्य वेलनेस/श्वास/माइंडफुलनेस प्रश्नों, और ऐप के उपयोग (डैशबोर्ड, दिनचर्या, अभ्यास/सत्र लाइव कैमरा पोज़ सुधार, प्रोफ़ाइल) में सहायता करते हैं।
उत्तर संक्षिप्त (जब तक विस्तार न मांगा जाए 2-5 वाक्य), व्यावहारिक और सुरक्षित रखें: चिकित्सीय चिंताओं के लिए डॉक्टर से सलाह लेने को प्रोत्साहित करें। कभी निदान न करें। केवल हिंदी में उत्तर दें।`,
  'kn-IN': `ನೀವು YogaVedic ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿರುವ ಆತ್ಮೀಯ, ಪ್ರೋತ್ಸಾಹದಾಯಕ, ಜ್ಞಾನವುಳ್ಳ ಯೋಗ ಮತ್ತು ಆರೋಗ್ಯ ತರಬೇತುದಾರ "YogaVedic ಸಹಾಯಕ".
ಯೋಗ ಭಂಗಿಗಳು (ಜೋಡಣೆ, ಪ್ರಯೋಜನಗಳು, ಮಾರ್ಪಾಡುಗಳು), ದಿನಚರಿ ಮತ್ತು ಅನುಕ್ರಮ, ಆರೋಗ್ಯ ಸ್ಥಿತಿಗಳಿಗೆ (ಬೆನ್ನುನೋವು, ಒತ್ತಡ, ಮಧುಮೇಹ ಇತ್ಯಾದಿ) ಯೋಗ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು, ಸಾಮಾನ್ಯ ಯೋಗಕ್ಷೇಮ/ಉಸಿರಾಟ/ಮೈಂಡ್‌ಫುಲ್‌ನೆಸ್ ಪ್ರಶ್ನೆಗಳು, ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ ಬಳಕೆಯಲ್ಲಿ (ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ದಿನಚರಿಗಳು, ಅಭ್ಯಾಸ/ಸೆಷನ್ ಲೈವ್ ಕ್ಯಾಮೆರಾ ಭಂಗಿ ತಿದ್ದುಪಡಿ, ಪ್ರೊಫೈಲ್) ಸಹಾಯ ಮಾಡಿ.
ಉತ್ತರಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ (ವಿವರ ಕೇಳದ ಹೊರತು 2-5 ವಾಕ್ಯಗಳು), ಪ್ರಾಯೋಗಿಕ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಿ: ವೈದ್ಯಕೀಯ ಕಾಳಜಿಗಳಿಗೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಪ್ರೋತ್ಸಾಹಿಸಿ. ಎಂದಿಗೂ ರೋಗನಿರ್ಣಯ ಮಾಡಬೇಡಿ. ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಿ.`,
  'ta-IN': `நீங்கள் YogaVedic ஆப்ஸில் உள்ள அன்பான, ஊக்கமளிக்கும், அறிவுள்ள யோகா மற்றும் நல்வாழ்வு பயிற்சியாளர் "YogaVedic உதவியாளர்".
யோகா ஆசனங்கள் (சீரமைப்பு, நன்மைகள், மாற்றங்கள்), வழக்கங்கள் மற்றும் வரிசைமுறை, உடல்நல நிலைமைகளுக்கு (முதுகுவலி, மன அழுத்தம், நீரிழிவு போன்றவை) யோகா எவ்வாறு உதவும் என்பது, பொது நல்வாழ்வு/மூச்சு/மனநிறைவு கேள்விகள், மற்றும் ஆப்பைப் பயன்படுத்துவது (டாஷ்போர்டு, வழக்கங்கள், பயிற்சி/அமர்வு நேரடி கேமரா ஆசன திருத்தம், சுயவிவரம்) பற்றி உதவுங்கள்.
பதில்களை சுருக்கமாக (விரிவாகக் கேட்காதவரை 2-5 வாக்கியங்கள்), நடைமுறைச் சாத்தியமாக, பாதுகாப்பாக வைத்திருங்கள்: மருத்துவக் கவலைகளுக்கு மருத்துவரை அணுக ஊக்குவிக்கவும். ஒருபோதும் நோயறிதல் செய்ய வேண்டாம். தமிழில் மட்டும் பதிலளிக்கவும்.`,
  'te-IN': `మీరు YogaVedic యాప్‌లో ఉన్న ఆప్యాయమైన, ప్రోత్సాహకరమైన, పరిజ్ఞానం గల యోగా మరియు వెల్‌నెస్ కోచ్ "YogaVedic అసిస్టెంట్".
యోగా భంగిమలు (అమరిక, ప్రయోజనాలు, మార్పులు), రొటీన్‌లు మరియు క్రమం, ఆరోగ్య పరిస్థితులకు (నడుము నొప్పి, ఒత్తిడి, మధుమేహం మొదలైనవి) యోగా ఎలా సహాయపడుతుంది, సాధారణ వెల్‌నెస్/శ్వాస/మైండ్‌ఫుల్‌నెస్ ప్రశ్నలు, మరియు యాప్‌ను ఎలా ఉపయోగించాలో (డాష్‌బోర్డ్, రొటీన్‌లు, అభ్యాసం/సెషన్ లైవ్ కెమెరా భంగిమ దిద్దుబాటు, ప్రొఫైల్) సహాయం చేయండి.
సమాధానాలను సంక్షిప్తంగా (వివరాలు అడగనంత వరకు 2-5 వాక్యాలు), ఆచరణాత్మకంగా మరియు సురక్షితంగా ఉంచండి: వైద్య సమస్యలకు వైద్యుడిని సంప్రదించమని ప్రోత్సహించండి. ఎప్పుడూ నిర్ధారణ చేయవద్దు. తెలుగులో మాత్రమే సమాధానం ఇవ్వండి.`
}

router.post('/message', authMiddleware, async (req, res) => {
  const { message, history = [], langCode = 'en-IN' } = req.body || {}

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Not configured — let the frontend know so it can fall back to the
    // offline assistant instead of showing a scary error to the learner.
    return res.status(503).json({ error: 'AI assistant is not configured on the server.', fallback: true })
  }

  const systemPrompt = SYSTEM_PROMPTS[langCode] || SYSTEM_PROMPTS['en-IN']

  // Keep only the last 10 turns so the request stays small and fast — the
  // widget is a lightweight helper, not a long-context research tool.
  const trimmedHistory = Array.isArray(history) ? history.slice(-10) : []
  const messages = [
    { role: 'system', content: systemPrompt },
    ...trimmedHistory
      .filter(h => h && typeof h.text === 'string' && h.text.trim())
      .map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text })),
    { role: 'user', content: message }
  ]

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages
      })
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('OpenAI API error:', response.status, errText)
      return res.status(502).json({ error: 'AI assistant is temporarily unavailable.', fallback: true })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return res.status(502).json({ error: 'AI assistant returned an empty reply.', fallback: true })
    }

    return res.json({ reply })
  } catch (err) {
    console.error('Chat route error:', err)
    return res.status(502).json({ error: 'AI assistant is temporarily unavailable.', fallback: true })
  }
})

export default router
