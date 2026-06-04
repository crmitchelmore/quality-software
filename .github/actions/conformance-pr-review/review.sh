set -euo pipefail

BASE_REF="${BASE_REF:-main}"
REVIEW_DIR="${RUNNER_TEMP:-$PWD}/conformance-review"
REVIEW_JSON="$REVIEW_DIR/conformance-review.json"
REVIEW_ERR="$REVIEW_DIR/conformance-review.err"
CATALOGUE_ROOT="$(cd "$GITHUB_ACTION_PATH/../../.." && pwd)"
SUMMARY_FILE="${GITHUB_STEP_SUMMARY:-/dev/stdout}"

mkdir -p "$REVIEW_DIR"
: > "$REVIEW_ERR"

write_summary() {
  local status="$1"
  local message="$2"

  {
    echo "## Conformance PR review"
    echo
    echo "$message"
    echo
    if [ -s "$REVIEW_ERR" ]; then
      echo "### stderr"
      echo '```text'
      cat "$REVIEW_ERR"
      echo '```'
      echo
    fi
    echo "### output"
    echo '```json'
    cat "$REVIEW_JSON"
    echo '```'
    echo
    echo "Exit status: $status"
  } >> "$SUMMARY_FILE"
}

skip_review() {
  local reason="$1"

  cat > "$REVIEW_JSON" <<JSON
{"decision":"allow","blocking":[],"advisories":[],"findings":[],"summary":"Advisory conformance review skipped: $reason.","metadata":{"skipped":true}}
JSON
  write_summary 0 "Advisory review skipped: $reason."
  exit 0
}

if ! command -v node >/dev/null 2>&1; then
  skip_review "Node.js was unavailable"
fi

if ! command -v npm >/dev/null 2>&1; then
  skip_review "npm was unavailable"
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  skip_review "repository checkout was unavailable"
fi

if ! git check-ref-format --branch "$BASE_REF" >/dev/null 2>&1; then
  skip_review "base ref was invalid"
fi

if ! git rev-parse --verify --quiet "origin/$BASE_REF" >/dev/null; then
  git fetch origin "$BASE_REF:refs/remotes/origin/$BASE_REF" >> "$REVIEW_ERR" 2>&1 ||
    skip_review "base ref was unavailable"
fi

if ! (cd "$CATALOGUE_ROOT/integration" && npm ci --quiet >> "$REVIEW_ERR" 2>&1); then
  skip_review "conformance CLI dependencies could not be installed"
fi

set +e
CONFORMANCE_CATALOGUE_ROOT="$CATALOGUE_ROOT" \
  node "$CATALOGUE_ROOT/integration/bin/conformance.mjs" \
  review --base "origin/$BASE_REF" --json > "$REVIEW_JSON" 2> "$REVIEW_ERR"
status=$?
set -e

if [ ! -s "$REVIEW_JSON" ]; then
  skip_review "conformance review produced no JSON output"
fi

write_summary "$status" "Advisory only. This job does not block merges while the profile is warn-only."
exit 0
