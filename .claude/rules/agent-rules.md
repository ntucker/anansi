---
paths:
  - "AGENTS.md"
  - "CLAUDE.md"
  - ".cursor/rules/**"
  - ".claude/rules/**"
  - "scripts/agent-rules.mjs"
---
<!-- Generated from .cursor/rules/agent-rules.mdc by `yarn build:agent-rules`. Edit the source. -->


# Agent guidance

- `AGENTS.md` loads every session for every harness (`CLAUDE.md` only imports it). Put guidance there only when every task needs it; anything tied to a directory or file type belongs in a rule with `globs`.
- `.cursor/rules/*.mdc` is the source. After editing one, run `yarn build:agent-rules` and commit the regenerated `.claude/rules/*.md`; never edit those by hand. CI's `lint` job runs `yarn build:agent-rules --check`.
- Every rule needs `globs` or `alwaysApply: true`; Claude Code has no description-only rules.
- Include only what an agent would get wrong after reading the code: commands, gotchas, cross-repo consequences. No file maps or restated parent guidance.
- Verify every command you add by running it.
