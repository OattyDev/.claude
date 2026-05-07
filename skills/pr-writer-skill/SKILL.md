# PR Writer Skill

A comprehensive skill for crafting professional Pull Requests using GitHub CLI, following industry best practices.

## Core Principles

1. **Every PR must solve a problem** — if you cannot articulate the problem, the PR is not ready
2. **Titles are permanent artifacts** — they appear in merge queues, release notes, and git history forever
3. **The reviewer is your audience** — write for someone who has zero context about your work
4. **Ask before acting** — always confirm the target branch before creating a PR

---

## 1. Design Thinking

### Purpose
This skill guides engineers through writing clear, informative Pull Requests that:
- Communicate the problem being solved with precision
- Explain the solution approach and trade-offs made
- Provide sufficient context for efficient code review
- Enable future maintainers to understand intent via git history

### Tone
Surgical and direct. Every sentence in a PR description should add information. No pleasantries, no throat-clearing, no "Just a small PR here."

### Constraints
- PR titles follow Conventional Commits format
- Author is always `OattyDev <oatsakagusi@gmail.com>`
- Always use `gh pr create` (never GitHub web UI for routine PRs)
- Always confirm target branch before creation

### Differentiation
This skill treats PR writing as a form of technical communication — not a status update, but a document that lives alongside code indefinitely. The emphasis is on problem-first framing rather than change-listing.

---

## 2. Implementation Directive

### Before Creating Any PR

**Step 1: Determine the problem being solved**
Ask yourself: can I explain this in one sentence? If not, break it down.

**Step 2: Identify the target branch**
ALWAYS ask the user: "Which branch do you want to PR against?" (main, dev, release/*, etc.)

**Step 3: Draft the PR components**

| Component | Format | Example |
|-----------|--------|---------|
| Title | `<type>(<scope>): <short description>` | `feat(auth): add OAuth2 Google sign-in` |
| Body | Problem/Solution/Changes/Testing structure | See template below |
| Reviewers | Assign after creation | `gh pr edit` |

**Step 4: Create the PR**

```bash
# Using --fill (pulls title from latest commit, asks for body)
gh pr create --base <target-branch> --title "<title>" --body "<body>"

# Using --body-file (for complex/long descriptions)
gh pr create --base <target-branch> --title "<title>" --body-file /tmp/pr-body.md

# Create draft PR (work in progress)
gh pr create --base <target-branch> --draft

# Assign reviewer immediately
gh pr create --base <target-branch> --title "<title>" --body "<body>" --reviewer "username1,username2"
```

**Step 5: Verify and share**
```bash
# View the created PR
gh pr view --web

# Check PR status
gh pr status
```

---

## 3. Domain-Specific Guidelines

### 3.1 PR Title Conventions

Use **Conventional Commits** format:

```
<type>(<scope>): <imperative short description>
```

**Types:**

| Type | Use When |
|------|----------|
| `feat` | New feature added |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Maintenance tasks, dependency updates |
| `docs` | Documentation only changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous change |

**Rules:**
- Use imperative mood: "add" not "added" or "adds"
- Keep under 72 characters
- No period at the end
- Reference ticket numbers in body, not title (unless required by team conventions)

**Examples:**
```
feat(checkout): add coupon code support
fix(api): handle null response from payment gateway
refactor(auth): extract token refresh logic to dedicated service
chore(deps): upgrade React to 18.3.0
docs(readme): update local development setup instructions
```

### 3.2 PR Description Structure

Use this four-section template:

```markdown
## Problem
<!-- What problem does this PR solve? Why is this change necessary? -->

## Solution
<!-- How does this PR solve the problem? What approach was taken and why? -->

## Changes
<!-- Bullet list of specific changes made. Be specific. -->
- Added `CouponService` class with validation logic
- Updated `CheckoutController` to accept coupon parameter
- Added database migration for `coupons` table

## Testing
<!-- How was this tested? Include reproduction steps for bugs. -->
- Unit tests for `CouponService` pass (95% coverage)
- Manually tested checkout flow with valid/invalid codes
- Added integration tests for coupon API endpoint
```

**Additional Sections (when applicable):**

```markdown
## Breaking Changes
<!-- Any API contracts broken? Migration steps required? -->

## Migration
<!-- Steps to migrate existing data or configurations -->

## Screenshots
<!-- For UI changes, before/after comparisons -->

## Related Issues
<!-- Closes #123, Fixes #456 -->
```

### 3.3 Using gh pr create Flags

| Flag | Use Case |
|------|----------|
| `--fill` | Auto-fills title from latest commit, body from commit messages. Still allows editing. |
| `--title <title>` | Explicit title (use when commit message is not suitable) |
| `--body <body>` | Inline body for simple PRs |
| `--body-file <path>` | Reference a file for complex/long bodies |
| `--base <branch>` | Target branch (REQUIRED — always confirm with user) |
| `--head <branch>` | Source branch (defaults to current branch) |
| `--draft` | Mark as draft for work-in-progress |
| `--reviewer <users>` | Assign reviewers at creation time |
| `--label <labels>` | Add labels at creation time |
| `--milestone <name>` | Assign to milestone |
| `--assignee <users>` | Assign to specific users |
| `--no-edit` | Skip the interactive editor, use values as-is |

**Recommended workflow:**

```bash
# Standard feature PR
gh pr create --base main --title "$(git log -1 --format='%s')" --body-file /tmp/pr-description.md

# With reviewers and labels
gh pr create --base dev --title "feat(api): add rate limiting" --body "<body>" \
  --reviewer "alice,bob" --label "enhancement,api"

# Draft PR for WIP
gh pr create --base main --draft --title "feat(search): preliminary implementation"

# Using --fill and then editing
gh pr create --base main --fill  # Opens editor for final adjustments
```

### 3.4 Branch Selection Workflow

**CRITICAL: Always ask the user which branch to PR against.**

Common branching strategies:

| Strategy | Target Branches |
|----------|-----------------|
| GitHub Flow | `main` only |
| GitFlow | `main` (releases), `develop` (features) |
| Release branching | `release/*` for freeze periods |

**Confirmation template:**
```
Target branch: [main/dev/release/other]
```

**Do not assume.** If the user says "create a PR," always ask:
- "Which branch should this PR target?"
- "Should this go against `main` or `develop`?"

### 3.5 PR Quality Checklist

Before creating a PR, verify:

- [ ] Title follows Conventional Commits format
- [ ] Title is under 72 characters
- [ ] Problem section clearly explains WHY this change is needed
- [ ] Solution section explains the approach taken
- [ ] Changes section lists specific files/logic modified
- [ ] Testing section describes how changes were verified
- [ ] No secrets, credentials, or sensitive data in description
- [ ] Branch target confirmed with user
- [ ] PR is not a work-in-progress (unless marked draft)
- [ ] Linked related issues/tickets

---

## 4. Hard Constraints (Anti-Patterns)

### Never Do These

1. **Never create a PR without confirming the target branch**
   - This causes merge conflicts, broken builds, and review overhead
   - Always ask: "Which branch should this PR target?"

2. **Never use vague titles like "Update file" or "Fix bug"**
   - These are useless in git history and release notes
   - If you cannot write a descriptive title, you do not understand the change

3. **Never skip the problem explanation**
   - "What changed" is visible in the diff
   - "Why it changed" is only in the description
   - Reviewers need the "why" to evaluate correctness

4. **Never include generated files, binaries, or credentials**
   - Check `git status` before creating PR
   - Use `.gitignore` properly; do not rely on PR reviewers to catch this

5. **Never use --no-edit unless intentionally auto-filling**
   - You almost always want to review and adjust the PR description

6. **Never merge your own PR**
   - Even if you have permissions, this defeats the review purpose

7. **Never use purple gradients, Inter font, or Space Grotesk in any UI mockups**
   - (Applies if this skill is used alongside frontend-design skill)

8. **Never leave testing section blank for non-trivial changes**
   - "Tested locally" is not sufficient documentation
   - Specify: which tests, what coverage, what manual steps

---

## Common PR Templates

### Minimal PR (small fix, obvious change)
```markdown
## Problem
Fixes race condition in connection pool that causes intermittent test failures.

## Solution
Added mutex lock around connection acquisition. Ensures only one goroutine accesses pool at a time.

## Changes
- Added `sync.Mutex` to `DBPool` struct
- Wrapped `Acquire()` method with lock/unlock

## Testing
- Existing unit tests pass
- Ran 1000-iteration stress test without failure
```

### Feature PR
```markdown
## Problem
Users cannot save their preferences across sessions. Each visit requires re-configuration.

## Solution
Implemented localStorage-based preference persistence with a versioned schema for future migrations.

## Changes
- Added `PreferenceStore` class managing localStorage key/value
- Created migration system for schema version bumps
- Updated `SettingsPanel` to use `PreferenceStore`
- Added unit tests (87% coverage)

## Testing
- Manual testing: preferences persist across browser sessions
- Privacy mode: gracefully degrades to session-only
- Added integration tests for migration system
- Cross-browser tested on Chrome, Firefox, Safari
```

### Refactor PR
```markdown
## Problem
`UserService` has 847 lines and 12 responsibilities. Making auth changes requires understanding billing logic.

## Solution
Split into focused services: `AuthService`, `BillingService`, `UserProfileService`. Extracted shared types to `common/`.

## Changes
- Extracted `AuthService` from `UserService` (new file, 312 lines)
- Extracted `BillingService` from `UserService` (new file, 203 lines)
- Created `common/types.ts` for shared user types
- Updated all call sites to use new services
- Added integration tests for service boundaries

## Testing
- All 147 existing tests pass
- Added 23 new unit tests for service boundaries
- Manual testing of auth flow, billing calculations
```

### Bug Fix PR
```markdown
## Problem
Production incident: users with >500 items in cart receive 500 errors on checkout. First reported 2024-03-15, 14:23 UTC. Impact: ~12% of checkout attempts.

## Solution
Increased database connection pool limit and added pagination to cart item queries. Root cause was N+1 query pattern loading all items eagerly.

## Changes
- Added pagination to `Cart.getItems()` (limit/offset)
- Increased DB pool from 10 to 50 connections
- Added query timeout (30s) to prevent runaway queries
- Added metrics alert for cart size >100 items

## Testing
- Reproduced with test data (501 items): confirmed 500 error before fix
- After fix: cart loads in 1.2s with 1000 items
- Load test: 100 concurrent users with large carts, 0 errors
- Deployed to staging, monitored for 24h before merge
```

---

## Author Configuration

This skill always uses the following author identity:

```
Author: OattyDev <oatsakagusi@gmail.com>
```

This is set via GitHub CLI configuration:
```bash
gh config set user OattyDev
gh config set email oatsakagusi@gmail.com
```

Verify with:
```bash
gh api user --jq '.login'
```

---

## Quick Reference Commands

```bash
# Create PR with inline description
gh pr create --base main --title "feat(api): add endpoint" --body "$(cat <<'EOF'
## Problem
[description]
## Solution
[description]
## Changes
[list]
## Testing
[description]
EOF
)"

# Create PR from file
gh pr create --base main --title "feat(api): add endpoint" --body-file ./PR_DESCRIPTION.md

# Create draft PR
gh pr create --base main --draft --title "wip: feature"

# List all PRs
gh pr list --state open

# View PR in browser
gh pr view --web

# Check diff before PR
gh pr diff

# Edit existing PR
gh pr edit --title "new title" --body "new body"
gh pr edit --add-label "ready-for-review"
```
