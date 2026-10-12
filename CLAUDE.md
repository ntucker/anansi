@AGENTS.md

## Claude Code

- Cloud sessions rooted in this repo run the setup through `.claude/hooks/session-start.sh`. The hook also installs a sibling `../data-client` checkout.
- Sessions rooted elsewhere, such as a parent directory holding both checkouts, don't load this repo's hooks. Run `CLAUDE_CODE_REMOTE=true .claude/hooks/session-start.sh` by hand.
