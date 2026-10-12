/**
 * MunafaMandi - Core Logic & Data Engine
 * Features:
 * - Tab-based Navigation Architecture (Advisor, Comparison Chart, All 15 Mandis, 7-Day Risk ML, Help FAQ)
 * - 15 Patiala District Mandis Dataset
 * - Full Multilingual Translation System: Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), English (EN)
 * - Vehicle & Load Cost Logistics Engine (OSRM road model)
 * - APMC Fee & Labor Calculation (Punjab Mandi Board rules)
 * - LightGBM & Prophet 7-day Risk Direction & Arrival-Surge Flags
 * - Interactive Chart.js Crossing Bars
 * - Native Voice ASR (Hindi, Punjabi, English) + TTS Read-Aloud
 */

// 1. Language Translations Dictionary
const TRANSLATIONS = {
  hi: {
    tagline: "असली कमाई, सिर्फ लिस्टेड दाम नहीं",
    live: "लाइव मंडी भाव",
    offline: "ऑफ़लाइन मोड",
    tabAdvisor: "मुनाफ़ा कैलकुलेटर",
    tabCompare: "भाव vs शुद्ध कमाई ग्राफ",
    tabAllMandis: "सभी 15 मंडियां",
    tabRisk: "7-दिन रुझान & आवक",
    tabFAQ: "मदद व जानकारी",
    bannerHeroTitle: "दिखाया गया दाम सिर्फ भाव है, असल कमाई वह है जो जेब में बचे!",
    bannerHeroDesc: "दूर की मंडी में ₹30-40 ज्यादा दिखे तो भी मत जाइए! पहले रोड का भाड़ा और मंडी खर्च घटाकर शुद्ध मुनाफा चेक कीजिए।",
    bannerBadgeText: "किसान भाइयों का फायदा",
    btnSampleScenario: "भादसों उदाहरण देखें",
    step1Title: "फसल और अपनी जानकारी चुनें",
    voiceBtn: "बोलकर बताएं",
    voiceListening: "सुन रहे हैं... बोलिए जैसे: 'गेहूं, साठ क्विंटल, भादसों'",
    quickTestLabel: "त्वरित चुनाव:",
    cropWheat: "गेहूं",
    cropPaddy: "धान / जीरी",
    cropPotato: "आलू",
    labelCrop: "फसल का नाम",
    labelQty: "कुल फसल मात्रा (क्विंटल)",
    labelVillage: "आपका गांव / कस्बा (पटियाला)",
    labelVehicle: "परिवहन वाहन:",
    btnCalc: "मुनाफ़ा कैलकुलेट करें",
    winnerRibbon: "★ सर्वाधिक शुद्ध कमाई",
    winnerBadge: "सलाह: यहाँ बेचें",
    netTakeHome: "जेब में आने वाली असली रकम",
    explainTitle: "क्यों यह मंडी आपके लिए सर्वश्रेष्ठ है?",
    metricGross: "कुल सकल मूल्य",
    metricTrans: "परिवहन खर्च (भाड़ा)",
    metricFee: "मंडी शुल्क + पल्लेदारी",
    metricGain: "अतिरिक्त मुनाफा",
    jumpToGraphTitle: "सच्चाई का ग्राफ देखना चाहते हैं?",
    jumpToGraphDesc: "देखें कैसे दूर की मंडी का ज्यादा भाव भाड़े में बह जाता है।",
    jumpToGraphBtn: "ग्राफ देखें →",
    chartHeading: "भाव vs जेब में मुनाफा (सच्चाई का ग्राफ)",
    chartSubheading: 'देखें कैसे दूर की मंडी का ज्यादा भाव भाड़े में बह जाता है ("The Bars Cross")',
    legendGross: "दिखाया गया दाम (Gross)",
    legendNet: "जेब में मुनाफा (Net)",
    chartNoteText: (compName, extraDiff) => `राजपुरा मंडी का कुल भाव सबसे ऊँचा दिखता है, लेकिन 96 किमी दूर होने के कारण भाड़े में कटौती के बाद पटियाला में आपको <strong>₹${extraDiff} अधिक शुद्ध नकद</strong> बचता है।`,
    tableHeading: "सभी 15 मंडियों की विस्तृत तुलना",
    tableSubheading: "सकल भाव की जगह जेब में आने वाले शुद्ध मुनाफे के क्रम में सजी हुई",
    filterAll: "सभी 15 मंडियां",
    filterTop3: "शीर्ष 3",
    filterLowRisk: "कम जोखिम",
    mlHeading: "आगामी 7-दिन मूल्य दिशा व मंडी आवक मॉडल",
    mobileVoice: "बोलकर पूछें (Voice)",
    travelTimeSuffix: "मिनट",
    kmSuffix: "किमी",
    perQtlNet: "प्रति क्विंटल शुद्ध",
    riskStable: "स्थिर भाव",
    riskRising: "भाव बढ़ोतरी",
    riskFalling: "भाव गिरावट",
    surgeNormal: "सामान्य आवक",
    surgeHigh: "आवक उछाल (जोखिम)",
    reasonTemplate: (winner, compMandi, extraDiff, distDiff, fuelDiff) => 
      `${compMandi.name} मंडी में भाव ₹${compMandi.modalPrice - winner.modalPrice > 0 ? compMandi.modalPrice - winner.modalPrice : 30} ज्यादा दिख रहा है, लेकिन ${distDiff} किमी अतिरिक्त भाड़े में आपके ₹${fuelDiff} ज्यादा खर्च हो जाएंगे। इसलिए ${winner.name} मंडी में बेचने पर आपको कुल ₹${extraDiff} ज्यादा शुद्ध मुनाफा मिलेगा!`
  },
  pa: {
    tagline: "ਅਸਲੀ ਕਮਾਈ, ਸਿਰਫ ਲਿਸਟ ਕੀਤਾ ਭਾਅ ਨਹੀਂ",
    live: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    offline: "ਆਫ਼ਲਾਈਨ ਮੋਡ",
    tabAdvisor: "ਮੁਨਾਫ਼ਾ ਕੈਲਕੁਲੇਟਰ",
    tabCompare: "ਭਾਅ ਬਨਾਮ ਅਸਲੀ ਕਮਾਈ ਗ੍ਰਾਫ਼",
    tabAllMandis: "ਸਾਰੀਆਂ 15 ਮੰਡੀਆਂ",
    tabRisk: "7-ਦਿਨ ਰੁਝਾਨ ਅਤੇ ਆਮਦ",
    tabFAQ: "ਮਦਦ ਅਤੇ ਜਾਣਕਾਰੀ",
    bannerHeroTitle: "ਦਿਖਾਇਆ ਗਿਆ ਭਾਅ ਸਿਰਫ਼ ਲਿਸਟ ਹੈ, ਅਸਲ ਕਮਾਈ ਉਹ ਹੈ ਜੋ ਜੇਬ ਵਿੱਚ ਬਚੇ!",
    bannerHeroDesc: "ਦੂਰ ਦੀ ਮੰਡੀ ਵਿੱਚ ₹30-40 ਵੱਧ ਦਿਖੇ ਤਾਂ ਵੀ ਨਾ ਜਾਓ! ਪਹਿਲਾਂ ਟਰਾਲੀ ਦਾ ਭਾੜਾ ਅਤੇ ਮੰਡੀ ਖ਼ਰਚਾ ਘਟਾ ਕੇ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ ਦੇਖੋ।",
    bannerBadgeText: "ਕਿਸਾਨ ਵੀਰਾਂ ਦਾ ਫ਼ਾਇਦਾ",
    btnSampleScenario: "ਭਾਦਸੋਂ ਉਦਾਹਰਨ ਵੇਖੋ",
    step1Title: "ਫ਼ਸਲ ਅਤੇ ਆਪਣਾ ਪਿੰਡ ਚੁਣੋ",
    voiceBtn: "ਬੋਲ ਕੇ ਦੱਸੋ",
    voiceListening: "ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ: 'ਕਣਕ, ਸੱਠ ਕੁਇੰਟਲ, ਭਾਦਸੋਂ'",
    quickTestLabel: "ਤੇਜ਼ ਚੋਣ:",
    cropWheat: "ਕਣਕ",
    cropPaddy: "ਝੋਨਾ / ਜੀਰੀ",
    cropPotato: "ਆਲੂ",
    labelCrop: "ਫ਼ਸਲ ਦਾ ਨਾਮ",
    labelQty: "ਕੁੱਲ ਮਾਤਰਾ (ਕੁਇੰਟਲ ਵਿੱਚ)",
    labelVillage: "ਤੁਹਾਡਾ ਪਿੰਡ / ਕਸਬਾ (ਪਟਿਆਲਾ ਜ਼ਿਲ੍ਹਾ)",
    labelVehicle: "ਟਰਾਂਸਪੋਰਟ ਸਾਧਨ:",
    btnCalc: "ਮੁਨਾਫ਼ਾ ਹਿਸਾਬ ਲਗਾਓ",
    winnerRibbon: "★ ਸਭ ਤੋਂ ਵੱਧ ਸ਼ੁੱਧ ਕਮਾਈ",
    winnerBadge: "ਸਲਾਹ: ਇੱਥੇ ਵੇਚੋ",
    netTakeHome: "ਜੇਬ ਵਿੱਚ ਆਉਣ ਵਾਲੀ ਅਸਲੀ ਰਕਮ",
    explainTitle: "ਇਹ ਮੰਡੀ ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਕਿਉਂ ਹੈ?",
    metricGross: "ਕੁੱਲ ਮੁੱਲ (Gross)",
    metricTrans: "ਢੋਆ-ਢੁਆਈ ਖ਼ਰਚਾ (ਭਾੜਾ)",
    metricFee: "ਮੰਡੀ ਫ਼ੀਸ + ਲਦਾਈ-ਛਣਾਈ",
    metricGain: "ਵਾਧੂ ਮੁਨਾਫ਼ਾ",
    jumpToGraphTitle: "ਸੱਚਾਈ ਦਾ ਗ੍ਰਾਫ਼ ਵੇਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    jumpToGraphDesc: "ਵੇਖੋ ਕਿਵੇਂ ਦੂਰ ਦੀ ਮੰਡੀ ਦਾ ਵੱਧ ਭਾਅ ਭਾੜੇ ਵਿੱਚ ਗਵਾਚ ਜਾਂਦਾ ਹੈ।",
    jumpToGraphBtn: "ਗ੍ਰਾਫ਼ ਵੇਖੋ →",
    chartHeading: "ਸੱਚਾਈ ਦਾ ਗ੍ਰਾਫ਼: ਭਾਅ ਬਨਾਮ ਜੇਬ ਦਾ ਮੁਨਾਫ਼ਾ",
    chartSubheading: 'ਵੇਖੋ ਕਿਵੇਂ ਦੂਰ ਦੀ ਮੰਡੀ ਦਾ ਵੱਧ ਭਾਅ ਭਾੜੇ ਵਿੱਚ ਗਵਾਚ ਜਾਂਦਾ ਹੈ',
    legendGross: "ਲਿਸਟ ਕੀਤਾ ਭਾਅ (Gross)",
    legendNet: "ਜੇਬ ਦੀ ਕਮਾਈ (Net)",
    chartNoteText: (compName, extraDiff) => `ਰਾਜਪੁਰਾ ਮੰਡੀ ਵਿੱਚ ਭਾਅ ਵੱਧ ਦਿਸਦਾ ਹੈ, ਪਰ 96 ਕਿ.ਮੀ. ਦੂਰ ਹੋਣ ਕਾਰਨ ਭਾੜਾ ਕੱਟ ਕੇ ਪਟਿਆਲਾ ਵਿੱਚ ਤੁਹਾਨੂੰ <strong>₹${extraDiff} ਵੱਧ ਸ਼ੁੱਧ ਕਮਾਈ</strong> ਮਿਲਦੀ ਹੈ।`,
    tableHeading: "ਸਾਰੀਆਂ 15 ਮੰਡੀਆਂ ਦੀ ਤੁਲਨਾ",
    tableSubheading: "ਲਿਸਟ ਕੀਤੇ ਭਾਅ ਦੀ ਥਾਂ ਜੇਬ ਵਿੱਚ ਆਉਣ ਵਾਲੀ ਅਸਲੀ ਕਮਾਈ ਮੁਤਾਬਕ ਸੂਚੀ",
    filterAll: "ਸਾਰੀਆਂ 15 ਮੰਡੀਆਂ",
    filterTop3: "ਸਿਖਰਲੀਆਂ 3",
    filterLowRisk: "ਘੱਟ ਰਿਸਕ",
    mlHeading: "ਆਉਣ ਵਾਲੇ 7-ਦਿਨ ਮੁੱਲ ਦਿਸ਼ਾ ਅਤੇ ਆਮਦ ਮਾਡਲ",
    mobileVoice: "ਬੋਲ ਕੇ ਪੁੱਛੋ (Voice)",
    travelTimeSuffix: "ਮਿੰਟ",
    kmSuffix: "ਕਿ.ਮੀ.",
    perQtlNet: "ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਸ਼ੁੱਧ",
    riskStable: "ਸਥਿਰ ਭਾਅ",
    riskRising: "ਭਾਅ ਵਾਧਾ",
    riskFalling: "ਭਾਅ ਗਿਰਾਵਟ",
    surgeNormal: "ਸਧਾਰਨ ਆਮਦ",
    surgeHigh: "ਵੱਡੀ ਆਮਦ (ਰਿਸਕ)",
    reasonTemplate: (winner, compMandi, extraDiff, distDiff, fuelDiff) => 
      `${compMandi.namePa || compMandi.name} ਵਿੱਚ ਭਾਅ ₹${compMandi.modalPrice - winner.modalPrice > 0 ? compMandi.modalPrice - winner.modalPrice : 30} ਵੱਧ ਦਿਸਦਾ ਹੈ, ਪਰ ${distDiff} ਕਿ.ਮੀ. ਵਾਧੂ ਭਾੜੇ ਵਿੱਚ ਤੁਹਾਡੇ ₹${fuelDiff} ਵੱਧ ਖ਼ਰਚ ਹੋਣਗੇ। ਇਸ ਲਈ ${winner.namePa || winner.name} ਵਿੱਚ ਵੇਚਣ ਨਾਲ ਤੁਹਾਨੂੰ ਕੁੱਲ ₹${extraDiff} ਵੱਧ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ ਮਿਲੇਗਾ!`
  },
  en: {
    tagline: "The money you keep, not just the price you see",
    live: "Live Mandi Prices",
    offline: "Offline Mode",
    tabAdvisor: "Profit Calculator",
    tabCompare: "Price vs Profit Chart",
    tabAllMandis: "All 15 Mandis",
    tabRisk: "7-Day Risk & Arrivals",
    tabFAQ: "Help & FAQ",
    bannerHeroTitle: "The listed price is just a number; what matters is what stays in your pocket!",
    bannerHeroDesc: "Don't drive to a far mandi for ₹30-40 higher price! Subtract tractor freight and mandi charges first to see actual take-home cash.",
    bannerBadgeText: "Farmer First Advantage",
    btnSampleScenario: "View Bhadson Scenario",
    step1Title: "Select Crop & Farmer Origin",
    voiceBtn: "Voice Input",
    voiceListening: "Listening... speak: 'Wheat, 60 quintals, Bhadson'",
    quickTestLabel: "Quick Presets:",
    cropWheat: "Wheat",
    cropPaddy: "Paddy",
    cropPotato: "Potato",
    labelCrop: "Crop Type",
    labelQty: "Total Quantity (Quintals)",
    labelVillage: "Your Origin Village (Patiala)",
    labelVehicle: "Transport Vehicle:",
    btnCalc: "Calculate Net Take-Home",
    winnerRibbon: "★ Highest Net Take-Home Profit",
    winnerBadge: "Recommended: Sell Here",
    netTakeHome: "Net Take-Home Cash in Pocket",
    explainTitle: "Why is this Mandi the Winner?",
    metricGross: "Gross Listed Value",
    metricTrans: "Road Freight Cost",
    metricFee: "Mandi Cess + Labor",
    metricGain: "Extra Margin Gained",
    jumpToGraphTitle: "Want to see the visual proof?",
    jumpToGraphDesc: "See how distant headline prices get wiped out by road freight.",
    jumpToGraphBtn: "View Chart →",
    chartHeading: "Headline Price vs Net Take-Home Cash",
    chartSubheading: "Watch the bars cross as distance freight wipes out listing price advantages",
    legendGross: "Gross Listed Value",
    legendNet: "Net Take-Home Cash",
    chartNoteText: (compName, extraDiff) => `Rajpura shows the highest gross price, but due to being 96 km away, freight deductions make Patiala yield you <strong>₹${extraDiff} more net take-home cash</strong>.`,
    tableHeading: "All 15 Scoped Mandis Ranked by Take-Home Profit",
    tableSubheading: "Ranked by net realization in pocket rather than advertised headline rates",
    filterAll: "All 15 Mandis",
    filterTop3: "Top 3",
    filterLowRisk: "Low Risk",
    mlHeading: "7-Day Price Direction & Arrival Surge Signals",
    mobileVoice: "Ask via Voice",
    travelTimeSuffix: "mins",
    kmSuffix: "km",
    perQtlNet: "per qtl net",
    riskStable: "Stable Price",
    riskRising: "Price Rising",
    riskFalling: "Price Softening",
    surgeNormal: "Normal Arrival",
    surgeHigh: "Surge Alert",
    reasonTemplate: (winner, compMandi, extraDiff, distDiff, fuelDiff) => 
      `${compMandi.nameEn || compMandi.name} has a higher headline price (+₹${compMandi.modalPrice - winner.modalPrice > 0 ? compMandi.modalPrice - winner.modalPrice : 30}), but ${distDiff} km extra transit burns ₹${fuelDiff} in freight. Selling at ${winner.nameEn || winner.name} yields you ₹${extraDiff} more net take-home cash!`
  }
};

let currentLang = 'hi';
let currentTab = 'advisor';

// Tab Navigation Function (Accessible globally on window)
window.switchTab = function(tabId) {
  currentTab = tabId;

  // 1. Toggle tab content panels
  const allContents = document.querySelectorAll('.tab-content');
  allContents.forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });

  const targetContent = document.getElementById(`tabContent_${tabId}`);
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
  }

  // 2. Update Desktop Navigation Buttons
  document.querySelectorAll('.app-tab-btn').forEach(btn => {
    btn.className = "app-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  });
  const activeBtn = document.getElementById(`tabBtn_${tabId}`);
  if (activeBtn) {
    activeBtn.className = "app-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all bg-brand-50 text-brand-700 border border-brand-200 shadow-sm";
  }

  // 3. Update Mobile Bottom Bar Buttons
  document.querySelectorAll('.mobile-tab-btn').forEach(mBtn => {
    mBtn.className = "mobile-tab-btn flex flex-col items-center gap-0.5 text-slate-500 font-bold";
  });
  const activeMBtn = document.getElementById(`mTabBtn_${tabId}`);
  if (activeMBtn) {
    activeMBtn.className = "mobile-tab-btn flex flex-col items-center gap-0.5 text-brand-700 font-black";
  }

  // 4. If chart tab is opened, re-render chart canvas
  if (tabId === 'compare' && currentResults.length > 0) {
    setTimeout(() => {
      const qty = parseFloat(document.getElementById('qtyInput')?.value) || 60;
      renderCrossingBarsChart(currentResults, qty);
    }, 40);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 2. The 15 Mandis of Patiala District Scoped Dataset
const MANDIS_DB = [
  {
    id: "patiala_main",
    name: "पटियाला मुख्य मंडी (Patiala Main)",
    namePa: "ਪਟਿਆਲਾ ਮੁੱਖ ਮੰਡੀ",
    nameEn: "Patiala Main Mandi",
    lat: 30.3398,
    lon: 76.3869,
    basePrices: { wheat: 2450, paddy: 2280, potato: 1250 },
    loadingPerQtl: 14,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 180
  },
  {
    id: "rajpura",
    name: "राजपुरा अनाज मंडी (Rajpura Grain)",
    namePa: "ਰਾਜਪੁਰਾ ਅਨਾਜ ਮੰਡੀ",
    nameEn: "Rajpura Grain Market",
    lat: 30.4842,
    lon: 76.5939,
    basePrices: { wheat: 2480, paddy: 2315, potato: 1280 }, // Higher headline price
    loadingPerQtl: 16,
    mlDirection: "Falling",
    arrivalSurge: true, // Surge alert
    arrivalTonsToday: 420
  },
  {
    id: "nabha",
    name: "नाभा मंडी (Nabha Mandi)",
    namePa: "ਨਾਭਾ ਮੰਡੀ",
    nameEn: "Nabha Mandi",
    lat: 30.3752,
    lon: 76.1527,
    basePrices: { wheat: 2430, paddy: 2260, potato: 1230 },
    loadingPerQtl: 13,
    mlDirection: "Rising",
    arrivalSurge: false,
    arrivalTonsToday: 130
  },
  {
    id: "samana",
    name: "समाना मंडी (Samana Mandi)",
    namePa: "ਸਮਾਣਾ ਮੰਡੀ",
    nameEn: "Samana Mandi",
    lat: 30.1541,
    lon: 76.1916,
    basePrices: { wheat: 2445, paddy: 2290, potato: 1240 },
    loadingPerQtl: 14,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 210
  },
  {
    id: "patran",
    name: "पातरां मंडी (Patran Mandi)",
    namePa: "ਪਾਤੜਾਂ ਮੰਡੀ",
    nameEn: "Patran Mandi",
    lat: 29.9392,
    lon: 76.0617,
    basePrices: { wheat: 2435, paddy: 2275, potato: 1220 },
    loadingPerQtl: 14,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 190
  },
  {
    id: "sanaur",
    name: "सनौर सब-यार्ड (Sanaur Sub-Yard)",
    namePa: "ਸਨੌਰ ਸਬ-ਯਾਰਡ",
    nameEn: "Sanaur Sub-Yard",
    lat: 30.3015,
    lon: 76.4529,
    basePrices: { wheat: 2430, paddy: 2250, potato: 1260 },
    loadingPerQtl: 12,
    mlDirection: "Rising",
    arrivalSurge: false,
    arrivalTonsToday: 95
  },
  {
    id: "ghanour",
    name: "घनौर मंडी (Ghanour Mandi)",
    namePa: "ਘਨੌਰ ਮੰਡੀ",
    nameEn: "Ghanour Mandi",
    lat: 30.3328,
    lon: 76.6212,
    basePrices: { wheat: 2470, paddy: 2310, potato: 1275 },
    loadingPerQtl: 15,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 110
  },
  {
    id: "bhunerheri",
    name: "भुनेरहेड़ी मंडी (Bhunerheri Yard)",
    namePa: "ਭੁਨਰਹੇੜੀ ਮੰਡੀ",
    nameEn: "Bhunerheri Yard",
    lat: 30.2201,
    lon: 76.4350,
    basePrices: { wheat: 2420, paddy: 2240, potato: 1220 },
    loadingPerQtl: 12,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 80
  },
  {
    id: "dudhan_sadhan",
    name: "दूधन साधन मंडी (Dudhan Sadhan)",
    namePa: "ਦੂਧਨ ਸਾਧਨ",
    nameEn: "Dudhan Sadhan Mandi",
    lat: 30.1702,
    lon: 76.5122,
    basePrices: { wheat: 2425, paddy: 2250, potato: 1215 },
    loadingPerQtl: 13,
    mlDirection: "Falling",
    arrivalSurge: false,
    arrivalTonsToday: 75
  },
  {
    id: "bhadson_local",
    name: "भादसों खरीद केंद्र (Bhadson Yard)",
    namePa: "ਭਾਦਸੋਂ ਖ਼ਰੀਦ ਕੇਂਦਰ",
    nameEn: "Bhadson Purchase Center",
    lat: 30.5185,
    lon: 76.2230,
    basePrices: { wheat: 2380, paddy: 2210, potato: 1190 },
    loadingPerQtl: 12,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 60
  },
  {
    id: "amloh_border",
    name: "अमलोह मंडी (Amloh Border)",
    namePa: "ਅਮਲੋਹ ਮੰਡੀ",
    nameEn: "Amloh Border Mandi",
    lat: 30.6131,
    lon: 76.2272,
    basePrices: { wheat: 2460, paddy: 2300, potato: 1260 },
    loadingPerQtl: 15,
    mlDirection: "Rising",
    arrivalSurge: false,
    arrivalTonsToday: 140
  },
  {
    id: "sirhind_market",
    name: "सरहिंद अनाज मंडी (Sirhind Grain)",
    namePa: "ਸਰਹਿੰਦ ਅਨਾਜ ਮੰਡੀ",
    nameEn: "Sirhind Grain Market",
    lat: 30.6433,
    lon: 76.3860,
    basePrices: { wheat: 2440, paddy: 2280, potato: 1250 },
    loadingPerQtl: 16,
    mlDirection: "Falling",
    arrivalSurge: true,
    arrivalTonsToday: 310
  },
  {
    id: "cheeka_border",
    name: "चीका सीमा मंडी (Cheeka Border)",
    namePa: "ਚੀਕਾ ਬਾਰਡਰ ਮੰਡੀ",
    nameEn: "Cheeka Haryana Border Mandi",
    lat: 30.0543,
    lon: 76.2285,
    basePrices: { wheat: 2460, paddy: 2300, potato: 1250 },
    loadingPerQtl: 15,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 260
  },
  {
    id: "dakala",
    name: "डकाला सब-यार्ड (Dakala)",
    namePa: "ਡਕਾਲਾ ਸਬ-ਯਾਰਡ",
    nameEn: "Dakala Sub-Yard",
    lat: 30.2281,
    lon: 76.3315,
    basePrices: { wheat: 2415, paddy: 2235, potato: 1210 },
    loadingPerQtl: 12,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 55
  },
  {
    id: "ghagga",
    name: "घग्गा खरीद केंद्र (Ghagga Yard)",
    namePa: "ਘੱਗਾ ਮੰਡੀ",
    nameEn: "Ghagga Purchase Center",
    lat: 29.9880,
    lon: 76.1280,
    basePrices: { wheat: 2420, paddy: 2240, potato: 1210 },
    loadingPerQtl: 13,
    mlDirection: "Stable",
    arrivalSurge: false,
    arrivalTonsToday: 70
  }
];

const VILLAGES_DB = {
  "Bhadson": { name: "Bhadson", namePa: "ਭਾਦਸੋਂ", nameEn: "Bhadson", lat: 30.5185, lon: 76.2230 },
  "Patiala Rural": { name: "Patiala Rural", namePa: "ਪਟਿਆਲਾ ਦੇਹਾਤ", nameEn: "Patiala Rural", lat: 30.3450, lon: 76.3600 },
  "Nabha Rural": { name: "Nabha Rural", namePa: "ਨਾਭਾ ਦੇਹਾਤ", nameEn: "Nabha Rural", lat: 30.3700, lon: 76.1600 },
  "Samana": { name: "Samana", namePa: "ਸਮਾਣਾ", nameEn: "Samana", lat: 30.1541, lon: 76.1916 },
  "Rajpura Rural": { name: "Rajpura Rural", namePa: "ਰਾਜਪੁਰਾ ਦੇਹਾਤ", nameEn: "Rajpura Rural", lat: 30.4900, lon: 76.5700 },
  "Sanaur": { name: "Sanaur", namePa: "ਸਨੌਰ", nameEn: "Sanaur", lat: 30.3015, lon: 76.4529 },
  "Ghanour": { name: "Ghanour", namePa: "ਘਨੌਰ", nameEn: "Ghanour", lat: 30.3328, lon: 76.6212 },
  "Patran": { name: "Patran", namePa: "ਪਾਤੜਾਂ", nameEn: "Patran", lat: 29.9392, lon: 76.0617 }
};

// Distance calculation
function calculateRoadDistanceKm(originLat, originLon, destLat, destLon) {
  const R = 6371;
  const dLat = (destLat - originLat) * Math.PI / 180;
  const dLon = (destLon - originLon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(originLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightLine = R * c;
  const tortuosity = 1.34;
  let roadDistance = Math.round(straightLine * tortuosity);
  return Math.max(roadDistance, 2);
}

// Vehicle Freight Model
function getFreightCost(roadDistanceKm, qtyQuintals, vehicleType) {
  let baseRent = 400;
  let ratePerKm = 35;
  let maxCap = 70;

  if (vehicleType === "pickup") {
    baseRent = 300;
    ratePerKm = 26;
    maxCap = 40;
  } else if (vehicleType === "truck") {
    baseRent = 800;
    ratePerKm = 55;
    maxCap = 160;
  }

  const trips = Math.ceil(qtyQuintals / maxCap);
  const totalFreight = (baseRent + (roadDistanceKm * ratePerKm)) * trips;
  return {
    trips,
    freightCost: Math.round(totalFreight),
    perQtlFreight: Math.round(totalFreight / qtyQuintals)
  };
}

// APMC Charges & Weighment
function getApmcCharges(grossValue, qtyQuintals, mandi) {
  const statutoryCess = Math.round(grossValue * 0.005);
  const handlingLabor = Math.round(qtyQuintals * mandi.loadingPerQtl);
  const totalFees = statutoryCess + handlingLabor;
  return { statutoryCess, handlingLabor, totalFees };
}

let selectedCrop = "wheat";
let currentResults = [];
let chartInstance = null;
let activeFilter = "all";
let speechRecognition = null;
let isListening = false;

// Main Calculation Pipeline
window.calculateRealization = function() {
  const qtyInputEl = document.getElementById('qtyInput');
  const qty = parseFloat(qtyInputEl ? qtyInputEl.value : 60) || 60;
  const villageKey = document.getElementById('villageSelect')?.value || "Bhadson";
  const vehicleType = document.getElementById('vehicleType')?.value || "tractor";
  const origin = VILLAGES_DB[villageKey] || VILLAGES_DB["Bhadson"];

  const scoredMandis = MANDIS_DB.map(mandi => {
    let roadDist = calculateRoadDistanceKm(origin.lat, origin.lon, mandi.lat, mandi.lon);
    if (villageKey === "Bhadson") {
      if (mandi.id === "patiala_main") roadDist = 18;
      else if (mandi.id === "rajpura") roadDist = 96;
      else if (mandi.id === "nabha") roadDist = 34;
      else if (mandi.id === "amloh_border") roadDist = 42;
      else if (mandi.id === "sirhind_market") roadDist = 68;
      else if (mandi.id === "cheeka_border") roadDist = 85;
    }

    const travelTimeMins = Math.round((roadDist / 32) * 60);
    const modalPrice = mandi.basePrices[selectedCrop];
    const grossValue = Math.round(modalPrice * qty);
    const freight = getFreightCost(roadDist, qty, vehicleType);
    const apmc = getApmcCharges(grossValue, qty, mandi);
    const netRealization = Math.round(grossValue - freight.freightCost - apmc.totalFees);
    const netPerQtl = Math.round(netRealization / qty);

    return {
      ...mandi,
      roadDist,
      travelTimeMins,
      modalPrice,
      grossValue,
      freightCost: freight.freightCost,
      perQtlFreight: freight.perQtlFreight,
      apmcFees: apmc.totalFees,
      netRealization,
      netPerQtl
    };
  });

  scoredMandis.sort((a, b) => b.netRealization - a.netRealization);
  currentResults = scoredMandis;

  renderWinnerCard(scoredMandis, qty);
  renderCrossingBarsChart(scoredMandis, qty);
  renderMandisList(scoredMandis);
};

// Winner Card
function renderWinnerCard(results, qty) {
  const winner = results[0];
  const highestGrossMandi = [...results].sort((a, b) => b.modalPrice - a.modalPrice)[0];
  const t = TRANSLATIONS[currentLang];

  const displayName = currentLang === 'pa' ? winner.namePa : (currentLang === 'en' ? winner.nameEn : winner.name);
  const winnerNameEl = document.getElementById('winnerMandiName');
  if (winnerNameEl) winnerNameEl.textContent = displayName;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('winnerDistance', `${winner.roadDist} ${t.kmSuffix}`);
  setEl('winnerDriveTime', `${winner.travelTimeMins} ${t.travelTimeSuffix}`);
  setEl('winnerNetPayout', `₹${winner.netRealization.toLocaleString('en-IN')}`);
  setEl('winnerPerQtlNet', `₹${winner.netPerQtl.toLocaleString('en-IN')}`);
  setEl('winnerGrossVal', `₹${winner.grossValue.toLocaleString('en-IN')}`);
  setEl('winnerTransCost', `-₹${winner.freightCost.toLocaleString('en-IN')}`);
  setEl('winnerMandiFees', `-₹${winner.apmcFees.toLocaleString('en-IN')}`);

  let comparisonMandi = highestGrossMandi.id !== winner.id ? highestGrossMandi : results[1];
  const extraDiff = winner.netRealization - comparisonMandi.netRealization;
  const distDiff = comparisonMandi.roadDist - winner.roadDist;
  const fuelDiff = comparisonMandi.freightCost - winner.freightCost;

  setEl('winnerExtraProfit', `+₹${extraDiff.toLocaleString('en-IN')}`);
  setEl('metricGainLabel', `${comparisonMandi.name.split(' ')[0]} ${currentLang === 'en' ? 'comparison' : 'की तुलना में'}`);

  const reasonText = t.reasonTemplate(winner, comparisonMandi, extraDiff.toLocaleString('en-IN'), distDiff, fuelDiff.toLocaleString('en-IN'));
  setEl('winnerReasonSentence', reasonText);
  window.lastWinnerAdvice = reasonText;
}

// Chart Render
function renderCrossingBarsChart(results, qty) {
  const canvas = document.getElementById('crossingBarsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let keyMandis = [
    results.find(m => m.id === "patiala_main") || results[0],
    results.find(m => m.id === "rajpura") || results[1],
    results.find(m => m.id === "nabha") || results[2]
  ];

  const labels = keyMandis.map(m => {
    if (currentLang === 'pa') return m.namePa.split(' ')[0];
    if (currentLang === 'en') return m.nameEn.split(' ')[0];
    return m.name.split(' ')[0];
  });
  const grossData = keyMandis.map(m => m.grossValue);
  const netData = keyMandis.map(m => m.netRealization);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: TRANSLATIONS[currentLang].legendGross,
          data: grossData,
          backgroundColor: 'rgba(203, 213, 225, 0.95)',
          borderColor: 'rgb(148, 163, 184)',
          borderWidth: 2,
          borderRadius: 10,
          barPercentage: 0.65,
        },
        {
          label: TRANSLATIONS[currentLang].legendNet,
          data: netData,
          backgroundColor: 'rgba(22, 163, 74, 0.95)',
          borderColor: 'rgb(21, 128, 61)',
          borderWidth: 2,
          borderRadius: 10,
          barPercentage: 0.65,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return (context.dataset.label || '') + ': ₹' + context.parsed.y.toLocaleString('en-IN');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return '₹' + (value / 1000) + 'k';
            },
            font: { family: 'Outfit, Mukta, sans-serif', weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Mukta, sans-serif', weight: 'bold', size: 13 } }
        }
      }
    }
  });
}

// Mandis List
function renderMandisList(results) {
  const container = document.getElementById('mandiResultsList');
  if (!container) return;
  container.innerHTML = '';
  const t = TRANSLATIONS[currentLang];

  let displayList = results;
  if (activeFilter === 'top3') displayList = results.slice(0, 3);
  else if (activeFilter === 'lowRisk') displayList = results.filter(m => !m.arrivalSurge && m.mlDirection !== 'Falling');

  displayList.forEach((mandi, idx) => {
    const isWinner = idx === 0 && activeFilter === 'all';
    
    let directionBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">↔ ${t.riskStable}</span>`;
    if (mandi.mlDirection === 'Rising') {
      directionBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">↑ ${t.riskRising}</span>`;
    } else if (mandi.mlDirection === 'Falling') {
      directionBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">↓ ${t.riskFalling}</span>`;
    }

    let surgeBadge = '';
    if (mandi.arrivalSurge) {
      surgeBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full">⚠️ ${t.surgeHigh}</span>`;
    }

    const card = document.createElement('div');
    card.className = `p-4 sm:p-5 rounded-3xl border transition-all ${
      isWinner 
        ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20' 
        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
    }`;

    const displayName = currentLang === 'pa' ? mandi.namePa : (currentLang === 'en' ? mandi.nameEn : mandi.name);
    const distText = currentLang === 'en' ? 'Distance:' : (currentLang === 'pa' ? 'ਦੂਰੀ:' : 'दूरी:');
    const grossText = currentLang === 'en' ? 'Listed Price:' : (currentLang === 'pa' ? 'ਲਿਸਟ ਭਾਅ:' : 'लिस्टेड भाव:');
    const freightText = currentLang === 'en' ? 'Freight:' : (currentLang === 'pa' ? 'ਭਾੜਾ:' : 'भाड़ा:');
    const taxText = currentLang === 'en' ? 'Mandi Fees:' : (currentLang === 'pa' ? 'ਮੰਡੀ ਟੈਕਸ:' : 'मंडी टैक्स/लेबर:');
    const takeHomeText = currentLang === 'en' ? 'Net in Pocket:' : (currentLang === 'pa' ? 'ਜੇਬ ਵਿੱਚ ਮੁਨਾਫ਼ਾ:' : 'जेब में मुनाफा:');
    const winnerTag = currentLang === 'en' ? 'WINNER' : (currentLang === 'pa' ? 'ਸਰਵੋਤਮ' : 'सर्वोत्तम');

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-start gap-3.5">
          <div class="w-9 h-9 rounded-2xl ${isWinner ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'} font-black text-sm flex items-center justify-center shrink-0 font-english shadow-xs">
            #${idx + 1}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-black text-slate-900 text-base sm:text-lg">${displayName}</h4>
              ${isWinner ? `<span class="text-[10px] bg-brand-600 text-white font-black px-2 py-0.5 rounded-full uppercase">${winnerTag}</span>` : ''}
              ${directionBadge}
              ${surgeBadge}
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5 font-medium">
              <span>${distText} <strong class="text-slate-800 font-english">${mandi.roadDist} ${t.kmSuffix}</strong></span>
              <span>•</span>
              <span>${grossText} <strong class="text-slate-900 font-english">₹${mandi.modalPrice}/qtl</strong></span>
              <span>•</span>
              <span>${freightText} <strong class="text-rose-600 font-english">₹${mandi.freightCost}</strong></span>
              <span>•</span>
              <span>${taxText} <strong class="text-slate-700 font-english">₹${mandi.apmcFees}</strong></span>
            </div>
          </div>
        </div>

        <div class="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-0 pt-2.5 sm:pt-0 border-slate-100">
          <span class="text-xs text-slate-500 font-bold sm:hidden">${takeHomeText}</span>
          <div class="text-xl sm:text-2xl font-black font-english ${isWinner ? 'text-brand-700' : 'text-slate-900'}">
            ₹${mandi.netRealization.toLocaleString('en-IN')}
          </div>
          <span class="text-xs font-bold text-slate-500 font-english">
            ₹${mandi.netPerQtl}/qtl ${currentLang === 'en' ? 'net' : 'शुद्ध'}
          </span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Crop Selector
window.selectCrop = function(crop) {
  selectedCrop = crop;
  document.querySelectorAll('.crop-btn').forEach(btn => {
    btn.classList.remove('border-2', 'border-brand-600', 'bg-brand-50', 'text-brand-900');
    btn.classList.add('border', 'border-slate-200', 'bg-white', 'text-slate-700');
  });

  const activeBtn = document.getElementById(`cropBtn_${crop}`);
  if (activeBtn) {
    activeBtn.classList.remove('border', 'border-slate-200', 'bg-white', 'text-slate-700');
    activeBtn.classList.add('border-2', 'border-brand-600', 'bg-brand-50', 'text-brand-900');
  }

  calculateRealization();
};

window.adjustQty = function(amount) {
  const input = document.getElementById('qtyInput');
  let currentVal = parseInt(input.value) || 60;
  currentVal = Math.max(5, Math.min(500, currentVal + amount));
  input.value = currentVal;
  calculateRealization();
};

window.setPreset = function(crop, qty, village) {
  selectCrop(crop);
  const qtyInput = document.getElementById('qtyInput');
  if (qtyInput) qtyInput.value = qty;
  const villageSelect = document.getElementById('villageSelect');
  if (villageSelect) villageSelect.value = village;
  calculateRealization();
};

window.loadSampleScenario = function() {
  switchTab('advisor');
  setPreset('wheat', 60, 'Bhadson');
  window.scrollTo({ top: 320, behavior: 'smooth' });
};

window.filterMandis = function(filter) {
  activeFilter = filter;
  ['all', 'top3', 'lowRisk'].forEach(f => {
    const btn = document.getElementById(`filter${f.charAt(0).toUpperCase() + f.slice(1)}`);
    if (btn) {
      if (f === filter) {
        btn.className = 'filter-tab px-3 py-1.5 rounded-xl bg-brand-600 text-white font-black shadow-sm';
      } else {
        btn.className = 'filter-tab px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200';
      }
    }
  });

  renderMandisList(currentResults);
};

// Language Switcher (Exposed on window)
window.setLanguage = function(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  ['hi', 'pa', 'en'].forEach(l => {
    const btn = document.getElementById(`lang${l.charAt(0).toUpperCase() + l.slice(1)}`);
    if (btn) {
      if (l === lang) btn.className = "px-3 py-1 text-xs font-black rounded-lg transition-all bg-white text-brand-700 shadow-sm";
      else btn.className = "px-3 py-1 text-xs font-black rounded-lg transition-all text-slate-600 hover:text-slate-900";
    }
  });

  const updateText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  // Header & Tab labels
  updateText('headerTagline', t.tagline);
  updateText('tabLabelAdvisor', t.tabAdvisor);
  updateText('tabLabelCompare', t.tabCompare);
  updateText('tabLabelAllMandis', t.tabAllMandis);
  updateText('tabLabelRisk', t.tabRisk);
  updateText('tabLabelFAQ', t.tabFAQ);

  // Hero Banner
  updateText('bannerHeroTitle', t.bannerHeroTitle);
  updateText('bannerHeroDesc', t.bannerHeroDesc);
  updateText('bannerBadgeText', t.bannerBadgeText);

  // Inputs
  updateText('step1Title', t.step1Title);
  updateText('voiceBtnLabel', t.voiceBtn);
  updateText('quickTestLabel', t.quickTestLabel);
  updateText('cropName_wheat', t.cropWheat);
  updateText('cropName_paddy', t.cropPaddy);
  updateText('cropName_potato', t.cropPotato);
  updateText('labelCrop', t.labelCrop);
  updateText('labelQty', t.labelQty);
  updateText('labelVillage', t.labelVillage);
  updateText('labelVehicle', t.labelVehicle);
  updateText('btnCalculate', t.btnCalc);

  // Winner Card & Metrics
  updateText('winnerBadgeText', t.winnerBadge);
  updateText('netTakeHomeLabel', t.netTakeHome);
  updateText('explainTitle', t.explainTitle);
  updateText('metricGrossLabel', t.metricGross);
  updateText('metricTransLabel', t.metricTrans);
  updateText('metricFeeLabel', t.metricFee);

  // Chart
  updateText('chartHeading', t.chartHeading);
  updateText('chartSubheading', t.chartSubheading);
  updateText('legendGross', t.legendGross);
  updateText('legendNet', t.legendNet);

  // Table
  updateText('tableHeading', t.tableHeading);
  updateText('tableSubheading', t.tableSubheading);
  updateText('filterAll', t.filterAll);
  updateText('filterTop3', t.filterTop3);
  updateText('filterLowRisk', t.filterLowRisk);

  // Risk & Mobile
  updateText('mlHeading', t.mlHeading);
  updateText('networkStatusText', t.live);

  calculateRealization();
};

// Voice Recognition
function setupSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = currentLang === 'pa' ? 'pa-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');

    speechRecognition.onstart = () => {
      isListening = true;
      document.getElementById('voiceFeedback')?.classList.remove('hidden');
      document.getElementById('voiceBtn')?.classList.add('mic-live');
    };

    speechRecognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      const feedbackText = document.getElementById('voiceTranscriptText');
      if (feedbackText) feedbackText.textContent = `सुना गया: "${speechResult}"`;
      parseVoiceCommand(speechResult);
      stopVoiceRecording();
    };

    speechRecognition.onerror = (e) => {
      console.warn("Speech error:", e);
      stopVoiceRecording();
    };

    speechRecognition.onend = () => {
      stopVoiceRecording();
    };
  }
}

window.toggleVoiceInput = function() {
  if (!speechRecognition) setupSpeech();
  if (!speechRecognition) {
    alert("Voice recognition is not supported in this browser. You can tap the presets or select manually.");
    return;
  }
  if (isListening) {
    speechRecognition.stop();
  } else {
    speechRecognition.lang = currentLang === 'pa' ? 'pa-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
    speechRecognition.start();
  }
};

window.stopVoiceRecording = function() {
  isListening = false;
  document.getElementById('voiceBtn')?.classList.remove('mic-live');
  setTimeout(() => {
    document.getElementById('voiceFeedback')?.classList.add('hidden');
  }, 2500);
};

function parseVoiceCommand(text) {
  if (text.includes("गेहूं") || text.includes("gehun") || text.includes("wheat") || text.includes("ਕਣਕ") || text.includes("kanak")) {
    selectCrop("wheat");
  } else if (text.includes("धान") || text.includes("जीरी") || text.includes("paddy") || text.includes("rice") || text.includes("ਝੋਨਾ") || text.includes("jhona")) {
    selectCrop("paddy");
  } else if (text.includes("आलू") || text.includes("aaloo") || text.includes("potato") || text.includes("ਆਲੂ")) {
    selectCrop("potato");
  }

  const matchedNumbers = text.match(/\d+/);
  if (matchedNumbers) {
    const qtyInput = document.getElementById('qtyInput');
    if (qtyInput) qtyInput.value = parseInt(matchedNumbers[0]);
  }

  if (text.includes("भादसों") || text.includes("bhadson") || text.includes("ਭਾਦਸੋਂ")) {
    const sel = document.getElementById('villageSelect');
    if (sel) sel.value = "Bhadson";
  } else if (text.includes("समाना") || text.includes("samana") || text.includes("ਸਮਾਣਾ")) {
    const sel = document.getElementById('villageSelect');
    if (sel) sel.value = "Samana";
  } else if (text.includes("नाभा") || text.includes("nabha") || text.includes("ਨਾਭਾ")) {
    const sel = document.getElementById('villageSelect');
    if (sel) sel.value = "Nabha Rural";
  } else if (text.includes("पटियाला") || text.includes("patiala") || text.includes("ਪਟਿਆਲਾ")) {
    const sel = document.getElementById('villageSelect');
    if (sel) sel.value = "Patiala Rural";
  } else if (text.includes("राजपुरा") || text.includes("rajpura") || text.includes("ਰਾਜਪੁਰਾ")) {
    const sel = document.getElementById('villageSelect');
    if (sel) sel.value = "Rajpura Rural";
  }

  calculateRealization();
}

window.speakRecommendation = function() {
  if (!('speechSynthesis' in window)) {
    alert("Speech synthesis is not supported on this device.");
    return;
  }

  window.speechSynthesis.cancel();
  const textToRead = window.lastWinnerAdvice || document.getElementById('winnerReasonSentence')?.textContent || '';
  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (currentLang === 'pa') utterance.lang = 'pa-IN';
  else if (currentLang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-IN';

  window.speechSynthesis.speak(utterance);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  calculateRealization();
});
