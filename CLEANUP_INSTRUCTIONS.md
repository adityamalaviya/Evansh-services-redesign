# PR Cleanup Instructions

## Problem
PR #1 contains ~877K lines of accidentally committed `.next/` build artifacts that are bloating the PR.

## Solution
Follow these steps to clean up the PR:

### Option 1: Interactive (Recommended)

```bash
# 1. Ensure you're on the backend/api branch
git checkout backend/api

# 2. Pull the latest changes
git pull origin backend/api

# 3. Remove .next/ from git tracking (keeps local files)
git rm -r --cached Evansh_Project/.next/

# 4. Verify the changes
git status

# 5. Commit the removal
git commit -m "chore: Remove .next/ build artifacts from git tracking

- Removes accidentally committed build files
- .next/ directory is now properly ignored by .gitignore
- Reduces PR size from 877K+ lines to manageable size"

# 6. Push to update the PR
git push --force-with-lease origin backend/api
```

### Option 2: Automated Script

Save this as `cleanup.sh` and run it:

```bash
#!/bin/bash

echo "🧹 Cleaning up .next/ build artifacts from PR..."

# Checkout branch
git checkout backend/api
git pull origin backend/api

# Remove from tracking
git rm -r --cached Evansh_Project/.next/
echo "✅ Removed .next/ from git tracking"

# Commit
git commit -m "chore: Remove .next/ build artifacts from git tracking

- Removes accidentally committed build files
- .next/ directory is now properly ignored by .gitignore
- Reduces PR size from 877K+ lines to manageable size"

# Push
git push --force-with-lease origin backend/api

echo "✅ PR cleanup complete!"
echo "🎉 The PR should now be mergeable"
```

## What happens next

After pushing:
1. PR will automatically update
2. Merge conflicts should resolve
3. PR will become mergeable
4. Code review can proceed

## Why `--force-with-lease`?

- `--force-with-lease` is safer than `--force`
- It prevents accidental overwriting of others' work
- It's the recommended way to rewrite branch history

## Need help?

If you encounter any issues:
1. Run `git status` to see the current state
2. Run `git log --oneline` to see recent commits
3. Never run `git push --force` without `--with-lease`

---
**Created**: 2026-07-16
**PR**: https://github.com/adityamalaviya/Evansh-services-redesign/pull/1
