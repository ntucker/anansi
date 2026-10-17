---
"@anansi/core": patch
---

`anansi serve -a` serves build assets from the output directory only. Request paths such as `/../file` can no longer read files outside it (#3193).
