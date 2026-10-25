---
'@anansi/core': patch
---

`anansi serve` no longer shows 5xx error messages or stack traces unless `NODE_ENV=development`

The SSR error page now shows only the status text (like "Internal Server Error") for 5xx errors; errors with a 4xx `status` still show their message. Stack traces now need `NODE_ENV=development`, including when `NODE_ENV` is unset, which used to show them. Full errors are still logged on the server.
