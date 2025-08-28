🚨 Suspicious Site Warning – Chrome Extension

A Chrome Extension that protects users by warning them about potentially malicious or suspicious websites.
It combines Google Safe Browsing API, community reporting system, and fraud analysis logic to make browsing safer.

🌟 Features

🔒 Real-time Safe Browsing Check
Uses Google Safe Browsing API to detect phishing, malware, and other harmful sites.

📝 Community Reporting
Users can report suspicious domains → stored in a Google Sheet / SQL DB for analysis.

📊 Severity Levels

🟢 Low Risk → Less than 2 reports

🟠 Suspicious → 2–5 reports

🔴 Dangerous → More than 5 reports (full-page red overlay)

🗣️ Multilingual Warnings
Shows warning banner in the user’s language (English, Hindi, Bengali, Tamil, Gujarati, Kannada, etc.)
Also supports text-to-speech for accessibility.

📌 Popup Dashboard

Report a site with one click

View how many people reported it

See site severity (Low, Suspicious, Dangerous)

📂 Database Integration

Live sync between MySQL → Google Sheets → Extension

Allows HR/management to monitor malicious sites in real time.

📽️ Demo Video

📌 [Add your demo video link here once uploaded]

📸 Screenshots

Popup


Warning Banner Example


⚙️ Installation (Developer Mode)

Clone the repo:

git clone https://github.com/yourusername/suspicious-site-warning-extension.git


Open Chrome → chrome://extensions/

Enable Developer Mode (top-right)

Click Load Unpacked → Select the project folder

Extension will appear in your browser

🛠️ Tech Stack

Frontend: JavaScript, HTML, CSS

Backend (report logging): Google Apps Script + Google Sheets

Database: MySQL (fraud domains, live sync with Sheets)

API: Google Safe Browsing API

🚀 Future Improvements

AI/ML model to detect lookalike domains (typosquatting like g00gle.com vs google.com)

Centralized fraud intelligence dashboard for enterprises

Integration with CEIR/telecom fraud databases

Export suspicious reports to CERT-In / cybercrime portals

👨‍💻 Author

Aayush Singh
💼 LinkedIn Profile
 | 📧 your.email@example.com