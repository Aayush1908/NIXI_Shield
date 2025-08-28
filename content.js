const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlx_NbWONz1DjPLkwgSrHJRjhK8khnEvS3dD4gSHCO92zFLc7oRaUBOa5GevB9i4lB7w/exec"; 
const currentDomain = new URL(window.location.href).hostname;

// Translations for banner warning
const translations = {
  en: "⚠️ WARNING: This site may be dangerous!",
  hi: "⚠️ चेतावनी: यह साइट खतरनाक हो सकती है!",
  bn: "⚠️ সতর্কতা: এই সাইটটি বিপজ্জনক হতে পারে!",
  ta: "⚠️ எச்சரிக்கை: இந்த தளம் ஆபத்தானதாக இருக்கலாம்!",
  te: "⚠️ హెచ్చరిక: ఈ సైట్ ప్రమాదకరంగా ఉండవచ్చు!",
  mr: "⚠️ इशारा: ही साईट धोकादायक असू शकते!",
  gu: "⚠️ ચેતવણી: આ સાઇટ જોખમી હોઈ શકે છે!",
  kn: "⚠️ ಎಚ್ಚರಿಕೆ: ಈ ಸೈಟ್ ಅಪಾಯಕಾರಿಯಾಗಿ ಇರಬಹುದು!",
  ml: "⚠️ മുന്നറിയിപ്പ്: ഈ സൈറ്റ് അപകടകരമായതാകാം!",
  pa: "⚠️ ਚੇਤਾਵਨੀ: ਇਹ ਸਾਈਟ ਖ਼ਤਰਨਾਕ ਹੋ ਸਕਦੀ ਹੈ!",
  or: "⚠️ ସତର୍କବାଣୀ: ଏହି ସାଇଟ୍ ବିପଜ୍ଜନକ ହୋଇପାରେ!"
};

const langVoiceMap = {
  hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN",
  mr: "mr-IN", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN",
  pa: "pa-IN", or: "or-IN", en: "en-IN"
};

const userLang = navigator.language.slice(0, 2);
const warningText = translations[userLang] || translations["en"];
const speakText = warningText.replace(/^⚠️\s*/, "").replace(/!+$/, "");
const voiceLang = langVoiceMap[userLang] || "en-IN";

// Create warning banner
const banner = document.createElement("div");
banner.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: darkred;
  color: white;
  font-size: 16px;
  font-weight: bold;
  z-index: 9999;
  box-sizing: border-box;
  font-family: sans-serif;
`;

// Warning text container
const textContainer = document.createElement("div");
textContainer.style.flex = "1";
textContainer.style.whiteSpace = "nowrap";
textContainer.style.overflow = "hidden";
textContainer.style.textOverflow = "ellipsis";
textContainer.textContent = warningText;

// Speaker button
const speakerBtn = document.createElement("button");
speakerBtn.innerHTML = "🔊";
speakerBtn.title = "Hear Warning";
speakerBtn.style.cssText = `
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
`;
speakerBtn.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(speakText);
  utterance.lang = voiceLang;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

// Add elements
banner.appendChild(textContainer);
banner.appendChild(speakerBtn);

function updateSeverity(count) {
  let severity = "🟢 Low Risk";
  let color = "#006400";

  if (count > 5) {
    severity = "🔴 Dangerous";
    color = "#ff4d4d";
    document.body.style.backgroundColor = "#e40b0bff"; // full red overlay
    document.body.prepend(banner);
  } else if (count >=2) {
    severity = "🟠 Suspicious";
    color = "#ef9e07ff";
    document.body.prepend(banner);
  }

  banner.style.backgroundColor = color;
  textContainer.textContent = `${warningText} (${severity}, ${count} reports)`;
  }


// Fetch count
fetch(`${SCRIPT_URL}?domain=${encodeURIComponent(currentDomain)}`)
  .then(res => res.json())
  .then(data => {
    const count = data.count || 0;
    updateSeverity(count);
  })
  .catch(err => {
    console.error("Error fetching report count:", err);
  });
