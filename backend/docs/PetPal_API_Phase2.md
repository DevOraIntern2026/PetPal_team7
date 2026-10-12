# PetPal API – Phase 2 additions

Roles, doctors & appointments, store/cart/orders, adoption listings.
**Status: written but NOT compiled or run** (no .NET SDK was available when this was authored). Run the commands in "Local setup" first.

Conventions: JSON enums are strings; timestamps are ISO-8601 UTC ending in `Z`; `TimeOnly` values are `"HH:mm:ss"`; money is `decimal(18,2)`.
Errors keep the existing shape `{ "statusCode": 400, "message": "..." }`. Auth failures come from the middleware (401 no/invalid token, 403 wrong role) with an empty body.

## Roles
| | |
|---|---|
| Roles | `Admin`, `User` (seeded idempotently at startup) |
| Register | always `User`; `RegisterRequest` has no role field |
| Login/Register response | existing fields unchanged + new `roles: ["User"]` |
| First admin | `AdminSeed:Email` + `AdminSeed:Password` (user-secrets / env vars). Created once; an existing account is never auto-promoted |

## Endpoints
`Any` = any authenticated user. Every endpoint below requires a Bearer token.

### Doctors
| Method | Route | Role |
|---|---|---|
| GET | `/api/doctors?specialty=&page=&pageSize=` | Any (active only) |
| GET | `/api/doctors/{id}` | Any (active only) |
| GET | `/api/doctors/{id}/availability?date=yyyy-MM-dd` | Any |
| GET | `/api/admin/doctors`, `/api/admin/doctors/{id}` | Admin (includes inactive) |
| POST | `/api/admin/doctors` | Admin |
| PUT | `/api/admin/doctors/{id}` | Admin |
| PUT | `/api/admin/doctors/{id}/schedule` | Admin |
| POST | `/api/admin/doctors/{id}/activate` / `deactivate` | Admin |

### Appointments
| Method | Route | Role |
|---|---|---|
| POST | `/api/appointments` | Any |
| GET | `/api/appointments/my` | Any (own) |
| GET | `/api/appointments/{id}` | Owner or Admin (others get 404) |
| DELETE | `/api/appointments/{id}` | Owner or Admin – soft cancel, returns 204 |
| GET | `/api/admin/appointments?doctorId=&date=&status=&page=&pageSize=` | Admin |
| PUT | `/api/admin/appointments/{id}/status` (`Cancelled` or `Completed`) | Admin |

### Store, cart, orders
| Method | Route | Role |
|---|---|---|
| GET | `/api/products?category=&search=&page=&pageSize=` | Any (active only) |
| GET | `/api/products/{id}` | Any (active only) |
| GET/POST/PUT | `/api/admin/products`, `/api/admin/products/{id}` | Admin |
| POST | `/api/admin/products/{id}/activate` / `deactivate` | Admin |
| GET | `/api/cart` | Any (own) |
| POST | `/api/cart/items` – adds; existing product quantity is increased | Any |
| PUT | `/api/cart/items/{productId}` – sets absolute quantity (1–99) | Any |
| DELETE | `/api/cart/items/{productId}`, `/api/cart` | Any |
| POST | `/api/orders/checkout` | Any |
| GET | `/api/orders/my` | Any (own) |
| GET | `/api/orders/{id}` | Owner or Admin (others get 404) |
| GET | `/api/admin/orders?status=&page=&pageSize=` | Admin |
| PUT | `/api/admin/orders/{id}/status` | Admin |
| PUT | `/api/admin/orders/{id}/payment-status` (cash only, `Paid`, after `Delivered`) | Admin |

Order status transitions: `Pending → Confirmed | Cancelled`, `Confirmed → Shipped | Cancelled`, `Shipped → Delivered`. Cancelling restocks.

### Adoption
| Method | Route | Role |
|---|---|---|
| GET | `/api/adoption?location=&gender=&minAgeMonths=&maxAgeMonths=&minPrice=&maxPrice=&page=&pageSize=` | Any (Available only) |
| GET | `/api/adoption/my` | Any (own, excludes Removed) |
| GET | `/api/adoption/{id}` | Any if Available; owner/Admin otherwise |
| POST | `/api/adoption` | Any (owner = token user) |
| PUT / DELETE | `/api/adoption/{id}` | Owner only (DELETE is a soft remove) |
| GET | `/api/admin/adoption?status=&ownerId=` | Admin |
| PUT | `/api/admin/adoption/{id}/status` (Available/Adopted/Hidden/Removed) | Admin |
| DELETE | `/api/admin/adoption/{id}` | Admin |

## Booking design (double-booking protection)
* Appointments are always 30 minutes and start on `:00`/`:30`.
* SQL Server enforces it: `CHECK (EndUtc = DATEADD(MINUTE,30,StartUtc) AND minute%30=0 AND second=0)` and a **filtered unique index** `UX_Appointments_Doctor_Start_Active` on `(DoctorId, StartUtc) WHERE Status <> 'Cancelled'`.
* Because every interval has equal length and sits on one grid, two active appointments overlap only if their starts are equal, so the unique index prevents all overlaps. Cancelled rows are outside the index, so the slot can be rebooked.
* The service re-validates (future, grid, working hours, DST validity, free) and then inserts; the loser of a race gets a 409 from the index violation.
* Requires every UTC offset of `Scheduling:TimeZoneId` to be a multiple of 30 minutes (checked at startup). `Africa/Cairo` qualifies.
* Working hours are clinic-local, one interval per weekday, 30-minute boundaries. Local times that do not exist or are ambiguous (DST) are never offered.

## Examples
Availability
```
GET /api/doctors/3f2c.../availability?date=2026-10-20
200 { "doctorId":"3f2c...","doctorName":"Dr. Salma Adel","date":"2026-10-20","timeZoneId":"Africa/Cairo","slotMinutes":30,
      "slots":[{"startUtc":"2026-10-20T07:00:00Z","endUtc":"2026-10-20T07:30:00Z","localStart":"10:00","localEnd":"10:30"}] }
```
Book
```
POST /api/appointments   { "doctorId":"3f2c...","startUtc":"2026-10-20T07:00:00Z","notes":"Vaccination" }
201 { "id":"...","doctorName":"Dr. Salma Adel","startUtc":"2026-10-20T07:00:00Z","localStart":"2026-10-20T10:00","status":"Booked","consultationPrice":300.00, ... }
409 { "statusCode":409,"message":"This time slot has just been booked. Please choose another one." }
```
Set schedule
```
PUT /api/admin/doctors/{id}/schedule
{ "workingHours":[ {"dayOfWeek":"Monday","startTime":"09:00:00","endTime":"17:00:00"} ] }
```
Cart + checkout
```
POST /api/cart/items { "productId":"...","quantity":2 }
200 { "items":[{"productId":"...","productName":"Leather collar","unitPrice":120.00,"quantity":2,"subtotal":240.00,"isAvailable":true,"stockQuantity":18}],"totalQuantity":2,"total":240.00 }

POST /api/orders/checkout { "deliveryAddress":"12 Nile St, Tanta","paymentMethod":"Card" }
201 { "id":"...","orderDate":"...Z","items":[...],"totalAmount":240.00,"paymentMethod":"Card","paymentStatus":"Pending","status":"Pending", ... }
```
Adoption
```
POST /api/adoption { "petName":"Luna","location":"Tanta","gender":"Female","price":0,"weightKg":4.2,"ageInMonths":8,"about":"Vaccinated","imageUrl":"/uploads/pets/x.jpg" }
```

## Local setup
```bash
cd backend
dotnet restore
dotnet build PetPal.sln

# secrets (never commit these)
dotnet user-secrets --project src/PetPal.API set "Jwt:Key" "<at least 32 random characters>"
dotnet user-secrets --project src/PetPal.API set "AdminSeed:Email" "admin@petpal.local"
dotnet user-secrets --project src/PetPal.API set "AdminSeed:Password" "<strong password: 8+, upper, lower, digit, symbol>"

# generate the migration (Data/Migrations is where the existing one lives)
dotnet ef migrations add AddRolesDoctorsStoreAdoption \
  --project src/PetPal.Infrastructure --startup-project src/PetPal.API --output-dir Data/Migrations

# REVIEW before applying: only CreateTable/CreateIndex/AddCheckConstraint expected, no DropTable/DropColumn/AlterColumn on existing tables
dotnet ef migrations script --idempotent \
  --project src/PetPal.Infrastructure --startup-project src/PetPal.API -o review.sql

dotnet ef database update --project src/PetPal.Infrastructure --startup-project src/PetPal.API
dotnet run --project src/PetPal.API
```
The app also runs `MigrateAsync()` at startup (existing behaviour), so `database update` is optional.

Promote an existing account to Admin manually (SQL):
```sql
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT u.Id, r.Id FROM AspNetUsers u CROSS JOIN AspNetRoles r
WHERE u.Email = 'someone@example.com' AND r.Name = 'Admin';
```

Concurrency smoke test (after creating a doctor with a slot; replace values; 20 parallel bookings, expect exactly one 201 and the rest 409):
```bash
seq 20 | xargs -P20 -I{} curl -s -o /dev/null -w "%{http_code}\n" -X POST https://localhost:PORT/api/appointments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"doctorId":"DOCTOR_ID","startUtc":"2026-10-20T07:00:00Z"}' | sort | uniq -c
```
(Use different users' tokens to be realistic; with one user it still exercises the index.)

## Known limitations
* Card payments stay `Pending` forever until a payment gateway (webhook-confirmed) is integrated. No card data is accepted or stored.
* One working interval per weekday; cannot span midnight; last bookable slot starts 30 min before the end time (end ≤ 23:30 in practice).
* Changing a schedule or deactivating a doctor does not cancel already-booked appointments.
* A user can hold overlapping appointments with different doctors.
* No reschedule endpoint (cancel and rebook).
* Browsing endpoints require login; add `[AllowAnonymous]` to the browse actions if public browsing is wanted.
* Users deleted from Identity are blocked while they have orders/appointments (history is preserved by `Restrict`); no delete-account endpoint exists today.
* No automated tests exist in the repository, and none were added.
