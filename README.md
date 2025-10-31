# 🧠 VerifyIt – AI-Powered Fact-Checking Chrome Extension

## 📖 Overview
**VerifyIt** is a Chrome extension that allows users to **highlight any text online** and instantly verify whether it’s true, false, mixed, or unsupported — while also detecting **emotionally charged language** that may be used to mislead readers.  

In a world where misinformation spreads faster than ever, VerifyIt helps users **think critically** about the content they consume by combining **real-time AI verification** with **emotion detection**.

---

## ✨ Features

- 🔍 **Instant Fact-Checking**  
  Highlight any claim on a webpage and get a real-time classification: **True**, **False**, **Mixed**, or **Unsupported**.  

- 💬 **Emotion Detection**  
  Uses machine learning to analyze emotional tone and intensity, helping users identify manipulative or sensational language.  

- 🌐 **Trusted Sources & Links**  
  Provides relevant, credible links for users to verify or learn more about the claim.  

- ⚡ **Fast & Lightweight**  
  Backend inference is handled by a Flask server powered by **Groq**, keeping the Chrome extension responsive and efficient.  

---

## 🧩 How It Works

1. The user **highlights text** on a webpage.  
2. The Chrome extension sends the text to a **Flask backend server**.  
3. The backend:
   - Uses **LLMs (Llama 4, GPT-OSS-120B)** via **Groq** for real-time fact verification.  
   - Runs a **Hugging Face emotion classification model** to assess emotional charge.  
4. The results are returned and displayed in a popup on the page with claim classification, emotion intensity, and credible source links.  

---

## 🏗️ Tech Stack

**Frontend:**  
- Chrome Extension (Manifest V3)  
- HTML, CSS, JavaScript  

**Backend:**  
- Python (Flask)  
- `flask-cors` for secure API communication  

**AI/ML Models:**  
- Hugging Face emotion detection model  
- Llama 4 & GPT-OSS-120B via Groq API for fact verification  

**Tools & Platforms:**  
- Groq for model inference  
- Hugging Face Transformers  
- OpenAI-compatible APIs  
- Google Fact Check Tools API (experimental)


   
