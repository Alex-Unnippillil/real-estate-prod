# Security Policy

This project enforces a strict set of HTTP security headers for both the Next.js client and the Express server.

## Headers

- **Content-Security-Policy** – limits the origins for scripts, styles, images, fonts and other resources. The policy permits only resources from the application itself and uses a per-request nonce for inline scripts and styles.
- **Strict-Transport-Security** – forces browsers to use HTTPS for all requests for two years and includes sub‑domains.
- **X-Frame-Options** – set to `DENY` to prevent the site from being embedded in a frame.
- **X-Content-Type-Options** – set to `nosniff` to disable MIME type sniffing.
- **Referrer-Policy** – set to `same-origin`.

## Nonce Usage

A nonce is generated for every request and exposed to pages via the `x-nonce` request header. When authoring inline `<script>` or `<style>` tags, apply the nonce value:

```tsx
<script nonce={nonce}>/* inline code */</script>
<style nonce={nonce}>/* inline css */</style>
```

The nonce is also available on the root `<html>` element as a `data-nonce` attribute for client-side access.

## External Resources

If the application needs to load external resources (CDNs, images, fonts, etc.), update the directives in `client/src/middleware.ts` so the domains are whitelisted in the Content Security Policy. Any new external dependency **must** be reviewed for CSP compliance before being merged.
