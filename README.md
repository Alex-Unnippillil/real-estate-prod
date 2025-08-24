# Real Estate Project

## Database Seeding

The backend uses Prisma for data access. To populate a development database with representative data run the seed script from the `server` directory:

```bash
cd server
npm install
npm run seed
```

The script creates sample managers and tenants (user roles), properties with geolocation coordinates, and applications linking tenants to properties. Ensure the `DATABASE_URL` environment variable points to a PostgreSQL database with PostGIS enabled before running the command.
