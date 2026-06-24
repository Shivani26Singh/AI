# API Contract Validator — Manual Test Plan

Use this to validate the Langflow **API Contract Validator** against 7 edge-case scenarios.

**Flow:** API Request → API Contract Validator → Chat Output

**Target API:** Restful Booker (`https://restful-booker.herokuapp.com`)

---

## T01 — Status Mismatch (500)

**Goal:** Point a call at an endpoint that returns 500. Verify the report marks it **failed** with expected-vs-actual, not a pass.

| Field | Value |
|---|---|
| URL | `https://restful-booker.herokuapp.com/booking/sadf1234` (a non-existent booking ID or endpoint that forces a 500) |
| Method | `GET` |

**Setup:**
1. Set API Request URL to the endpoint above
2. Paste this JSON Schema in the Validator:
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "properties": {
       "firstname": { "type": "string" }
     },
     "required": ["firstname"]
   }
   ```

**Expected behavior:**
- API Request returns `status_code: 500` and the body will be HTML or a non-JSON error, NOT a valid booking object
- Validator should parse the response and report `"overall_passed": false` with clear errors — **not** `"overall_passed": true`

**Pass criteria:** The report shows `overall_passed: false` and the error describes the mismatch (e.g., non-object body or unparseable content). The validator never fabricates a pass.

---

## T02 — Type Drift

**Goal:** Validate a response where `totalprice` comes back as a **string**. The schema check must fail and **name the field**.

**Setup:**
1. Create a booking first via POST:
   - URL: `https://restful-booker.herokuapp.com/booking`
   - Method: `POST`
   - Body: `{ "firstname": "Tester", "lastname": "McTest", "totalprice": 123, "depositpaid": true, "bookingdates": { "checkin": "2025-01-01", "checkout": "2025-01-10" } }`
2. Grab the `bookingid` from the response
3. Fetch that booking: `GET https://restful-booker.herokuapp.com/booking/{bookingid}`
4. *Simulate type drift* by placing the validator between the raw response and a **modified** schema, OR use a proxy to rewrite `totalprice` to a string like `"123"` before it reaches the validator.
5. Schema to use in the validator:
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "properties": {
       "totalprice": { "type": "number" }
     },
     "required": ["totalprice"]
   }
   ```

**Expected behavior:**
- The validator's Draft7Validator runs `iter_errors()` on the response
- It catches that `totalprice` is a string but the schema says `number`
- The error message **must name the field**: e.g., `"totalprice: '123' is not of type 'number'"` or similar

**Pass criteria:** `overall_passed: false` and the `errors` array contains an entry referencing the field `totalprice` and the type mismatch. A vague "validation failed" without naming the field is a **fail**.

---

## T03 — Missing Required Field

**Goal:** Drop a required key like `lastname`. Verify `schema_ok` is false with a clear "required property" error.

**Setup:**
1. Use any GET endpoint that returns an object (e.g., `GET https://restful-booker.herokuapp.com/booking/1`)
2. Schema to use:
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "properties": {
       "firstname": { "type": "string" },
       "lastname": { "type": "string" }
     },
     "required": ["firstname", "lastname"]
   }
   ```
3. *Simulate the missing field* by editing the API response before it reaches the validator — or use a booking ID that returns a response missing `lastname` entirely. (Restful Booker always returns `lastname` for valid bookings, so you may need to intercept the response or use a stub.)

**Expected behavior:**
- Validator's `_run_validation` iterates errors from Draft7Validator
- On a response missing `lastname`, the error message must contain `"required property"` or `"is a required property"` language

**Pass criteria:** `overall_passed: false`. The errors array includes something like `root: 'lastname' is a required property` — clearly identifying the missing field and that it's a required-property violation.

---

## T04 — Token Threading

**Goal:** Confirm the `Cookie: token=` header appears **only** on PUT/PATCH/DELETE, never on auth, POST, or GET.

This test validates **header behaviour** — the validator doesn't check headers, so this is a manual inspection test.

**Steps:**
1. **Auth (POST)** — `POST https://restful-booker.herokuapp.com/auth` with body `{ "username": "admin", "password": "password123" }`. Open the API Request component's **Headers** table. Verify there is **no** `Cookie` header.
2. **GET** — `GET https://restful-booker.herokuapp.com/booking/1`. Verify **no** `Cookie` header.
3. **POST (create)** — `POST https://restful-booker.herokuapp.com/booking`. Verify **no** `Cookie` header. (Use a valid booking body.)
4. **PUT** — `PUT https://restful-booker.herokuapp.com/booking/1`. Add `Cookie: token={your_token}` in Headers. Verify the header **is present**.
5. **PATCH** — `PATCH https://restful-booker.herokuapp.com/booking/1`. Add `Cookie: token={your_token}` in Headers. Verify the header **is present**.
6. **DELETE** — `DELETE https://restful-booker.herokuapp.com/booking/1`. Add `Cookie: token={your_token}` in Headers. Verify the header **is present**.

**How to get a token:**
```bash
POST https://restful-booker.herokuapp.com/auth
Body: { "username": "admin", "password": "password123" }
→ Response: { "token": "abc123" }
```

**Pass criteria:** The `Cookie: token=` header appears in the Headers table **only** for PUT, PATCH, and DELETE. It is **absent** for GET, POST, and the auth endpoint.

---

## T05 — Bad-Credentials Trap

**Goal:** Use a wrong password. Verify auth fails on **missing token** even though Restful Booker returns 200.

**Setup:**
1. Call the auth endpoint with bad credentials:
   - URL: `https://restful-booker.herokuapp.com/auth`
   - Method: `POST`
   - Body: `{ "username": "admin", "password": "wrongpassword" }`
2. Schema (validates the response shape):
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "properties": {
       "token": { "type": "string" }
     },
     "required": ["token"]
   }
   ```

**What Restful Booker does:**
- Even with wrong credentials, Restful Booker returns **status 200** with body `{ "reason": "Bad credentials" }`
- No `token` field is present

**Expected behavior:**
- The validator passes the response body through `_normalize_response()` and validates against the schema
- The schema requires a `token` field of type string
- Since the body is `{ "reason": "Bad credentials" }`, the `token` field is missing
- Draft7Validator reports a required-property error

**Pass criteria:** `overall_passed: false` with an error like `root: 'token' is a required property`. The validator **must not** hallucinate a token or fabricate a pass just because the HTTP status was 200.

---

## T06 — DELETE Status

**Goal:** Verify a successful delete expects **201**, not 200 — the report must not flag the correct 201 as a failure.

**Background:** Restful Booker's DELETE returns `201 Created` on success (non-standard but intentional for this test). If the validator hardcodes "200 = success", it would wrongly flag 201 as a fail.

**Setup:**
1. Create a booking (POST), get the `bookingid`
2. DELETE it:
   - URL: `https://restful-booker.herokuapp.com/booking/{bookingid}`
   - Method: `DELETE`
   - Headers: `Content-Type: application/json`, `Cookie: token={your_token}`
3. Schema (validate the response):
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "object",
     "properties": {},
     "additionalProperties": false
   }
   ```

**Expected behavior:**
- Restful Booker returns `status_code: 201` with an empty body `{}`
- The empty object `{}` is valid against the schema above (no required fields, no additional properties allowed)
- The validator should report `overall_passed: true`

**Pass criteria:** The report shows `overall_passed: true, passed_count: 1, failed_count: 0`. The validator **must not** reject the 201 status or treat it as a failure. (If the validator were to check status code, it would need to accept 201 as a valid success for DELETE.)

**Note:** This test reveals whether the validator conflates status code with schema validity. Currently, the validator only checks the response body against the schema — so this should pass. If you enhance the validator later to check status codes, this test ensures 201 is correctly treated as success for DELETE.

---

## T07 — No Hallucinated Pass (Network Failure)

**Goal:** Break the network mid-run. The failed call must surface the **real error**, never a fabricated success.

**Setup:**
1. Set the API Request URL to any valid endpoint, e.g., `https://restful-booker.herokuapp.com/booking/1`
2. Set timeout to a low value, e.g., `3` seconds
3. **Break the network** — either:
   - Set an invalid/non-routable URL like `https://192.0.2.1/booking/1` (TEST-NET IP)
   - Use a URL pointing to a closed port like `https://localhost:1`
   - Or temporarily disconnect from the network
4. Schema — doesn't matter, any valid schema:
   ```json
   { "$schema": "http://json-schema.org/draft-04/schema#", "type": "object" }
   ```

**Expected behavior:**
- The API Request component raises an `httpx.RequestError` or timeout
- Its `make_request` catches it and returns `Data` with `status_code: 500` and an `error` field containing the real error message (e.g., `"All connection attempts failed"` or `"timed out"`)
- The validator receives this error response, parses it, and validates the body against the schema
- The report **must not** show `overall_passed: true`

**Pass criteria:**
- The report shows `overall_passed: false`
- The error surfaced by the validator is **real** — it describes a connection failure, DNS resolution failure, or timeout
- The validator **never** fabricates a success response, substitutes a fake body, or ignores the error to produce a pass
- The raw error text from the network failure is visible in the output (either in the Chat Output or in the validator's status)

---

## Summary Checklist

| TC | Scenario | Expected Result |
|---|---|---|
| T01 | 500 response body vs schema | `overall_passed: false` with mismatch error |
| T02 | `totalprice` is string, schema says number | `overall_passed: false`, error names `totalprice` |
| T03 | Required field `lastname` missing | `overall_passed: false`, "required property" error |
| T04 | Cookie header on wrong methods | Manual: present only on PUT/PATCH/DELETE |
| T05 | Bad credentials → no token in response | `overall_passed: false`, "required property: token" |
| T06 | DELETE returns 201, not 200 | `overall_passed: true` (201 is valid success) |
| T07 | Network failure | `overall_passed: false`, real error message surfaced |
