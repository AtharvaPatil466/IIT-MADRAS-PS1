# DriveLegal — 3-Minute Judge Demo Script

**Total time budget: 180s. Speak the lines in italics; click what's in [brackets].**

---

## Timed walkthrough

| Time | Action |
| --- | --- |
| **0:00 – 0:15** | Open the web app to the Chat tab. _"DriveLegal answers traffic-law questions location-by-location."_ Type [What's the fine for no helmet in Mumbai?] → expect: "₹1,000 under MV Act §129, 3-month suspension." |
| **0:15 – 0:30** | Click the [HI] language toggle. Re-submit the same question. Devanagari response appears. _"Bilingual EN/HI by default."_ |
| **0:30 – 1:00** | Tab to [Calculator]. Set location [Bengaluru], violation [red_light], vehicle [car]. Submit. Result: ₹5,000 / §184. Click the [pay portal] link — echallan.parivahan.gov.in opens in a new tab. _"Geo-fenced lookup, automated challan calculator."_ |
| **1:00 – 1:30** | Tab to [Verify]. Inputs: location [Bengaluru], violation [red_light], vehicle [car], amount told [₹2,500]. Submit. Verdict card reads "OVERCHARGED by ₹1,500." _"Scam-check for citizens."_ |
| **1:30 – 2:00** | Tab to [Rights]. Location [Pune]. Point to the two columns: cop_can_demand vs cop_cannot_demand. _"Know-your-rights, jurisdiction-specific."_ |
| **2:00 – 2:30** | Kill the backend (Ctrl-C in the terminal). Return to the browser, reload the Calculator tab. Re-run [Bengaluru, red_light, car] — result still appears, amber "Offline mode" pill visible in the header. _"Service worker plus cached snapshot for low-network conditions."_ |
| **2:30 – 2:55** | Restart the backend. Switch the location field to [London], submit — GBP fine appears. Switch to [Dubai] — AED fine appears. Switch to [Los Angeles] — USD fine appears. _"Global applicability — IN, UK, UAE, USA seeded."_ |
| **2:55 – 3:00** | _"Repo and deck linked below. Thank you."_ |

---

## Backup talking points

- **If the Anthropic API key fails:** the deterministic RAG fallback still returns a cited answer drawn from the ChromaDB corpus. The response field `confidence` will read `medium` instead of `high`, and no Claude call is made. The app does not break.
- **If the mobile app crashes during the demo:** pivot immediately to the web app. Mention that the Android APK is available as a direct download from the README — judges can install it on any Android device.
- **If the network drops mid-demo:** that IS the offline-mode segment — lean into it. The service worker demonstration is strongest when the drop is unplanned, because it shows the cache held across a real network loss, not a staged one.
