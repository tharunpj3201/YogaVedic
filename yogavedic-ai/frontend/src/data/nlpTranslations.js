// NLP Translations — YogaVedic
// Mirrors the pattern used by checkFeedbackTranslations.js: everything the
// NLP layer (nlpService.js) needs to understand free text and reply is kept
// here, keyed by langCode, so switching the app language also switches what
// the assistant understands and how it speaks — not just the static UI.
//
// Condition/category LABEL KEYS stay in English on purpose (they're used as
// internal ids elsewhere — onboarding's CONDITIONS list, routineGenerator's
// CONDITION_CATEGORY_MAP, etc). Only the *keyword banks used to detect them*
// and the *user-facing strings* are localized.

export const SUPPORTED_LANGS = ['en-IN', 'hi-IN', 'kn-IN', 'ta-IN', 'te-IN']

// ── Condition keyword bank (free text -> onboarding condition labels) ──────
export const CONDITION_KEYWORDS_BY_LANG = {
  'en-IN': {
    'Back Pain': ['back pain', 'backache', 'back ache', 'lower back', 'spine', 'sciatica', 'slipped disc', 'stiff back', 'my back hurts'],
    'Stress / Anxiety': ['stress', 'stressed', 'anxiety', 'anxious', 'overwhelm', 'panic', 'tension', 'worry', 'worried', 'nervous', 'calm my mind', 'racing thoughts'],
    'Weight Loss': ['weight loss', 'lose weight', 'lose fat', 'fat loss', 'slim down', 'burn calories', 'tone up', 'obesity', 'obese', 'lose 5kg', 'shed kilos'],
    'Diabetes': ['diabetes', 'diabetic', 'blood sugar', 'sugar level', 'glucose'],
    'Flexibility': ['flexibility', 'flexible', 'stretch', 'stretching', 'tight muscles', 'mobility', 'touch my toes', 'splits'],
    'Poor Posture': ['posture', 'slouch', 'hunch', 'rounded shoulders', 'desk job', 'sitting all day', 'text neck'],
    'Insomnia': ['insomnia', "can't sleep", 'cant sleep', 'sleep better', 'sleepless', 'trouble sleeping', 'sleep issues']
  },
  'hi-IN': {
    'Back Pain': ['पीठ दर्द', 'कमर दर्द', 'कमर में दर्द', 'रीढ़ की हड्डी', 'साइटिका', 'पीठ अकड़ी हुई', 'मेरी पीठ में दर्द है'],
    'Stress / Anxiety': ['तनाव', 'चिंता', 'घबराहट', 'बेचैनी', 'दिमाग शांत', 'मन शांत करना', 'नर्वस'],
    'Weight Loss': ['वजन कम', 'वजन घटाना', 'चर्बी कम', 'मोटापा', '5 किलो कम करना', 'वजन कम करना है'],
    'Diabetes': ['डायबिटीज', 'मधुमेह', 'शुगर लेवल', 'ब्लड शुगर'],
    'Flexibility': ['लचीलापन', 'खिंचाव', 'स्ट्रेचिंग', 'मांसपेशियां अकड़ी', 'पैर के अंगूठे छूना'],
    'Poor Posture': ['मुद्रा', 'झुकना', 'कंधे झुके हुए', 'डेस्क जॉब', 'पूरे दिन बैठना'],
    'Insomnia': ['अनिद्रा', 'नींद नहीं आती', 'नींद बेहतर', 'सो नहीं पाता', 'नींद की समस्या']
  },
  'kn-IN': {
    'Back Pain': ['ಬೆನ್ನು ನೋವು', 'ಸೊಂಟ ನೋವು', 'ಬೆನ್ನುಮೂಳೆ', 'ಸಿಯಾಟಿಕಾ', 'ಬೆನ್ನು ಬಿಗಿ', 'ನನ್ನ ಬೆನ್ನು ನೋವಾಗುತ್ತಿದೆ'],
    'Stress / Anxiety': ['ಒತ್ತಡ', 'ಆತಂಕ', 'ಗಾಬರಿ', 'ಚಿಂತೆ', 'ಮನಸ್ಸು ಶಾಂತ', 'ನರ್ವಸ್'],
    'Weight Loss': ['ತೂಕ ಇಳಿಸು', 'ತೂಕ ಕಡಿಮೆ', 'ಕೊಬ್ಬು ಕಡಿಮೆ', 'ಬೊಜ್ಜು', '5 ಕೆಜಿ ಕಡಿಮೆ'],
    'Diabetes': ['ಡಯಾಬಿಟಿಸ್', 'ಮಧುಮೇಹ', 'ಸಕ್ಕರೆ ಮಟ್ಟ', 'ಬ್ಲಡ್ ಶುಗರ್'],
    'Flexibility': ['ಬಗ್ಗುವಿಕೆ', 'ಸ್ಟ್ರೆಚಿಂಗ್', 'ಸ್ನಾಯುಗಳು ಬಿಗಿ', 'ಕಾಲ್ಬೆರಳು ಮುಟ್ಟುವುದು'],
    'Poor Posture': ['ಭಂಗಿ', 'ಬಾಗುವುದು', 'ಭುಜಗಳು ಬಾಗಿವೆ', 'ಡೆಸ್ಕ್ ಕೆಲಸ', 'ದಿನವಿಡೀ ಕುಳಿತುಕೊಳ್ಳುವುದು'],
    'Insomnia': ['ನಿದ್ರಾಹೀನತೆ', 'ನಿದ್ರೆ ಬರುತ್ತಿಲ್ಲ', 'ಉತ್ತಮ ನಿದ್ರೆ', 'ನಿದ್ರೆ ಸಮಸ್ಯೆ']
  },
  'ta-IN': {
    'Back Pain': ['முதுகு வலி', 'இடுப்பு வலி', 'முதுகெலும்பு', 'சயாட்டிகா', 'முதுகு விறைப்பு', 'என் முதுகு வலிக்கிறது'],
    'Stress / Anxiety': ['மன அழுத்தம்', 'கவலை', 'பதற்றம்', 'மனதை அமைதிப்படுத்த', 'நெர்வஸ்'],
    'Weight Loss': ['எடை குறைப்பு', 'எடை குறைக்க', 'கொழுப்பு குறைக்க', 'பருமன்', '5 கிலோ குறைக்க'],
    'Diabetes': ['நீரிழிவு', 'சர்க்கரை நோய்', 'சர்க்கரை அளவு', 'ரத்த சர்க்கரை'],
    'Flexibility': ['நெகிழ்வுத்தன்மை', 'ஸ்ட்ரெட்ச்', 'இறுக்கமான தசைகள்', 'கால் விரல் தொட'],
    'Poor Posture': ['தோரணை', 'கூன', 'தோள்கள் கூனி', 'டெஸ்க் வேலை', 'நாள் முழுவதும் உட்கார்ந்திருத்தல்'],
    'Insomnia': ['தூக்கமின்மை', 'தூக்கம் வரவில்லை', 'சிறந்த தூக்கம்', 'தூக்க பிரச்சனை']
  },
  'te-IN': {
    'Back Pain': ['వెన్నునొప్పి', 'నడుము నొప్పి', 'వెన్నెముక', 'సయాటికా', 'వెన్ను బిగుసుకుపోవడం', 'నా వెన్ను నొప్పిగా ఉంది'],
    'Stress / Anxiety': ['ఒత్తిడి', 'ఆందోళన', 'కంగారు', 'మనసు ప్రశాంతంగా', 'నెర్వస్'],
    'Weight Loss': ['బరువు తగ్గించడం', 'బరువు తగ్గాలి', 'కొవ్వు తగ్గించడం', 'ఊబకాయం', '5 కిలోలు తగ్గించాలి'],
    'Diabetes': ['డయాబెటిస్', 'మధుమేహం', 'షుగర్ లెవెల్', 'బ్లడ్ షుగర్'],
    'Flexibility': ['వశ్యత', 'స్ట్రెచింగ్', 'కండరాలు బిగుసుకుపోవడం', 'కాలి వేళ్లు తాకడం'],
    'Poor Posture': ['భంగిమ', 'వంగడం', 'భుజాలు వంగి ఉండడం', 'డెస్క్ జాబ్', 'రోజంతా కూర్చోవడం'],
    'Insomnia': ['నిద్రలేమి', 'నిద్ర రావడం లేదు', 'మెరుగైన నిద్ర', 'నిద్ర సమస్య']
  }
}

// ── Category keyword bank (free text -> routineGenerator category keys) ────
export const CATEGORY_KEYWORDS_BY_LANG = {
  'en-IN': {
    back_pain: CONDITION_KEYWORDS_BY_LANG['en-IN']['Back Pain'],
    stress: ['stress', 'stressed', 'overwhelm', 'tension', 'pressure', 'burnt out', 'burned out'],
    anxiety: ['anxiety', 'anxious', 'panic', 'nervous', 'worry', 'worried', 'calm my mind'],
    weight_loss: CONDITION_KEYWORDS_BY_LANG['en-IN']['Weight Loss'],
    diabetes: CONDITION_KEYWORDS_BY_LANG['en-IN']['Diabetes'],
    flexibility: CONDITION_KEYWORDS_BY_LANG['en-IN']['Flexibility'],
    student: ['student', 'exam', 'exams', 'study', 'studies', 'college', 'school', 'college stress'],
    corporate: ['corporate', 'desk job', 'office', 'sitting all day', 'work from home', 'wfh', '9 to 5']
  },
  'hi-IN': {
    back_pain: CONDITION_KEYWORDS_BY_LANG['hi-IN']['Back Pain'],
    stress: ['तनाव', 'दबाव', 'बर्नआउट', 'दिमाग पर बोझ'],
    anxiety: ['चिंता', 'घबराहट', 'बेचैनी', 'नर्वस', 'मन शांत करना'],
    weight_loss: CONDITION_KEYWORDS_BY_LANG['hi-IN']['Weight Loss'],
    diabetes: CONDITION_KEYWORDS_BY_LANG['hi-IN']['Diabetes'],
    flexibility: CONDITION_KEYWORDS_BY_LANG['hi-IN']['Flexibility'],
    student: ['छात्र', 'परीक्षा', 'पढ़ाई', 'कॉलेज', 'स्कूल', 'एग्जाम स्ट्रेस'],
    corporate: ['कॉर्पोरेट', 'डेस्क जॉब', 'ऑफिस', 'पूरे दिन बैठना', 'वर्क फ्रॉम होम']
  },
  'kn-IN': {
    back_pain: CONDITION_KEYWORDS_BY_LANG['kn-IN']['Back Pain'],
    stress: ['ಒತ್ತಡ', 'ಒತ್ತಡದಲ್ಲಿ', 'ಬರ್ನ್‌ಔಟ್'],
    anxiety: ['ಆತಂಕ', 'ಗಾಬರಿ', 'ನರ್ವಸ್', 'ಮನಸ್ಸು ಶಾಂತ'],
    weight_loss: CONDITION_KEYWORDS_BY_LANG['kn-IN']['Weight Loss'],
    diabetes: CONDITION_KEYWORDS_BY_LANG['kn-IN']['Diabetes'],
    flexibility: CONDITION_KEYWORDS_BY_LANG['kn-IN']['Flexibility'],
    student: ['ವಿದ್ಯಾರ್ಥಿ', 'ಪರೀಕ್ಷೆ', 'ಓದು', 'ಕಾಲೇಜು', 'ಶಾಲೆ'],
    corporate: ['ಕಾರ್ಪೊರೇಟ್', 'ಡೆಸ್ಕ್ ಕೆಲಸ', 'ಆಫೀಸ್', 'ದಿನವಿಡೀ ಕುಳಿತುಕೊಳ್ಳುವುದು', 'ವರ್ಕ್ ಫ್ರಂ ಹೋಮ್']
  },
  'ta-IN': {
    back_pain: CONDITION_KEYWORDS_BY_LANG['ta-IN']['Back Pain'],
    stress: ['மன அழுத்தம்', 'பர்ன்அவுட்', 'அழுத்தம்'],
    anxiety: ['கவலை', 'பதற்றம்', 'நெர்வஸ்', 'மனதை அமைதிப்படுத்த'],
    weight_loss: CONDITION_KEYWORDS_BY_LANG['ta-IN']['Weight Loss'],
    diabetes: CONDITION_KEYWORDS_BY_LANG['ta-IN']['Diabetes'],
    flexibility: CONDITION_KEYWORDS_BY_LANG['ta-IN']['Flexibility'],
    student: ['மாணவர்', 'தேர்வு', 'படிப்பு', 'கல்லூரி', 'பள்ளி'],
    corporate: ['கார்ப்பரேட்', 'டெஸ்க் வேலை', 'அலுவலகம்', 'நாள் முழுவதும் உட்கார்ந்திருத்தல்', 'வொர்க் ஃப்ரம் ஹோம்']
  },
  'te-IN': {
    back_pain: CONDITION_KEYWORDS_BY_LANG['te-IN']['Back Pain'],
    stress: ['ఒత్తిడి', 'బర్న్‌అవుట్', 'ఒత్తిడిలో'],
    anxiety: ['ఆందోళన', 'కంగారు', 'నెర్వస్', 'మనసు ప్రశాంతంగా'],
    weight_loss: CONDITION_KEYWORDS_BY_LANG['te-IN']['Weight Loss'],
    diabetes: CONDITION_KEYWORDS_BY_LANG['te-IN']['Diabetes'],
    flexibility: CONDITION_KEYWORDS_BY_LANG['te-IN']['Flexibility'],
    student: ['విద్యార్థి', 'పరీక్ష', 'చదువు', 'కాలేజీ', 'స్కూల్'],
    corporate: ['కార్పొరేట్', 'డెస్క్ జాబ్', 'ఆఫీసు', 'రోజంతా కూర్చోవడం', 'వర్క్ ఫ్రమ్ హోమ్']
  }
}

// ── Localized display labels for condition keys (used when the chat quotes
// a detected condition back to the user, so the sentence isn't mixed-script) ──
export const CONDITION_LABELS_BY_LANG = {
  'en-IN': {
    'Back Pain': 'Back Pain', 'Stress / Anxiety': 'Stress / Anxiety', 'Weight Loss': 'Weight Loss',
    'Diabetes': 'Diabetes', 'Flexibility': 'Flexibility', 'Poor Posture': 'Poor Posture', 'Insomnia': 'Insomnia'
  },
  'hi-IN': {
    'Back Pain': 'पीठ दर्द', 'Stress / Anxiety': 'तनाव / चिंता', 'Weight Loss': 'वजन घटाना',
    'Diabetes': 'डायबिटीज', 'Flexibility': 'लचीलापन', 'Poor Posture': 'खराब मुद्रा', 'Insomnia': 'अनिद्रा'
  },
  'kn-IN': {
    'Back Pain': 'ಬೆನ್ನು ನೋವು', 'Stress / Anxiety': 'ಒತ್ತಡ / ಆತಂಕ', 'Weight Loss': 'ತೂಕ ಇಳಿಕೆ',
    'Diabetes': 'ಡಯಾಬಿಟಿಸ್', 'Flexibility': 'ಬಗ್ಗುವಿಕೆ', 'Poor Posture': 'ಕಳಪೆ ಭಂಗಿ', 'Insomnia': 'ನಿದ್ರಾಹೀನತೆ'
  },
  'ta-IN': {
    'Back Pain': 'முதுகு வலி', 'Stress / Anxiety': 'மன அழுத்தம் / கவலை', 'Weight Loss': 'எடை குறைப்பு',
    'Diabetes': 'நீரிழிவு', 'Flexibility': 'நெகிழ்வுத்தன்மை', 'Poor Posture': 'சரியற்ற தோரணை', 'Insomnia': 'தூக்கமின்மை'
  },
  'te-IN': {
    'Back Pain': 'వెన్నునొప్పి', 'Stress / Anxiety': 'ఒత్తిడి / ఆందోళన', 'Weight Loss': 'బరువు తగ్గించడం',
    'Diabetes': 'డయాబెటిస్', 'Flexibility': 'వశ్యత', 'Poor Posture': 'సరైన భంగిమ లేకపోవడం', 'Insomnia': 'నిద్రలేమి'
  }
}

// ── Chat assistant: greeting / placeholder / static UI strings ─────────────
export const CHAT_STRINGS_BY_LANG = {
  'en-IN': {
    headerTitle: 'YogaVedic Assistant',
    headerSubtitle: 'Ask about poses, routines, or the app',
    greeting: "Namaste 🙏 Ask me about a pose, how the app works, or tell me a goal like \"I have back pain\" and I'll point you to the right routine.",
    inputPlaceholder: 'Ask me anything…',
    emptyInputPrompt: 'Ask me anything about your practice — a pose, a goal, or how the app works.',
    notSure: "I'm not sure about that one yet — try asking about a specific pose (\"benefits of Cobra Pose\"), or tell me a goal like \"I want to reduce stress\" and I'll suggest a routine focus.",
    poseTemplate: '{poseName} ({sanskrit}): {benefits} To begin: {firstInstruction}',
    conditionsTemplate: "Based on that, I'd focus your practice on: {conditions}. Head to the Routine page — those categories will already be weighted in your generated sequence."
  },
  'hi-IN': {
    headerTitle: 'योगवैदिक सहायक',
    headerSubtitle: 'आसन, रूटीन या ऐप के बारे में पूछें',
    greeting: 'नमस्ते 🙏 मुझसे किसी आसन के बारे में पूछें, ऐप कैसे काम करता है जानें, या "मुझे कमर दर्द है" जैसा कोई लक्ष्य बताएं — मैं आपको सही रूटीन बताऊंगा।',
    inputPlaceholder: 'कुछ भी पूछें…',
    emptyInputPrompt: 'अपने अभ्यास के बारे में कुछ भी पूछें — कोई आसन, कोई लक्ष्य, या ऐप कैसे काम करता है।',
    notSure: 'मुझे अभी इसके बारे में ठीक से पता नहीं — किसी खास आसन के बारे में पूछें ("कोबरा आसन के फायदे"), या कोई लक्ष्य बताएं जैसे "मैं तनाव कम करना चाहता हूं" और मैं आपको रूटीन सुझाऊंगा।',
    poseTemplate: '{poseName} ({sanskrit}): {benefits} शुरू करने के लिए: {firstInstruction}',
    conditionsTemplate: 'इसके आधार पर, मैं आपके अभ्यास को इन पर केंद्रित करूंगा: {conditions}। रूटीन पेज पर जाएं — ये श्रेणियां आपके बनाए गए क्रम में पहले से ही शामिल होंगी।'
  },
  'kn-IN': {
    headerTitle: 'ಯೋಗವೈದಿಕ್ ಸಹಾಯಕ',
    headerSubtitle: 'ಆಸನಗಳು, ರೂಟೀನ್ ಅಥವಾ ಆ್ಯಪ್ ಬಗ್ಗೆ ಕೇಳಿ',
    greeting: 'ನಮಸ್ತೆ 🙏 ಒಂದು ಆಸನದ ಬಗ್ಗೆ ಕೇಳಿ, ಆ್ಯಪ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ತಿಳಿಯಿರಿ, ಅಥವಾ "ನನಗೆ ಬೆನ್ನು ನೋವಿದೆ" ಎಂಬಂತಹ ಗುರಿ ಹೇಳಿ — ನಾನು ಸರಿಯಾದ ರೂಟೀನ್ ಸೂಚಿಸುತ್ತೇನೆ.',
    inputPlaceholder: 'ಏನಾದರೂ ಕೇಳಿ…',
    emptyInputPrompt: 'ನಿಮ್ಮ ಅಭ್ಯಾಸದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ — ಒಂದು ಆಸನ, ಒಂದು ಗುರಿ, ಅಥವಾ ಆ್ಯಪ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
    notSure: 'ಅದರ ಬಗ್ಗೆ ನನಗೆ ಇನ್ನೂ ಖಚಿತವಿಲ್ಲ — ನಿರ್ದಿಷ್ಟ ಆಸನದ ಬಗ್ಗೆ ಕೇಳಿ ("ಕೋಬ್ರಾ ಆಸನದ ಪ್ರಯೋಜನಗಳು"), ಅಥವಾ "ನಾನು ಒತ್ತಡ ಕಡಿಮೆ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ" ಎಂಬಂತಹ ಗುರಿ ಹೇಳಿ ಮತ್ತು ನಾನು ರೂಟೀನ್ ಸೂಚಿಸುತ್ತೇನೆ.',
    poseTemplate: '{poseName} ({sanskrit}): {benefits} ಪ್ರಾರಂಭಿಸಲು: {firstInstruction}',
    conditionsTemplate: 'ಅದರ ಆಧಾರದ ಮೇಲೆ, ನಾನು ನಿಮ್ಮ ಅಭ್ಯಾಸವನ್ನು ಇವುಗಳ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತೇನೆ: {conditions}. ರೂಟೀನ್ ಪುಟಕ್ಕೆ ಹೋಗಿ — ಆ ವರ್ಗಗಳು ನಿಮ್ಮ ರಚಿತ ಅನುಕ್ರಮದಲ್ಲಿ ಈಗಾಗಲೇ ಆದ್ಯತೆ ಪಡೆಯುತ್ತವೆ.'
  },
  'ta-IN': {
    headerTitle: 'யோகவேதிக் உதவியாளர்',
    headerSubtitle: 'ஆசனங்கள், ரூட்டீன் அல்லது ஆப் பற்றி கேளுங்கள்',
    greeting: 'நமஸ்தே 🙏 ஒரு ஆசனத்தைப் பற்றி கேளுங்கள், ஆப் எப்படி வேலை செய்கிறது என தெரிந்துகொள்ளுங்கள், அல்லது "எனக்கு முதுகு வலி" போன்ற இலக்கைச் சொல்லுங்கள் — நான் சரியான ரூட்டீனைக் காண்பிப்பேன்.',
    inputPlaceholder: 'எதுவும் கேளுங்கள்…',
    emptyInputPrompt: 'உங்கள் பயிற்சி பற்றி எதுவும் கேளுங்கள் — ஒரு ஆசனம், ஒரு இலக்கு, அல்லது ஆப் எப்படி வேலை செய்கிறது.',
    notSure: 'அது பற்றி எனக்கு இன்னும் தெளிவில்லை — குறிப்பிட்ட ஆசனத்தைப் பற்றி கேளுங்கள் ("கோப்ரா ஆசனத்தின் நன்மைகள்"), அல்லது "நான் மன அழுத்தத்தை குறைக்க விரும்புகிறேன்" போன்ற இலக்கைச் சொல்லுங்கள், நான் ரூட்டீன் பரிந்துரைப்பேன்.',
    poseTemplate: '{poseName} ({sanskrit}): {benefits} தொடங்க: {firstInstruction}',
    conditionsTemplate: 'அதன் அடிப்படையில், உங்கள் பயிற்சியை இவற்றில் கவனம் செலுத்துவேன்: {conditions}. ரூட்டீன் பக்கத்திற்குச் செல்லுங்கள் — அந்த வகைகள் உங்கள் உருவாக்கப்பட்ட வரிசையில் ஏற்கனவே முன்னுரிமை பெறும்.'
  },
  'te-IN': {
    headerTitle: 'యోగవేదిక్ సహాయకుడు',
    headerSubtitle: 'ఆసనాలు, రొటీన్ లేదా యాప్ గురించి అడగండి',
    greeting: 'నమస్తే 🙏 ఒక ఆసనం గురించి అడగండి, యాప్ ఎలా పనిచేస్తుందో తెలుసుకోండి, లేదా "నాకు వెన్నునొప్పి ఉంది" వంటి లక్ష్యం చెప్పండి — నేను సరైన రొటీన్‌ను చూపిస్తాను.',
    inputPlaceholder: 'ఏదైనా అడగండి…',
    emptyInputPrompt: 'మీ అభ్యాసం గురించి ఏదైనా అడగండి — ఒక ఆసనం, ఒక లక్ష్యం, లేదా యాప్ ఎలా పనిచేస్తుంది.',
    notSure: 'దాని గురించి నాకు ఇంకా స్పష్టత లేదు — నిర్దిష్ట ఆసనం గురించి అడగండి ("కోబ్రా ఆసనం ప్రయోజనాలు"), లేదా "నేను ఒత్తిడిని తగ్గించుకోవాలనుకుంటున్నాను" వంటి లక్ష్యం చెప్పండి, నేను రొటీన్‌ను సూచిస్తాను.',
    poseTemplate: '{poseName} ({sanskrit}): {benefits} ప్రారంభించడానికి: {firstInstruction}',
    conditionsTemplate: 'దాని ఆధారంగా, నేను మీ అభ్యాసాన్ని వీటిపై కేంద్రీకరిస్తాను: {conditions}. రొటీన్ పేజీకి వెళ్లండి — ఆ వర్గాలు మీ రూపొందించిన క్రమంలో ఇప్పటికే ప్రాధాన్యత పొందుతాయి.'
  }
}

// ── FAQ: keywords stay in the target language, response text is localized ──
export const FAQ_BY_LANG = {
  'en-IN': [
    { keywords: ['hello', 'hi', 'hey', 'namaste', 'yo'], response: "Namaste 🙏 I'm your YogaVedic assistant. Ask me about a pose (e.g. \"benefits of Tree Pose\"), how the app works, or tell me a goal like \"I have back pain\" and I'll point you to the right routine." },
    { keywords: ['camera', 'privacy', 'video', 'webcam', 'record', 'upload'], response: 'Your camera feed is processed entirely in your browser using MediaPipe — nothing is ever uploaded or stored on a server.' },
    { keywords: ['how does this work', 'how it works', 'how do you work', 'what is this'], response: 'Point your webcam at yourself, pick or build a routine, and pose detection tracks 33 body landmarks in real time — for supported poses, you get spoken alignment corrections as you practice.' },
    { keywords: ['injury', 'hurt', 'sharp pain', 'safe', 'safety', 'pregnant'], response: "If a pose causes sharp pain, stop immediately and rest in Child's Pose. This app gives general alignment guidance, not medical advice — please check with a doctor first if you have an existing injury or condition." },
    { keywords: ['voice', 'speak', 'mute', 'sound', 'coach talk'], response: 'You can toggle the voice coach on or off any time from the panel during a session.' },
    { keywords: ['voice command', 'hands free', 'say next', 'say pause'], response: 'Turn on "Voice Commands" during a session and try saying "next", "pause", "resume", or "repeat" — no clicking needed.' },
    { keywords: ['price', 'cost', 'free', 'subscription', 'pay'], response: 'YogaVedic is completely free to use.' },
    { keywords: ['language', 'hindi', 'kannada', 'tamil', 'telugu'], response: 'You can switch the coaching language from the selector at the top of the app — English, Hindi, Kannada, Tamil, and Telugu are supported.' }
  ],
  'hi-IN': [
    { keywords: ['नमस्ते', 'हैलो', 'हाय'], response: 'नमस्ते 🙏 मैं आपका योगवैदिक सहायक हूं। किसी आसन के बारे में पूछें (जैसे "ट्री पोज़ के फायदे"), ऐप कैसे काम करता है जानें, या "मुझे कमर दर्द है" जैसा कोई लक्ष्य बताएं — मैं आपको सही रूटीन बताऊंगा।' },
    { keywords: ['कैमरा', 'प्राइवेसी', 'वीडियो', 'वेबकैम', 'रिकॉर्ड', 'अपलोड'], response: 'आपकी कैमरा फीड पूरी तरह से आपके ब्राउज़र में MediaPipe का उपयोग करके प्रोसेस होती है — कुछ भी सर्वर पर अपलोड या स्टोर नहीं होता।' },
    { keywords: ['यह कैसे काम करता है', 'कैसे काम करता है', 'यह क्या है'], response: 'अपना वेबकैम खुद पर लगाएं, कोई रूटीन चुनें या बनाएं, और पोज़ डिटेक्शन 33 शरीर के बिंदुओं को रीयल टाइम में ट्रैक करता है — समर्थित आसनों के लिए अभ्यास के दौरान बोलकर सुधार बताता है।' },
    { keywords: ['चोट', 'दर्द', 'तेज दर्द', 'सुरक्षित', 'सुरक्षा', 'गर्भवती'], response: 'अगर किसी आसन से तेज दर्द हो, तो तुरंत रुकें और बालासन में आराम करें। यह ऐप सामान्य मार्गदर्शन देता है, चिकित्सा सलाह नहीं — मौजूदा चोट या स्थिति होने पर पहले डॉक्टर से सलाह लें।' },
    { keywords: ['आवाज़', 'बोलना', 'म्यूट', 'ध्वनि', 'कोच बोलता'], response: 'आप सत्र के दौरान पैनल से कभी भी आवाज़ कोच को चालू या बंद कर सकते हैं।' },
    { keywords: ['वॉइस कमांड', 'हैंड्स फ्री', 'नेक्स्ट बोलें', 'पॉज़ बोलें'], response: 'सत्र के दौरान "वॉइस कमांड्स" चालू करें और "नेक्स्ट", "पॉज़", "रिज़्यूम", या "रिपीट" बोलकर देखें — क्लिक करने की जरूरत नहीं।' },
    { keywords: ['कीमत', 'खर्च', 'मुफ्त', 'सब्सक्रिप्शन', 'भुगतान'], response: 'योगवैदिक उपयोग करने के लिए पूरी तरह मुफ्त है।' },
    { keywords: ['भाषा', 'हिंदी', 'कन्नड़', 'तमिल', 'तेलुगु'], response: 'आप ऐप के ऊपर मौजूद सिलेक्टर से कोचिंग भाषा बदल सकते हैं — अंग्रेज़ी, हिंदी, कन्नड़, तमिल और तेलुगु उपलब्ध हैं।' }
  ],
  'kn-IN': [
    { keywords: ['ನಮಸ್ತೆ', 'ಹಲೋ', 'ಹಾಯ್'], response: 'ನಮಸ್ತೆ 🙏 ನಾನು ನಿಮ್ಮ ಯೋಗವೈದಿಕ್ ಸಹಾಯಕ. ಒಂದು ಆಸನದ ಬಗ್ಗೆ ಕೇಳಿ (ಉದಾ. "ಟ್ರೀ ಪೋಸ್ ಪ್ರಯೋಜನಗಳು"), ಆ್ಯಪ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ತಿಳಿಯಿರಿ, ಅಥವಾ "ನನಗೆ ಬೆನ್ನು ನೋವಿದೆ" ಎಂಬಂತಹ ಗುರಿ ಹೇಳಿ — ನಾನು ಸರಿಯಾದ ರೂಟೀನ್ ತೋರಿಸುತ್ತೇನೆ.' },
    { keywords: ['ಕ್ಯಾಮೆರಾ', 'ಪ್ರೈವಸಿ', 'ವೀಡಿಯೊ', 'ವೆಬ್‌ಕ್ಯಾಮ್', 'ರೆಕಾರ್ಡ್', 'ಅಪ್‌ಲೋಡ್'], response: 'ನಿಮ್ಮ ಕ್ಯಾಮೆರಾ ಫೀಡ್ ಸಂಪೂರ್ಣವಾಗಿ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ MediaPipe ಬಳಸಿ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ — ಏನೂ ಸರ್ವರ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಅಥವಾ ಸಂಗ್ರಹಿಸಲ್ಪಡುವುದಿಲ್ಲ.' },
    { keywords: ['ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'ಇದು ಏನು'], response: 'ನಿಮ್ಮ ವೆಬ್‌ಕ್ಯಾಮ್ ಅನ್ನು ನಿಮ್ಮ ಕಡೆ ತೋರಿಸಿ, ರೂಟೀನ್ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ರಚಿಸಿ, ಮತ್ತು ಪೋಸ್ ಡಿಟೆಕ್ಷನ್ 33 ದೇಹದ ಬಿಂದುಗಳನ್ನು ರಿಯಲ್ ಟೈಮ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ — ಬೆಂಬಲಿತ ಭಂಗಿಗಳಿಗೆ ಅಭ್ಯಾಸದ ಸಮಯದಲ್ಲಿ ಧ್ವನಿ ಮೂಲಕ ತಿದ್ದುಪಡಿ ನೀಡುತ್ತದೆ.' },
    { keywords: ['ಗಾಯ', 'ನೋವು', 'ತೀವ್ರ ನೋವು', 'ಸುರಕ್ಷಿತ', 'ಸುರಕ್ಷತೆ', 'ಗರ್ಭಿಣಿ'], response: 'ಒಂದು ಆಸನದಿಂದ ತೀವ್ರ ನೋವು ಬಂದರೆ, ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ ಮತ್ತು ಬಾಲಾಸನದಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ. ಈ ಆ್ಯಪ್ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ, ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ — ಇರುವ ಗಾಯ ಅಥವಾ ಸ್ಥಿತಿ ಇದ್ದರೆ ಮೊದಲು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.' },
    { keywords: ['ಧ್ವನಿ', 'ಮಾತಾಡು', 'ಮ್ಯೂಟ್', 'ಸೌಂಡ್', 'ಕೋಚ್ ಮಾತಾಡು'], response: 'ಅಧಿವೇಶನದ ಸಮಯದಲ್ಲಿ ಪ್ಯಾನೆಲ್‌ನಿಂದ ಯಾವಾಗ ಬೇಕಾದರೂ ಧ್ವನಿ ಕೋಚ್ ಆನ್/ಆಫ್ ಮಾಡಬಹುದು.' },
    { keywords: ['ವಾಯ್ಸ್ ಕಮಾಂಡ್', 'ಹ್ಯಾಂಡ್ಸ್ ಫ್ರೀ', 'ನೆಕ್ಸ್ಟ್ ಹೇಳಿ', 'ಪಾಸ್ ಹೇಳಿ'], response: 'ಅಧಿವೇಶನದಲ್ಲಿ "ವಾಯ್ಸ್ ಕಮಾಂಡ್ಸ್" ಆನ್ ಮಾಡಿ ಮತ್ತು "ನೆಕ್ಸ್ಟ್", "ಪಾಸ್", "ರೆಸ್ಯೂಮ್", ಅಥವಾ "ರಿಪೀಟ್" ಎಂದು ಹೇಳಿ ನೋಡಿ — ಕ್ಲಿಕ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ.' },
    { keywords: ['ಬೆಲೆ', 'ಖರ್ಚು', 'ಉಚಿತ', 'ಸಬ್‌ಸ್ಕ್ರಿಪ್ಷನ್', 'ಪಾವತಿ'], response: 'ಯೋಗವೈದಿಕ್ ಬಳಸಲು ಸಂಪೂರ್ಣ ಉಚಿತ.' },
    { keywords: ['ಭಾಷೆ', 'ಹಿಂದಿ', 'ಕನ್ನಡ', 'ತಮಿಳು', 'ತೆಲುಗು'], response: 'ಆ್ಯಪ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿರುವ ಸೆಲೆಕ್ಟರ್‌ನಿಂದ ನೀವು ಕೋಚಿಂಗ್ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು — ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಕನ್ನಡ, ತಮಿಳು ಮತ್ತು ತೆಲುಗು ಬೆಂಬಲಿತವಾಗಿವೆ.' }
  ],
  'ta-IN': [
    { keywords: ['நமஸ்தே', 'ஹலோ', 'ஹாய்'], response: 'நமஸ்தே 🙏 நான் உங்கள் யோகவேதிக் உதவியாளர். ஒரு ஆசனத்தைப் பற்றி கேளுங்கள் (எ.கா. "ட்ரீ போஸ் நன்மைகள்"), ஆப் எப்படி வேலை செய்கிறது தெரிந்துகொள்ளுங்கள், அல்லது "எனக்கு முதுகு வலி" போன்ற இலக்கைச் சொல்லுங்கள் — நான் சரியான ரூட்டீனைக் காண்பிப்பேன்.' },
    { keywords: ['கேமரா', 'தனியுரிமை', 'வீடியோ', 'வெப்கேம்', 'பதிவு', 'பதிவேற்றம்'], response: 'உங்கள் கேமரா ஃபீட் முழுவதுமாக உங்கள் பிரவுசரில் MediaPipe பயன்படுத்தி செயலாக்கப்படுகிறது — எதுவும் சர்வரில் பதிவேற்றப்படாது அல்லது சேமிக்கப்படாது.' },
    { keywords: ['இது எப்படி வேலை செய்கிறது', 'இது என்ன'], response: 'உங்கள் வெப்கேமை உங்கள் மீது காட்டுங்கள், ரூட்டீனைத் தேர்ந்தெடுக்கவும் அல்லது உருவாக்கவும், போஸ் டிடெக்ஷன் 33 உடல் புள்ளிகளை நிகழ்நேரத்தில் கண்காணிக்கிறது — ஆதரிக்கப்படும் ஆசனங்களுக்குப் பயிற்சியின்போது குரல் மூலம் திருத்தங்களை வழங்குகிறது.' },
    { keywords: ['காயம்', 'வலி', 'கடுமையான வலி', 'பாதுகாப்பு', 'கர்ப்பம்'], response: 'ஒரு ஆசனத்தால் கடுமையான வலி ஏற்பட்டால், உடனடியாக நிறுத்தி சிசு ஆசனத்தில் ஓய்வெடுக்கவும். இந்த ஆப் பொது வழிகாட்டுதலை வழங்குகிறது, மருத்துவ ஆலோசனை அல்ல — ஏற்கனவே காயம் அல்லது நிலை இருந்தால் முதலில் மருத்துவரிடம் ஆலோசிக்கவும்.' },
    { keywords: ['குரல்', 'பேச', 'மியூட்', 'ஒலி', 'கோச் பேசுவது'], response: 'அமர்வின்போது பேனலில் இருந்து குரல் பயிற்சியாளரை எப்போது வேண்டுமானாலும் ஆன்/ஆஃப் செய்யலாம்.' },
    { keywords: ['குரல் கட்டளை', 'ஹேண்ட்ஸ் ஃப்ரீ', 'நெக்ஸ்ட் சொல்', 'பாஸ் சொல்'], response: 'அமர்வின்போது "குரல் கட்டளைகள்" ஆன் செய்து "நெக்ஸ்ட்", "பாஸ்", "ரெஸ்யூம்", அல்லது "ரிபீட்" என்று சொல்லிப் பாருங்கள் — கிளிக் செய்ய வேண்டாம்.' },
    { keywords: ['விலை', 'செலவு', 'இலவசம்', 'சந்தா', 'கட்டணம்'], response: 'யோகவேதிக் முற்றிலும் இலவசமாகப் பயன்படுத்தலாம்.' },
    { keywords: ['மொழி', 'ஹிந்தி', 'கன்னடம்', 'தமிழ்', 'தெலுங்கு'], response: 'ஆப்பின் மேலே உள்ள செலக்டரில் இருந்து பயிற்சி மொழியை மாற்றலாம் — ஆங்கிலம், ஹிந்தி, கன்னடம், தமிழ் மற்றும் தெலுங்கு ஆதரிக்கப்படுகின்றன.' }
  ],
  'te-IN': [
    { keywords: ['నమస్తే', 'హలో', 'హాయ్'], response: 'నమస్తే 🙏 నేను మీ యోగవేదిక్ సహాయకుడిని. ఒక ఆసనం గురించి అడగండి (ఉదా. "ట్రీ పోజ్ ప్రయోజనాలు"), యాప్ ఎలా పనిచేస్తుందో తెలుసుకోండి, లేదా "నాకు వెన్నునొప్పి ఉంది" వంటి లక్ష్యం చెప్పండి — నేను సరైన రొటీన్‌ను చూపిస్తాను.' },
    { keywords: ['కెమెరా', 'గోప్యత', 'వీడియో', 'వెబ్‌క్యామ్', 'రికార్డ్', 'అప్‌లోడ్'], response: 'మీ కెమెరా ఫీడ్ పూర్తిగా మీ బ్రౌజర్‌లో MediaPipe ఉపయోగించి ప్రాసెస్ అవుతుంది — ఏదీ సర్వర్‌కు అప్‌లోడ్ లేదా నిల్వ చేయబడదు.' },
    { keywords: ['ఇది ఎలా పనిచేస్తుంది', 'ఇది ఏమిటి'], response: 'మీ వెబ్‌క్యామ్‌ను మీ వైపు చూపించండి, రొటీన్‌ను ఎంచుకోండి లేదా సృష్టించండి, మరియు పోజ్ డిటెక్షన్ 33 శరీర పాయింట్లను రియల్ టైమ్‌లో ట్రాక్ చేస్తుంది — మద్దతు ఉన్న ఆసనాలకు అభ్యాసం సమయంలో వాయిస్ ద్వారా సరిదిద్దుబాట్లు ఇస్తుంది.' },
    { keywords: ['గాయం', 'నొప్పి', 'తీవ్రమైన నొప్పి', 'సురక్షితం', 'గర్భం'], response: 'ఏదైనా ఆసనం వల్ల తీవ్రమైన నొప్పి వస్తే, వెంటనే ఆపి బాలాసనంలో విశ్రాంతి తీసుకోండి. ఈ యాప్ సాధారణ మార్గదర్శకత్వం ఇస్తుంది, వైద్య సలహా కాదు — ఇప్పటికే గాయం లేదా పరిస్థితి ఉంటే మొదట వైద్యుడిని సంప్రదించండి.' },
    { keywords: ['వాయిస్', 'మాట్లాడటం', 'మ్యూట్', 'సౌండ్', 'కోచ్ మాట్లాడటం'], response: 'సెషన్ సమయంలో ప్యానెల్ నుండి ఎప్పుడైనా వాయిస్ కోచ్‌ను ఆన్/ఆఫ్ చేయవచ్చు.' },
    { keywords: ['వాయిస్ కమాండ్', 'హ్యాండ్స్ ఫ్రీ', 'నెక్స్ట్ చెప్పండి', 'పాజ్ చెప్పండి'], response: 'సెషన్ సమయంలో "వాయిస్ కమాండ్స్" ఆన్ చేసి "నెక్స్ట్", "పాజ్", "రెస్యూమ్", లేదా "రిపీట్" అని చెప్పి చూడండి — క్లిక్ చేయాల్సిన అవసరం లేదు.' },
    { keywords: ['ధర', 'ఖర్చు', 'ఉచితం', 'సబ్‌స్క్రిప్షన్', 'చెల్లింపు'], response: 'యోగవేదిక్ పూర్తిగా ఉచితంగా ఉపయోగించవచ్చు.' },
    { keywords: ['భాష', 'హిందీ', 'కన్నడ', 'తమిళం', 'తెలుగు'], response: 'యాప్ పైభాగంలోని సెలెక్టర్ నుండి మీరు కోచింగ్ భాషను మార్చుకోవచ్చు — ఇంగ్లీష్, హిందీ, కన్నడ, తమిళం మరియు తెలుగు మద్దతు ఉంది.' }
  ]
}

// ── Voice commands (spoken during a live session) ──────────────────────────
export const VOICE_COMMAND_PATTERNS_BY_LANG = {
  'en-IN': {
    next: ['next pose', 'next', 'skip this', 'skip'],
    pause: ['pause', 'wait a second', 'hold on'],
    resume: ['resume', 'continue', 'start again', 'go on'],
    repeat: ['repeat', 'say that again', 'what did you say', 'say again'],
    exit: ['exit', 'end session', 'stop session', 'quit session']
  },
  'hi-IN': {
    next: ['अगला आसन', 'अगला', 'इसे छोड़ो', 'स्किप'],
    pause: ['रुको', 'एक सेकंड रुको', 'रुक जाओ'],
    resume: ['जारी रखो', 'फिर से शुरू', 'आगे बढ़ो'],
    repeat: ['दोहराओ', 'फिर से बोलो', 'क्या कहा'],
    exit: ['बाहर निकलो', 'सत्र समाप्त करो', 'सत्र रोको']
  },
  'kn-IN': {
    next: ['ಮುಂದಿನ ಆಸನ', 'ಮುಂದೆ', 'ಇದನ್ನು ಬಿಟ್ಟುಬಿಡು', 'ಸ್ಕಿಪ್'],
    pause: ['ನಿಲ್ಲಿಸು', 'ಒಂದು ಕ್ಷಣ ನಿಲ್ಲಿಸು', 'ವಿರಮಿಸು'],
    resume: ['ಮುಂದುವರಿಸು', 'ಮತ್ತೆ ಶುರು ಮಾಡು', 'ಮುಂದೆ ಹೋಗು'],
    repeat: ['ಪುನರಾವರ್ತಿಸು', 'ಮತ್ತೆ ಹೇಳು', 'ಏನು ಹೇಳಿದೆ'],
    exit: ['ನಿರ್ಗಮಿಸು', 'ಅಧಿವೇಶನ ಮುಗಿಸು', 'ಅಧಿವೇಶನ ನಿಲ್ಲಿಸು']
  },
  'ta-IN': {
    next: ['அடுத்த ஆசனம்', 'அடுத்து', 'இதைத் தவிர்', 'ஸ்கிப்'],
    pause: ['நிறுத்து', 'ஒரு நொடி காத்திரு', 'இடைநிறுத்து'],
    resume: ['தொடரவும்', 'மீண்டும் தொடங்கு', 'தொடர்ந்து செல்'],
    repeat: ['மீண்டும் சொல்', 'மறுபடி சொல்', 'என்ன சொன்னாய்'],
    exit: ['வெளியேறு', 'அமர்வை முடி', 'அமர்வை நிறுத்து']
  },
  'te-IN': {
    next: ['తరువాతి ఆసనం', 'తరువాత', 'దీన్ని దాటవేయి', 'స్కిప్'],
    pause: ['ఆపు', 'ఒక్క క్షణం ఆగు', 'పాజ్ చేయి'],
    resume: ['కొనసాగించు', 'మళ్లీ ప్రారంభించు', 'ముందుకు వెళ్లు'],
    repeat: ['మళ్లీ చెప్పు', 'మరలా చెప్పు', 'ఏమి చెప్పావు'],
    exit: ['నిష్క్రమించు', 'సెషన్ ముగించు', 'సెషన్ ఆపు']
  }
}

export function withFallback(map, langCode) {
  return map[langCode] || map['en-IN']
}
