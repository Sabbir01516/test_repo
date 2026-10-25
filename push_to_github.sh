#!/usr/bin/env bash
# ============================================================
# push_to_github.sh — Push this Hyperframes project to GitHub
# ============================================================
# Usage:
#   bash push_to_github.sh <GITHUB_REPO_URL>
#
# Example:
#   bash push_to_github.sh https://github.com/username/my-hyperframes-video.git
#   bash push_to_github.sh git@github.com:username/my-hyperframes-video.git
#
# Prerequisites:
#   - git installed
#   - GitHub authentication configured (SSH key or HTTPS token)
#     For HTTPS: git config --global credential.helper store
#     Then use a Personal Access Token as password
# ============================================================

set -euo pipefail

REPO_URL="${1:?Usage: bash push_to_github.sh <GITHUB_REPO_URL>}"

cd "$(dirname "$0")"

# Add remote (or update existing)
if git remote get-url origin &>/dev/null; then
  echo "🔄 Updating existing 'origin' remote..."
  git remote set-url origin "$REPO_URL"
else
  echo "➕ Adding 'origin' remote..."
  git remote add origin "$REPO_URL"
fi

echo "🚀 Pushing to $REPO_URL ..."
git push -u origin main

echo ""
echo "✅ Push complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Go to your GitHub repo: ${REPO_URL%.git}"
echo "   2. Click the 'Actions' tab"
echo "   3. The 'Render Hyperframes Video' workflow will run automatically"
echo "   4. Once complete, download 'rendered-video' artifact from the run page"
