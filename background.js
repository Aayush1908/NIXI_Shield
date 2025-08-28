const API_KEY = "AIzaSyBntlDX6At8FklBdLh_8UBGvGBlLw_iEDU";

// Replace with your Apps Script URL
const REPORT_API = "https://script.google.com/macros/s/AKfycbzlx_NbWONz1DjPLkwgSrHJRjhK8khnEvS3dD4gSHCO92zFLc7oRaUBOa5GevB9i4lB7w/exec";

const customBlacklist = [
  "example.com",
  "suspicious-site.org",
  "phishingsite.com",
  "google.com",
  "facebook.com",
];

async function isUnsafeUrl(urlToCheck) {
  const body = {
    client: { clientId: "suspicious-site-warning", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: urlToCheck }]
    }
  };

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }
    );
    const data = await res.json();
    return data.matches && data.matches.length > 0;
  } catch (err) {
    console.error("Safe Browsing check failed:", err);
    return false;
  }
}

async function getReportCount(domain) {
  try {
    const response = await fetch(`${REPORT_API}?domain=${domain}`);
    const data = await response.json();
    return data.count || 0;
  } catch (err) {
    console.error("Failed to fetch report count:", err);
    return 0;
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    const hostname = url.hostname.replace(/^www\./, "");

    const isBlacklisted = customBlacklist.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    const [isUnsafe, reportCount] = await Promise.all([
      isUnsafeUrl(tab.url),
      getReportCount(hostname)
    ]);

    const isReportedDangerous = reportCount > 5;

    if (isBlacklisted || isUnsafe || isReportedDangerous) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      });
    }
  }
});
