# Canam Facility Services Ltd

Full-stack website and MongoDB CMS built with Next.js App Router, strict TypeScript, Tailwind CSS, Mongoose, GSAP/ScrollTrigger, Lenis, Framer Motion, React Hook Form, and Zod.

## Setup

Requirements: Node.js 20.9+, npm, and MongoDB Community Server. MongoDB Compass is optional and works as the database viewer.

```bash
npm install
# Copy .env.example to .env and replace its password/secret
npm run seed
npm run dev
```

Start MongoDB before seeding. On Windows this is normally the `MongoDB` service. The default URI uses the Compass-visible database `canam_facility`. Visit `http://localhost:3000`; admin login is at `/admin/login`.

The seed is idempotent and updates known records without duplicating them. The admin password is bcrypt-hashed. Use a password of at least 12 characters and a long random `AUTH_SECRET`.

## Validation and production

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Public routes: `/`, `/about`, `/services`, `/services/[slug]`, `/testimonials`, `/faqs`, `/contact`, `/booking`, `/privacy-policy`, and `/terms`.

Admin modules: dashboard, Pages, Services, Gallery, Testimonials, FAQs, Pricing, Blog, Inquiries, Bookings, and Settings under `/admin`.

Contact and booking forms persist to MongoDB and send notification email when SMTP is configured in `.env`. The public site continues to display `info@canamfacility.ca`; form notifications are delivered to `NOTIFY_EMAIL` (typically the Gmail inbox used for SMTP). Mutation endpoints validate data, use honeypots and basic in-process rate limiting, and admin APIs require a signed HTTP-only session cookie.

## Upload storage

CMS uploads are stored under `public/uploads/` in the `pages`, `services`, `gallery`, `testimonials`, `blogs`, and `settings` folders. Handlers allow approved image MIME types, normalize extensions, generate collision-safe names, enforce an 8 MB limit, and prevent path traversal.

**Deployment requirement:** local-disk uploads require a persistent Node/VPS filesystem or mounted persistent volume. They are not durable on an ephemeral serverless filesystem. This implementation intentionally does not use Cloudinary, S3, Firebase, or another hosted provider.

Back up both MongoDB and `public/uploads`:

```bash
mongodump --uri="mongodb://127.0.0.1:27017/canam_facility" --out=./backup/mongodb
```

Restore MongoDB with `mongorestore` and copy uploaded files back to the same paths.

## Content notes

- Seed content uses curated Unsplash photography for fleet, commercial, and residential cleaning visuals. Replace images in the CMS with your own licensed photography for production.
- New published services automatically receive dynamic routes.
- Sample testimonial content is unpublished until replaced with verified customer material.
- Pricing records are unpublished and global `showPricing` defaults to false.
- Privacy and Terms are starter text requiring owner/legal review before production.
