// apps/extension/src/background.ts
console.log("Flow-X Background Worker Started");

const TELEMETRY_INTERVAL = 60; // 60 seconds
let activeSiteData: { [domain: string]: { duration: number, category: string } } = {};

let lastActiveTime: number = Date.now();
let lastDomain: string | null = null;

const DEEP_WORK = ["leetcode.com", "hackerrank.com", "geeksforgeeks.org", "github.com"];
const DISTRACTIONS = ["instagram.com", "youtube.com", "web.telegram.org", "twitter.com", "x.com"];

function categorizeDomain(domain: string): string {
  if (DEEP_WORK.some(dw => domain.includes(dw))) return "Deep Work";
  if (DISTRACTIONS.some(d => domain.includes(d))) return "Distraction";
  return "Neutral";
}

function commitTime() {
  if (lastDomain) {
    const now = Date.now();
    const duration = Math.floor((now - lastActiveTime) / 1000);
    if (duration > 0) {
      if (!activeSiteData[lastDomain]) {
        activeSiteData[lastDomain] = { duration: 0, category: categorizeDomain(lastDomain) };
      }
      activeSiteData[lastDomain].duration += duration;
    }
    lastActiveTime = now;
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  commitTime();
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleNewTab(tab.url);
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    commitTime();
    handleNewTab(changeInfo.url);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    commitTime();
    lastDomain = null;
  } else {
    const tabs = await chrome.tabs.query({ active: true, windowId });
    if (tabs.length > 0) handleNewTab(tabs[0].url);
  }
});

function handleNewTab(url?: string) {
  if (!url || !url.startsWith("http")) {
    lastDomain = null;
    return;
  }
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    lastDomain = domain;
    lastActiveTime = Date.now();
  } catch(e) { lastDomain = null; }
}

chrome.alarms.create("syncTelemetry", { periodInMinutes: TELEMETRY_INTERVAL / 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "syncTelemetry") {
    commitTime(); // Ensure latest partial time is calculated

    const payload = Object.entries(activeSiteData).map(([domain, data]) => ({
      domain,
      ...data
    }));

    if (payload.length > 0) {
      try {
        const userId = "mock-user-id"; // In production, grab securely from storage / Auth
        await fetch("http://localhost:3000/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, telemetry: payload })
        });
        // Clear locally on success
        activeSiteData = {};
      } catch (err) {
        console.error("Failed to sync telemetry", err);
      }
    }
  }
});
