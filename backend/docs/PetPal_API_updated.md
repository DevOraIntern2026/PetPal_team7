# PetPal Backend API — Phase 1 & Community Update Handoff

Backend: ASP.NET Core 9 · EF Core · SQL Server · JWT auth
Scope: authentication, user profile, pet profile, medical history, image upload, **community (posts, follows, likes, comments)**, and **notifications**.

---

## 1. Getting started

| Item | Value |
|---|---|
| Base URL (local) | `https://localhost:<port>` or `http://localhost:<port>` (see `launchSettings.json`) |
| API docs (Development only) | `/scalar/v1` |
| Content type | `application/json` (except file upload: `multipart/form-data`) |
| Android emulator | use `http://10.0.2.2:<port>` instead of `localhost` |
| Real phone on same Wi-Fi | use the PC's LAN IP, and run the API with `--urls "http://0.0.0.0:<port>"` |

> Local HTTPS uses a self-signed dev certificate that mobile apps reject. For local mobile testing use the **http** URL.

---

## 2. Conventions

- **Auth:** send `Authorization: Bearer <token>` on every endpoint except `register` and `login`.
- **Token lifetime:** 60 minutes. There is no refresh token yet; call `login` again when you get `401`.
- **IDs:** GUIDs (e.g. `3fa85f64-5717-4562-b3fc-2c963f66afa6`).
- **Dates:**
  - `birthDate` is a date only: `"2024-05-10"` (`yyyy-MM-dd`).
  - `createdAt`, `updatedAt`, `recordedAt`, `expiresAt` are **UTC** ISO-8601 (`2026-10-08T10:30:00Z`). Convert to local time in the app.
- **Enums are sent and received as strings** (see section 3).
- **Age:** the app should display `ageInYears` from the API; it is calculated from `birthDate`.
- **Ownership:** every pet-related endpoint only works on the logged-in user's own data. Someone else's resource returns `404` (not `403`).

### Error format

All handled errors share one JSON shape:

```json
{ "statusCode": 400, "message": "Birth date is not valid." }
```

| Status | Meaning |
|---|---|
| 400 | Validation failed / bad data (message lists the reasons) |
| 401 | Missing or expired token, or wrong login credentials |
| 404 | Resource not found (or not yours) |
| 409 | Conflict (e.g. email already registered) |
| 500 | Unexpected server error (generic message) |

> Exception: a `401` caused by a **missing/invalid token** on a protected endpoint has an **empty body** (no JSON). Handle it by status code.

---

## 3. Enums

| Enum | Values |
|---|---|
| `gender` | `Unknown`, `Male`, `Female` |
| `bloodType` (optional, may be `null`) | Dogs: `DEA1Positive`, `DEA1Negative`, `DEA3Positive`, `DEA4Positive`, `DEA5Positive`, `DEA7Positive` · Cats: `TypeA`, `TypeB`, `TypeAB` |

---

## 4. Endpoints

### 4.1 Auth

**POST `/api/auth/register`**
```json
{ "fullName": "Nadeen Muharram", "email": "nadeen@example.com", "password": "Pass@1234" }
```
Password rules: min 8 chars, with upper-case, lower-case, digit and symbol.
Returns `200`:
```json
{
  "token": "eyJ...",
  "expiresAt": "2026-10-08T11:30:00Z",
  "userId": "…",
  "fullName": "Nadeen Muharram",
  "email": "nadeen@example.com"
}
```
Errors: `400` (invalid email / weak password / missing field), `409` (email already registered).

**POST `/api/auth/login`**
```json
{ "email": "nadeen@example.com", "password": "Pass@1234" }
```
Returns `200` (same shape as register). Errors: `400` (missing field), `401` (wrong email or password).

### 4.2 User profile (auth required)

**GET `/api/users/me`** → `200`
```json
{
  "id": "…",
  "fullName": "Nadeen Muharram",
  "email": "nadeen@example.com",
  "country": "Egypt",
  "bio": "Dog mom | Professional treat provider",
  "profileImageUrl": "https://…/uploads/profiles/abc.jpg",
  "postsCount": 4,
  "followersCount": 256,
  "followingCount": 186,
  "createdAt": "2026-10-08T10:00:00Z"
}
```

**PUT `/api/users/me`**
```json
{ 
  "fullName": "Nadeen Muharram", 
  "country": "Egypt", 
  "bio": "Dog mom | Professional treat provider",
  "profileImageUrl": "https://…/uploads/profiles/abc.jpg" 
}
```
`fullName` is required (max 100). Email cannot be changed. Returns the updated profile.

**POST `/api/users/me/change-password`**
```json
{ "currentPassword": "Pass@1234", "newPassword": "NewPass@123" }
```
Returns `204`. Errors: `400` (wrong current password / weak new password).

### 4.3 Lookups (auth required)

**GET `/api/lookups/pet-types`** → `200`
```json
[ { "id": "…", "name": "Dog" }, { "id": "…", "name": "Cat" } ]
```

**GET `/api/lookups/pet-types/{petTypeId}/breeds`** → `200`
```json
[ { "id": "…", "name": "Golden Retriever" } ]
```

### 4.4 Pets (auth required)

| Method | Path | Success |
|---|---|---|
| GET | `/api/pets` | `200` list of the user's pets |
| GET | `/api/pets/{id}` | `200` |
| POST | `/api/pets` | `201` + pet |
| PUT | `/api/pets/{id}` | `200` + pet |
| DELETE | `/api/pets/{id}` | `204` |

**Request body (POST and PUT):**
```json
{
  "petTypeId": "…",
  "breedId": "…",
  "name": "Rosy",
  "birthDate": "2024-05-10",
  "weightKg": 27.4,
  "heightCm": 56,
  "gender": "Female",
  "bloodType": null,
  "personality": "Friendly, playful...",
  "profileImageUrl": null
}
```

### 4.5 Medical history (auth required)

| Method | Path | Success |
|---|---|---|
| GET | `/api/pets/{petId}/medical-history` | `200` list |
| GET | `/api/pets/{petId}/medical-history/{id}` | `200` |
| POST | `/api/pets/{petId}/medical-history` | `201` + record |
| PUT | `/api/pets/{petId}/medical-history/{id}` | `200` + record |
| DELETE | `/api/pets/{petId}/medical-history/{id}` | `204` |

### 4.6 Image upload (auth required)

**POST `/api/files/upload?type=<profiles|pets|posts>`**
Body: `multipart/form-data` with one field named **`file`**.

Returns `200`:
```json
{ "url": "https://host/uploads/pets/3f2a….jpg", "path": "/uploads/pets/3f2a….jpg" }
```
- Allowed: JPEG, PNG, WebP. Max **5 MB**.

---

### 4.7 Follows (auth required)

| Method | Path | Success |
|---|---|---|
| POST | `/api/Follows/{userId}/toggle` | `200` Returns `{ "isFollowed": true/false, "message": "..." }` |
| GET | `/api/Follows/{userId}/followers` | `200` list of GUIDs |
| GET | `/api/Follows/{userId}/following` | `200` list of GUIDs |

### 4.8 Community (Posts, Likes, Comments, Saved) (auth required)

| Method | Path | Success | Description |
|---|---|---|---|
| GET | `/api/Posts/feed` | `200` list | Returns posts from followed users + own posts, ordered by newest. |
| POST | `/api/Posts` | `201` GUID | Creates a new post. |
| GET | `/api/Posts` | `200` list | Returns all posts for the community feed. |
| POST | `/api/Posts/{id}/like` | `200` | Toggles like (returns `true` if liked, `false` if unliked). |
| POST | `/api/Posts/{id}/save` | `200` | Toggles save (returns `true` if saved, `false` if unsaved). |
| GET | `/api/Posts/saved` | `200` list | Returns the logged-in user's saved posts. |
| POST | `/api/Posts/{id}/comments` | `201` GUID | Adds a comment to a post. |
| GET | `/api/Posts/{id}/comments` | `200` list | Returns all comments for a post. |

**Request body (Create Post):**
```json
{
  "content": "Meeting my little best friend!",
  "location": "Cairo, Egypt",
  "tags": "#dogs #golden",
  "images": [ { "content": "base64string...", "length": 1024 } ]
}
```

**Response (Post Feed / Saved):**
```json
[
  {
    "id": "…",
    "content": "Meeting my little best friend!",
    "location": "Cairo, Egypt",
    "tags": "#dogs #golden",
    "createdAt": "2026-10-08T10:15:00Z",
    "userId": "…",
    "userName": "Seif Muhammed",
    "userProfileImageUrl": "https://...",
    "likesCount": 125,
    "commentsCount": 50,
    "images": [ "https://.../posts/img1.jpg" ]
  }
]
```

### 4.9 Notifications (auth required)

| Method | Path | Success | Description |
|---|---|---|---|
| GET | `/api/Notifications` | `200` list | Returns all notifications for the logged-in user, ordered by newest. |
| PUT | `/api/Notifications/{id}/read` | `204` | Marks a specific notification as read. |

**Response (GET Notifications):**
```json
[
  {
    "id": "…",
    "type": "Like",
    "message": "liked your post",
    "referenceId": "…",
    "isRead": false,
    "createdAt": "2026-10-08T10:15:00Z",
    "triggerById": "…",
    "triggerByName": "Merna",
    "triggerByImageUrl": "https://..."
  }
]
```

---

## 5. Suggested onboarding flow (matches the UI)

1. `POST /api/auth/register` (or `login`) → store the token.
2. "Choose your pet" → `GET /api/lookups/pet-types`.
3. "Pet profile" → `GET /api/lookups/pet-types/{id}/breeds`, optionally `POST /api/files/upload?type=pets` for the photo.
4. Save → `POST /api/pets`.
5. "Health → History" → `POST /api/pets/{petId}/medical-history`.
6. Home / pet switching → `GET /api/pets`.
7. Community Feed → `GET /api/Posts/feed`.

---

## 6. Not in Phase 1 (coming in Phase 2 / 3)

Vaccinations (Vaccination Log), medications, reminders and push notifications, AI chatbot, nearby vets and appointments, lost-pet alerts. Adoption screens appear in the design but are outside the MVP brief.

## 7. Known limitations

- No refresh token, forgot-password, or email confirmation yet.
- Names of pet types and breeds are English only (Arabic names are planned).
- Uploaded images are stored on the API server's disk.
- Real-time SignalR notifications are not yet implemented (notifications are currently fetched via REST).