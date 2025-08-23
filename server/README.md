# Server

## API Caching

All API responses include a `Cache-Control` header to leverage HTTP caching.

```
Cache-Control: public, max-age=60, stale-while-revalidate=120
```

* **max-age=60** – Responses are considered fresh for 60 seconds.
* **stale-while-revalidate=120** – After responses become stale, they may still be served for up to 120 seconds while the server revalidates them in the background.
* **public/private** – Endpoints requiring authentication are marked `private` to prevent shared caches from storing user-specific data. All other GET endpoints use `public`.

Clients should rely on these headers when fetching data. The accompanying SWR hook in the client defaults to a `dedupingInterval` of 60 seconds to align with `max-age`.
