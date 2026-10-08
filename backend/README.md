# PetPal Backend

ASP.NET Core 9 · EF Core · SQL Server

## Run locally
1. Update the SQL Server connection string in `src/PetPal.API/appsettings.Development.json`.
2. Set your own JWT key (min 32 characters, never commit it):
```bash
   dotnet user-secrets init --project src/PetPal.API
   dotnet user-secrets set "Jwt:Key" "<your-long-random-key>" --project src/PetPal.API
```
3. Run: `dotnet run --project src/PetPal.API`
   Migrations and seed data (pet types and breeds) are applied automatically on startup.

## Docs
- API reference: `docs/PetPal_API_Phase1.md`
- Postman collection: `docs/PetPal_Phase1.postman_collection.json`