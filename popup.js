function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
    window.close(); // close popup after showing
  }, 2000);
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlx_NbWONz1DjPLkwgSrHJRjhK8khnEvS3dD4gSHCO92zFLc7oRaUBOa5GevB9i4lB7w/exec";

// Update dot color based on count
function updateStatusDot(count) {
  const dot = document.getElementById("statusDot");
  if (count > 10) {
    dot.textContent = "🔴";
  } else if (count > 5) {
    dot.textContent = "🟠";
  } else {
    dot.textContent = "🟢";
  }
}

// Fetch live report count for the domain
function fetchReportCount(domain) {
  fetch(`${SCRIPT_URL}?domain=${encodeURIComponent(domain)}`)
    .then(res => res.json())
    .then(data => {
      const count = data.count || 0;
      document.getElementById("reportCount").textContent =
        `🔁 Reported by ${count} people`;
      updateStatusDot(count);
    })
    .catch(err => {
      console.error("Error fetching report count:", err);
      document.getElementById("reportCount").textContent =
        "⚠️ Could not load report count";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;

    fetchReportCount(domain); // 👈 Fetch and update report count + dot

    document.getElementById("reportBtn").addEventListener("click", () => {
      chrome.storage.local.get(["deviceId", "reportedDomains"], (result) => {
        let deviceId = result.deviceId;
        const reported = result.reportedDomains || [];

        if (!deviceId) {
          deviceId = crypto.randomUUID();
          chrome.storage.local.set({ deviceId });
        }

        if (reported.includes(domain)) {
          showToast("Already reported!");
          return;
        }

        fetch("https://script.google.com/macros/s/AKfycbybRZid4hQPHoK1Pg9KTnw0edqaluNLdxbcyg9O6so-8ex7Nl6kwpU_FaIWRyRghrlKgg/exec", {
          method: "POST",
          body: JSON.stringify({ domain, deviceId }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(() => {
            reported.push(domain);
            chrome.storage.local.set({ reportedDomains: reported });
            showToast("Reported successfully");
          })
          .catch((err) => {
            console.error("Error reporting:", err);
            showToast("Failed to report");
          });
      });
    });
  });
});
