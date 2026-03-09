# ImpactLedger Frontend — Codebase Analysis

## What the app does

**ImpactLedger** is a React (Vite) SPA that connects NGOs and CSR investors:

- **NGOs** can: register, manage profile, create projects, upload receipts (AI OCR), generate Form 10BD, use voice input (transcribe/synthesize).
- **CSR investors** can: register, view dashboard, search NGOs (semantic search), view NGO details, express interest with proposed funding.
- **Auth**: JWT Bearer; login/register (with OTP step); role-based redirect (NGO → `/ngo/dashboard`, CSR → `/csr/dashboard`).

**Stack**: React 19, React Router 7, Axios, Tailwind 4, Framer Motion, Recharts, react-hook-form, react-hot-toast.  
**API**: All calls go through `src/services/api.js` (baseURL `/api`), proxied to `http://localhost:8080` in `vite.config.js`. Response handling assumes backend wrapper `{ success, message, data }`; code uses `res?.data || res` for payload.

---

## API integration vs `api_reference.md.resolved`

### Aligned

- **Auth**: Login, register, verify-otp paths and payloads match.
- **NGO**: getProfile, updateProfile, getProjects, createProject — paths and request/response shapes match.
- **Receipts**: upload (FormData with `file`, `ngoId`), getStatus, getAll — aligned; multipart without manual `Content-Type`.
- **Compliance**: generateForm10BD, getForms, getFormPreview — aligned.
- **Investor**: getDashboard, expressInterest (investorId, ngoId, projectId, message, proposedFunding) — aligned.
- **Search**: POST `/search/semantic` with `{ query }` — aligned (filters not sent yet; see below).
- **Voice**: transcribe (FormData), synthesize — aligned.

### Issues and mismatches

1. **Global response wrapper**  
   Backend returns `{ success, message, data }`. Axios interceptor returns `response.data` (whole body). So `res = { success, message, data }` and the real payload is `res.data`. Pages that use `res?.data || res` are correct. **LoginPage** uses `userData = res.data || res` then `userData.token` — correct. **Error path**: interceptor rejects `error.response?.data || error.message`. If backend sends `{ success: false, message: "..." }`, `err.message` might be that object; toast may show `[object Object]`. Safer to use `err?.message` only when it’s a string, or normalize in the interceptor.

2. **Search results — field names**  
   API returns **camelCase**: `ngoId`, `organizationName`, `description`, `impactNarrative`, `causeAreas`, `geographicFocus`, `verificationStatus`, `totalBeneficiaries`, `totalFundingReceived`, `similarityScore`.  
   **NGOResultCard** expects **snake_case**: `organization_name`, `location`, `verified`, `predicted_sroi`, `relevance_score`, `impact_summary`, `match_explanation`, `funding_required`, `beneficiaries`, `projects_count`, `cause_areas`.  
   So search results will show empty/wrong data unless the card is updated to use API fields (and fallbacks for legacy names), e.g. `organizationName`, `verificationStatus === 'VERIFIED'`, `similarityScore`, `description` or `impactNarrative`, `totalBeneficiaries`, `totalFundingReceived`, `causeAreas`, and derive location from `geographicFocus?.states`.

3. **Search filters not sent**  
   SearchPage has filters (Cause Area, State, Min SROI, Verification) but **only `query`** is sent. API supports `causeAreas`, `states`, `limit`. Filters should be bound to state and included in `searchAPI.semantic({ query, causeAreas, states, limit })`.

4. **Cause area values**  
   **constants.js** uses lowercase: `education`, `health`, etc. API examples use **capitalized** values (`"Education"`, `"Healthcare"`). If the backend expects capitalized values, registration/search may not match. Prefer aligning constants with API (e.g. `Education`, `Healthcare`) or mapping before sending.

5. **NGO dashboard stats**  
   Dashboard uses `profileData?.activeProjects` and `profileData?.complianceForms` and `profileData?.recentActivity`. Per API reference, **GET NGO profile** does **not** return these; it returns `totalFundingReceived`, `totalBeneficiaries`, `profileCompleteness`, `verificationStatus`, etc. So:
   - Active Projects and Compliance Forms will stay 0 unless you either (a) get projects count and forms count from `ngoAPI.getProjects(ngoId)` and `complianceAPI.getForms(ngoId)` and derive stats, or (b) extend the backend profile to include them.
   - Recent Activity will stay empty unless the backend adds it to the profile response.

6. **Receipt status case-sensitivity**  
   API reference shows `processingStatus`: `"PROCESSING"` (uppercase). Frontend compares with lowercase: `getStatus(r) === 'completed'`, `rawStatus` in ReceiptCard mapped to `completed` / `processing` / `failed`. If backend returns `COMPLETED` or `PROCESSING`, counts and labels will be wrong. Normalize status to lowercase (e.g. `(r.processingStatus || r.status || '').toLowerCase()`) before comparing and in ReceiptCard.

7. **Receipt extracted data**  
   API says `extractedData`: `{ "vendor": "...", "amount": 50000, "date": "2026-03-01" }` (e.g. `vendor`). ReceiptCard uses `extracted.vendor_name || receipt.vendor`; CompliancePage uses `extracted.vendor_name || extracted.vendor`. Prefer `extracted.vendor` as primary to match API.

8. **NGO detail page — profile shape**  
   **NGODetailPage** uses `ngoData.contact`, `ngoData.state`, `ngoData.districts`. API profile returns **contactInfo** (address, website, etc.) and **geographicFocus** (states, districts). So:
   - Use `ngoData.contactInfo` for phone/email/website (and contactInfo.address).
   - Use `ngoData.geographicFocus?.states?.[0]` for state and `ngoData.geographicFocus?.districts` for districts.  
   Otherwise contact and location may be blank.

9. **Express Interest — project list**  
   ExpressInterestModal has “Select Project” but only “All Projects” option; it doesn’t load the NGO’s projects. To support projectId, fetch `ngoAPI.getProjects(ngo.id)` when the modal opens and fill the dropdown.

10. **Register flow vs backend**  
    API reference says Register **response data** is same as Login (token, userType, etc.). Frontend always goes to OTP step after register and then calls verify-otp. If your backend actually returns a token on register (no OTP), the frontend would still show OTP and never use that token. Confirm with backend: does register (a) return token directly, or (b) send OTP and require verify-otp for token?

11. **OTP copy**  
    Step 4 says “We've sent a 6-digit code to your **phone**” but API verify-otp uses **email** + OTP. If OTP is sent by email, the copy should say “email”.

12. **Route protection**  
    Dashboard and other authenticated routes are not wrapped in a “require auth” component. If a user hits `/ngo/dashboard` without being logged in, `getUserId(user)` is null and API calls can fail or no-op. Consider a protected-route wrapper that redirects to `/login` when `!user`.

13. **404 / missing routes**  
    Sidebar links to `/ngo/notifications`, `/csr/portfolio`, `/csr/interests`, `/csr/notifications`, `/csr/settings` but **App.jsx** has no routes for these. They will hit the 404 fallback. Either add routes or point these to `#` or a “Coming soon” page.

---

## Suggested fixes (short list)

| # | Fix |
|---|-----|
| 1 | **NGOResultCard**: Use API field names (`organizationName`, `verificationStatus`, `similarityScore`, `totalBeneficiaries`, `totalFundingReceived`, `causeAreas`, `geographicFocus`) with fallbacks for snake_case. |
| 2 | **SearchPage**: Add state for filters; send `causeAreas`, `states` (and optionally `limit`) in `searchAPI.semantic()`. |
| 3 | **Receipt status**: Normalize `processingStatus`/`status` to lowercase in ReceiptsPage (getStatus, filter/counts) and ReceiptCard (rawStatus). |
| 4 | **NGODetailPage**: Use `contactInfo` for phone/email/website/address and `geographicFocus.states` / `geographicFocus.districts` for location. |
| 5 | **NGO dashboard**: Either fetch projects count and forms count from existing APIs and derive Active Projects / Compliance Forms (and optionally recent activity), or document that these are placeholders until backend supports them. |
| 6 | **ExpressInterestModal**: Optionally load NGO projects when modal opens and populate project dropdown so projectId can be sent. |
| 7 | **Error handling**: In axios response interceptor, ensure rejected value has a string `message` (e.g. from `error.response?.data?.message`) so toasts don’t show `[object Object]`. |
| 8 | **Cause areas**: Align constants with API (e.g. `Education`, `Healthcare`) or map when calling register/search. |
| 9 | **Protected routes**: Add a wrapper that redirects to `/login` when `!user` for `/ngo/*` and `/csr/*`. |
| 10 | **Sidebar**: Add routes for notifications/portfolio/interests/settings or change links to avoid 404. |

---

## When you share screenshots

Once you paste the failing screenshots, we can map them to the items above (e.g. search results empty, receipt status wrong, NGO detail contact missing, login/register errors) and suggest concrete code changes or fixes in the relevant files.
