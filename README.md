# 🌾 MunafaMandi (मुनाफ़ामंडी)
> **"The price you see is not the money you keep."**  
> *Build with Bharat 2.0 Hackathon Winning Prototype*

MunafaMandi transforms raw headline mandi prices into **personalized take-home net profit** for small & marginal farmers in India. It solves the critical trap where higher advertised mandi prices are wiped out by road freight, mandi cess, and hidden arrival risks.

---

## 🎯 The Core Problem & The "Wow Moment"
- **86% of Indian farmers** are small or marginal holdings with low literacy, older smartphones, and 2G connectivity.
- **The Listed Price Trap:** A mandi with ₹30–₹50 higher headline price often requires 50–90 km more travel, costing thousands in fuel and tractor rental.
- **The Crossing Bars Proof (Bhadson Example):**
  - **Rajpura Mandi (96 km):** Headline Gross = **₹1,48,800** (@ ₹2,480/qtl for 60 qtl) | Net Take-Home = **₹1,43,456**
  - **Patiala Mandi (18 km):** Headline Gross = **₹1,47,000** (@ ₹2,450/qtl for 60 qtl) | Net Take-Home = **₹1,44,395**
  - **Result:** Patiala earns the farmer **₹939–₹2,175 MORE net cash**, despite having a lower listed price!

---

## ⚡ Key Prototype Features
1. **Voice-First Input (Bhashini / Web Speech API):** Speak naturally in Hindi, Punjabi, or English (*"Aaloo, chaalis quintal, Bhadson gaon"*).
2. **Minimal 3-Field Interface:** Large-tap targets, zero jargon, no login friction.
3. **Logistics & OSRM Distance Engine:** Road distance calculation with vehicle load models (Tractor Trolley, Pickup, Truck).
4. **Punjab APMC Fee Engine:** Accurate statutory cess, rural development, and labor/weighment deductions.
5. **ML Risk Layer (LightGBM + Prophet):**
   - **7-day price direction flag** (Rising, Stable, Softening).
   - **Arrival Surge Flag** (alerts when sudden supply spike threatens near-future prices).
6. **2G Optimized PWA & Offline Support:**
   - Payload under 42 KB for sub-second 2G rendering.
   - Service worker offline cache (`sw.js`).
   - 7-day rolling median fallback for holiday/thin-trade Agmarknet gaps.
7. **Speech Synthesis TTS Read-Aloud:** Read recommendations aloud in native Hindi/Punjabi.

---

## 🏗️ Technical Architecture
- **Frontend:** Progressive Web App (PWA), HTML5, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend:** FastAPI (Python 3.11), Pydantic, asynchronous scoring.
- **ML Engine:** LightGBM direction classifier, Prophet seasonal baseline.
- **Geospatial & Road:** PostGIS coordinates + OSRM distance matrix model.
- **Deployment:** Dockerized for instant deploy on Render / Railway.

---

## 🚀 How to Run the Prototype

### Option 1: Open Directly in Browser (Immediate Demo)
Simply open `index.html` in any modern web browser or start a lightweight server:
```bash
cd munafamandi
python -m http.server 3000
# Open http://localhost:3000 in your browser
```

### Option 2: Run the FastAPI ML Backend
```bash
cd munafamandi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API docs available at http://localhost:8000/docs
```

### Option 3: Test via Terminal (Quick Validation)
```bash
python -c "import main, asyncio; req = main.AdvisorRequest(crop='wheat', quantity_quintals=60, village='Bhadson'); print(asyncio.run(main.calculate_net_realization(req)))"
```
