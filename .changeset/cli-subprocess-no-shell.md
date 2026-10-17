---
"@anansi/cli": patch
---

`anansi init` and `anansi add` pass subprocess arguments as argv instead of through a shell, and `anansi hatch` rejects project names that are not unscoped npm package names. A crafted name can no longer run shell commands or create a directory outside the working directory (#3192).
