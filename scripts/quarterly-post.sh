#!/bin/zsh
# Runs the quarterly blog-post pipeline headlessly. Invoked by the
# com.seprab.quarterly-post LaunchAgent (~/Library/LaunchAgents/) on the 1st
# of Jan/Apr/Jul/Oct, or manually: ./scripts/quarterly-post.sh
# Logs to ~/.claude/quarterly-post.log. The pipeline itself is defined in
# .claude/skills/quarterly-post/SKILL.md and always ends in a PR — it never
# publishes anything directly.
set -euo pipefail

REPO="/opt/UnitySrc/seprab"
LOG="$HOME/.claude/quarterly-post.log"
CLAUDE="$HOME/.local/bin/claude"

# Source the user's env (gh auth, ZENDESK_* vars if exported in ~/.zshenv).
[ -f "$HOME/.zshenv" ] && source "$HOME/.zshenv"

{
  echo "===== quarterly-post run: $(date) ====="
  cd "$REPO"
  "$CLAUDE" -p "/quarterly-post" \
    --allowedTools "Read,Write,Edit,Glob,Grep,WebFetch,WebSearch,Bash(git status:*),Bash(git log:*),Bash(git switch:*),Bash(git add:*),Bash(git commit:*),Bash(git push:*),Bash(gh api:*),Bash(gh pr create:*),Bash(curl:*)" \
    --max-turns 60
  echo "===== done: $(date) ====="
} >> "$LOG" 2>&1
