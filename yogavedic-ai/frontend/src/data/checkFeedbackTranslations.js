// Check Feedback Translations — YogaVedic
// routines.js defines biomechanical checks (spine alignment, knee angle, etc.)
// with English ok/off feedback baked in. Rather than forking the pose data
// file into 5 languages, we translate by checkId here and let
// languageService.translateCheckFeedback() swap in the localized string at
// render/speak time. This keeps routines.js as the single source of truth
// for thresholds while feedback text stays fully localized.

export const CHECK_FEEDBACK = {
  spine_alignment: {
    'en-IN': { ok: 'Excellent posture — spine nicely aligned.', off: 'Straighten your back, stack shoulders over hips.' },
    'hi-IN': { ok: 'बहुत बढ़िया मुद्रा — रीढ़ की हड्डी सीधी है।', off: 'अपनी पीठ सीधी करें, कंधों को कूल्हों के ऊपर रखें।' },
    'kn-IN': { ok: 'ಅತ್ಯುತ್ತಮ ಭಂಗಿ — ಬೆನ್ನುಮೂಳೆ ಸರಿಯಾಗಿ ಜೋಡಿಸಲ್ಪಟ್ಟಿದೆ.', off: 'ನಿಮ್ಮ ಬೆನ್ನನ್ನು ನೇರವಾಗಿಸಿ, ಭುಜಗಳನ್ನು ಸೊಂಟದ ಮೇಲೆ ಇರಿಸಿ.' },
    'ta-IN': { ok: 'அருமையான தோரணை — முதுகெலும்பு சீராக உள்ளது.', off: 'உங்கள் முதுகை நேராக்குங்கள், தோள்களை இடுப்புக்கு மேல் வையுங்கள்.' },
    'te-IN': { ok: 'అద్భుతమైన భంగిమ — వెన్నెముక సరిగ్గా అమర్చబడింది.', off: 'మీ వీపును నేరుగా చేయండి, భుజాలను తుంటిపై ఉంచండి.' }
  },
  shoulder_level: {
    'en-IN': { ok: 'Shoulders are level — nice and relaxed.', off: 'Even out your shoulders, avoid leaning to one side.' },
    'hi-IN': { ok: 'कंधे समान स्तर पर हैं — आराम से।', off: 'अपने कंधों को बराबर करें, एक तरफ झुकने से बचें।' },
    'kn-IN': { ok: 'ಭುಜಗಳು ಸಮಮಟ್ಟದಲ್ಲಿವೆ — ಆರಾಮವಾಗಿದೆ.', off: 'ನಿಮ್ಮ ಭುಜಗಳನ್ನು ಸಮಗೊಳಿಸಿ, ಒಂದು ಬದಿಗೆ ವಾಲಬೇಡಿ.' },
    'ta-IN': { ok: 'தோள்கள் சமமாக உள்ளன — நன்றாக தளர்வாக உள்ளது.', off: 'உங்கள் தோள்களை சமன் செய்யுங்கள், ஒரு பக்கம் சாயாதீர்கள்.' },
    'te-IN': { ok: 'భుజాలు సమంగా ఉన్నాయి — బాగా రిలాక్స్‌గా ఉంది.', off: 'మీ భుజాలను సమం చేయండి, ఒక వైపుకు వంగకండి.' }
  },
  standing_leg_straight: {
    'en-IN': { ok: 'Standing leg is strong and straight.', off: 'Straighten your standing leg a little more for stability.' },
    'hi-IN': { ok: 'खड़ा पैर मजबूत और सीधा है।', off: 'स्थिरता के लिए अपने खड़े पैर को थोड़ा और सीधा करें।' },
    'kn-IN': { ok: 'ನಿಲ್ಲುವ ಕಾಲು ಬಲವಾಗಿ ಮತ್ತು ನೇರವಾಗಿದೆ.', off: 'ಸ್ಥಿರತೆಗಾಗಿ ನಿಮ್ಮ ನಿಲ್ಲುವ ಕಾಲನ್ನು ಸ್ವಲ್ಪ ಹೆಚ್ಚು ನೇರಗೊಳಿಸಿ.' },
    'ta-IN': { ok: 'நிற்கும் கால் வலுவாகவும் நேராகவும் உள்ளது.', off: 'நிலைத்தன்மைக்காக நிற்கும் காலை இன்னும் சிறிது நேராக்குங்கள்.' },
    'te-IN': { ok: 'నిలిచిన కాలు బలంగా మరియు నేరుగా ఉంది.', off: 'స్థిరత్వం కోసం నిలిచిన కాలును మరికొంచెం నేరుగా చేయండి.' }
  },
  raised_knee_height: {
    'en-IN': { ok: 'Raised knee position looks balanced.', off: 'Press your raised foot higher onto the standing leg.' },
    'hi-IN': { ok: 'उठाए गए घुटने की स्थिति संतुलित दिख रही है।', off: 'अपने उठे हुए पैर को खड़े पैर पर और ऊंचा दबाएं।' },
    'kn-IN': { ok: 'ಎತ್ತಿದ ಮೊಣಕಾಲಿನ ಸ್ಥಾನ ಸಮತೋಲಿತವಾಗಿ ಕಾಣುತ್ತದೆ.', off: 'ನಿಮ್ಮ ಎತ್ತಿದ ಪಾದವನ್ನು ನಿಲ್ಲುವ ಕಾಲಿನ ಮೇಲೆ ಇನ್ನೂ ಎತ್ತರಕ್ಕೆ ಒತ್ತಿರಿ.' },
    'ta-IN': { ok: 'உயர்த்தப்பட்ட முழங்கால் நிலை சமநிலையாக உள்ளது.', off: 'உயர்த்திய பாதத்தை நிற்கும் காலில் இன்னும் உயரமாக அழுத்துங்கள்.' },
    'te-IN': { ok: 'ఎత్తిన మోకాలి స్థానం సమతుల్యంగా ఉంది.', off: 'ఎత్తిన పాదాన్ని నిలిచిన కాలుపై మరింత ఎత్తుగా నొక్కండి.' }
  },
  front_knee_angle: {
    'en-IN': { ok: 'Front knee angle looks strong, right around 90°.', off: 'Bend your front knee closer to a right angle.' },
    'hi-IN': { ok: 'आगे का घुटना सही कोण पर है, लगभग 90°।', off: 'अपने आगे के घुटने को सीधे कोण के करीब मोड़ें।' },
    'kn-IN': { ok: 'ಮುಂದಿನ ಮೊಣಕಾಲಿನ ಕೋನ ಬಲವಾಗಿ ಕಾಣುತ್ತದೆ, ಸುಮಾರು 90°.', off: 'ನಿಮ್ಮ ಮುಂದಿನ ಮೊಣಕಾಲನ್ನು ಲಂಬಕೋನಕ್ಕೆ ಹತ್ತಿರ ಬಾಗಿಸಿ.' },
    'ta-IN': { ok: 'முன் முழங்கால் கோணம் வலுவாக உள்ளது, 90° அருகில்.', off: 'உங்கள் முன் முழங்காலை செங்கோணத்திற்கு நெருக்கமாக வளைக்கவும்.' },
    'te-IN': { ok: 'ముందు మోకాలి కోణం బలంగా ఉంది, దాదాపు 90°.', off: 'మీ ముందు మోకాలిని లంబకోణానికి దగ్గరగా వంచండి.' }
  },
  arms_extended: {
    'en-IN': { ok: 'Arms are extended in a strong line.', off: 'Stretch both arms out fully to shoulder height.' },
    'hi-IN': { ok: 'दोनों हाथ एक मजबूत सीध में फैले हैं।', off: 'दोनों हाथों को कंधे की ऊंचाई तक पूरी तरह फैलाएं।' },
    'kn-IN': { ok: 'ಕೈಗಳು ಬಲವಾದ ಸರಳ ರೇಖೆಯಲ್ಲಿ ವಿಸ್ತರಿಸಲ್ಪಟ್ಟಿವೆ.', off: 'ಎರಡೂ ಕೈಗಳನ್ನು ಭುಜದ ಎತ್ತರಕ್ಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಚಾಚಿ.' },
    'ta-IN': { ok: 'கைகள் ஒரு வலுவான கோட்டில் நீட்டப்பட்டுள்ளன.', off: 'இரு கைகளையும் தோள் உயரத்திற்கு முழுவதுமாக நீட்டுங்கள்.' },
    'te-IN': { ok: 'చేతులు బలమైన రేఖలో చాచబడ్డాయి.', off: 'రెండు చేతులను భుజం ఎత్తు వరకు పూర్తిగా చాచండి.' }
  },
  front_leg_straight: {
    'en-IN': { ok: 'Front leg is straight and strong.', off: 'Keep your front leg straight, avoid bending the knee.' },
    'hi-IN': { ok: 'आगे का पैर सीधा और मजबूत है।', off: 'अपने आगे के पैर को सीधा रखें, घुटना न मोड़ें।' },
    'kn-IN': { ok: 'ಮುಂದಿನ ಕಾಲು ನೇರವಾಗಿ ಮತ್ತು ಬಲವಾಗಿದೆ.', off: 'ನಿಮ್ಮ ಮುಂದಿನ ಕಾಲನ್ನು ನೇರವಾಗಿರಿಸಿ, ಮೊಣಕಾಲನ್ನು ಬಾಗಿಸಬೇಡಿ.' },
    'ta-IN': { ok: 'முன் கால் நேராகவும் வலுவாகவும் உள்ளது.', off: 'உங்கள் முன் காலை நேராக வையுங்கள், முழங்காலை வளைக்க வேண்டாம்.' },
    'te-IN': { ok: 'ముందు కాలు నేరుగా మరియు బలంగా ఉంది.', off: 'మీ ముందు కాలును నేరుగా ఉంచండి, మోకాలిని వంచకండి.' }
  },
  top_arm_raised: {
    'en-IN': { ok: 'Top arm is reaching nicely toward the ceiling.', off: 'Raise your top arm higher, stack it over the shoulder.' },
    'hi-IN': { ok: 'ऊपरी हाथ छत की ओर अच्छी तरह पहुंच रहा है।', off: 'अपने ऊपरी हाथ को और ऊंचा उठाएं, कंधे के ऊपर रखें।' },
    'kn-IN': { ok: 'ಮೇಲಿನ ಕೈ ಚಾವಣಿಯ ಕಡೆಗೆ ಚೆನ್ನಾಗಿ ತಲುಪುತ್ತಿದೆ.', off: 'ನಿಮ್ಮ ಮೇಲಿನ ಕೈಯನ್ನು ಇನ್ನೂ ಎತ್ತರಕ್ಕೆ ಎತ್ತಿ, ಭುಜದ ಮೇಲೆ ಇರಿಸಿ.' },
    'ta-IN': { ok: 'மேல் கை கூரையை நோக்கி நன்றாக நீள்கிறது.', off: 'உங்கள் மேல் கையை இன்னும் உயரமாக தூக்குங்கள், தோளுக்கு மேல் வையுங்கள்.' },
    'te-IN': { ok: 'పై చేయి పైకప్పు వైపు బాగా చేరుకుంటోంది.', off: 'మీ పై చేతిని మరింత పైకి లేపండి, భుజంపై ఉంచండి.' }
  },
  seated_spine: {
    'en-IN': { ok: 'Spine is tall — lovely, steady breath.', off: 'Lift your chest, lengthen the spine a touch more.' },
    'hi-IN': { ok: 'रीढ़ ऊंची है — सुंदर, स्थिर सांस।', off: 'अपनी छाती ऊंची करें, रीढ़ को थोड़ा और लंबा करें।' },
    'kn-IN': { ok: 'ಬೆನ್ನುಮೂಳೆ ಎತ್ತರವಾಗಿದೆ — ಸುಂದರ, ಸ್ಥಿರ ಉಸಿರಾಟ.', off: 'ನಿಮ್ಮ ಎದೆಯನ್ನು ಎತ್ತಿ, ಬೆನ್ನುಮೂಳೆಯನ್ನು ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಉದ್ದಗೊಳಿಸಿ.' },
    'ta-IN': { ok: 'முதுகெலும்பு உயரமாக உள்ளது — அழகான, நிலையான மூச்சு.', off: 'உங்கள் மார்பை உயர்த்துங்கள், முதுகெலும்பை இன்னும் சிறிது நீட்டுங்கள்.' },
    'te-IN': { ok: 'వెన్నెముక ఎత్తుగా ఉంది — అందమైన, స్థిరమైన శ్వాస.', off: 'మీ చాతిని పైకి లేపండి, వెన్నెముకను మరికొంచెం పొడిగించండి.' }
  }
}

// Returns the localized { ok, off } feedback pair for a checkId, falling
// back to English if a translation is missing (should never happen for the
// 9 checks above, but keeps things safe if routines.js gains new checks).
export function getLocalizedCheckFeedback(checkId, langCode, fallback) {
  const entry = CHECK_FEEDBACK[checkId]
  if (!entry) return fallback
  return entry[langCode] || entry['en-IN'] || fallback
}
