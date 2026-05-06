# 6 Sample FAQs for OpenAir Atlantic

Copy these FAQs into Sanity Studio to populate the FAQ section. Use the FAQ schema in `sanity/schemas/faq.ts`.

---

## 1. What is OpenAir Atlantic?

**Category:** General  
**Order:** 1  
**Active:** Yes

**Answer:**
OpenAir Atlantic is a mobile-first environmental intelligence app for Prince Edward Island that tells you exactly when to go outside and what to do. Rather than just showing weather numbers, we interpret real-time environmental data through an AI meteorologist who speaks to you in plain English. We pull live data from Environment Canada, ECCC, and Fisheries & Oceans Canada — all free government sources with no ads or paywalls.

---

## 2. How does the Conditions Score work?

**Category:** General  
**Order:** 2  
**Active:** Yes

**Answer:**
Our AI meteorologist analyzes temperature, wind, precipitation, air quality, UV index, and visibility to give each location a score: Excellent (great conditions), Good (acceptable), Fair (manageable), or Stay Inside (not recommended). The score is based on what actually matters for outdoor activities, not just comfort. A location might be "Fair" for swimming but "Excellent" for photography because of different factors.

---

## 3. Why do weather conditions differ so much across PEI?

**Category:** Weather  
**Order:** 1  
**Active:** Yes

**Answer:**
Prince Edward Island is only 280 km long, but microclimates vary dramatically. The north shore (Cavendish, Malpeque) faces open ocean and gets stronger winds. The west side (Summerside) is more sheltered. Charlottetown in the center sits in an estuary. We track 8+ key locations so you find the best conditions right now, not a generic "PEI forecast" that misses these crucial differences.

---

## 4. What is the 3-Hour Window?

**Category:** Weather  
**Order:** 2  
**Active:** Yes

**Answer:**
The 3-Hour Window tells you how many minutes of good conditions you have before the weather changes. For example, "You have 1 hour 40 minutes before rain arrives at 2:30pm." This helps you decide if now is a good time to go out or if you should wait for conditions to improve. It's the difference between a weather forecast (what will happen) and an action forecast (when to go now).

---

## 5. Is OpenAir available offline?

**Category:** Technical  
**Order:** 1  
**Active:** Yes

**Answer:**
Yes. OpenAir is built as a Progressive Web App (PWA) and caches the last known conditions so you can see data even without an internet connection. The timestamp shows you how fresh the data is. You can install it on your home screen (iOS: Share → Add to Home Screen; Android: Menu → Install App) and use it like a native app.

---

## 6. What does the Paw Index mean for my dog?

**Category:** Activities  
**Order:** 1  
**Active:** Yes

**Answer:**
The Paw Index tells you if conditions are safe for your dog. It considers air temperature (paw pad burns from hot pavement and overheating), pavement temperature from UV index (hot pavement can burn paw pads in minutes), and air quality (respiratory irritation from pollution). Green means safe for extended walks, yellow means monitor your dog, red means keep walks very short or stay inside.

---

## Instructions for Adding to Sanity

1. Go to your Sanity Studio dashboard
2. Click "Create" → Select "FAQ"
3. Fill in:
   - **Question**: Copy the "Q" text
   - **Answer**: Copy the "Answer" text
   - **Category**: Select from the dropdown
   - **Order**: Use the number shown (1, 2, etc.)
   - **Active**: Leave checked
4. Click "Publish"
5. Repeat for all 6 FAQs

Once published, FAQs will automatically appear on:
- `/faq` main page (organized by category)
- `/faq?category=general` (filtered views)
- Throughout the app where FAQs are displayed

---

## Notes

- **Edit anytime**: Just update the document in Sanity and republish
- **Reorder**: Change the "Order" field to rearrange display order
- **Deactivate**: Uncheck "Active" to hide an FAQ without deleting it
- **Add more**: Follow the same pattern to add new FAQs
- **No code changes needed**: Everything is content-managed in Sanity
