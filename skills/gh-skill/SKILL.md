---
name: gh-skill
description: "GitHub CLI (gh) master command reference with best practices. Use when user asks about gh commands, GitHub workflows, PR management, issue tracking, repo operations, or any GitHub CLI tasks."
trigger: /gh
---

# /gh

GitHub CLI (gh) is the official command-line tool for GitHub. This skill provides comprehensive command coverage and best practices for seamless GitHub workflows from the terminal.

## Usage

```
/gh pr create --fill                    # Create PR with auto-filled title/body
/gh issue list --label bug              # List all bug issues
/gh repo clone owner/repo               # Clone a repository
/gh run watch                           # Watch workflow run until complete
/gh auth status                         # Check authentication state
```

## Command Categories

### Core Commands

| Command | Description |
|---------|-------------|
| `gh auth` | Authenticate gh and git with GitHub |
| `gh browse` | Open repos, issues, PRs in browser |
| `gh codespace` | Connect to and manage codespaces |
| `gh gist` | Manage GitHub gists |
| `gh issue` | Manage issues |
| `gh org` | Manage organizations |
| `gh pr` | Manage pull requests |
| `gh project` | Work with GitHub Projects |
| `gh release` | Manage releases |
| `gh repo` | Manage repositories |
| `gh skill` | Install and manage agent skills (preview) |

### GitHub Actions Commands

| Command | Description |
|---------|-------------|
| `gh cache` | Manage GitHub Actions caches |
| `gh run` | View workflow run details |
| `gh workflow` | View workflow details |

### Additional Commands

| Command | Description |
|---------|-------------|
| `gh alias` | Create command shortcuts |
| `gh api` | Authenticated API requests |
| `gh attestation` | Work with artifact attestations |
| `gh completion` | Generate shell completions |
| `gh config` | Manage gh configuration |
| `gh copilot` | GitHub Copilot CLI |
| `gh extension` | Manage gh extensions |
| `gh gpg-key` | Manage GPG keys |
| `gh label` | Manage labels |
| `gh licenses` | View third-party licenses |
| `gh ruleset` | View repo rulesets |
| `gh search` | Search repos, issues, PRs |
| `gh secret` | Manage GitHub secrets |
| `gh ssh-key` | Manage SSH keys |
| `gh status` | Print relevant issues/PRs/notifications |
| `gh variable` | Manage GitHub Actions variables |

---

## Pull Requests (`gh pr`)

### Create and Manage PRs

```bash
# Create a PR with auto-filled title from commits
gh pr create --fill

# Create a PR targeting a specific base branch
gh pr create --base main --head feature-branch

# Create a PR with body from file
gh pr create --body-file pr-description.md

# View PR in browser
gh pr view --web

# View PR diff in terminal
gh pr diff 123
```

### Checkout, Review, Merge

```bash
# Checkout PR locally (creates remote branch)
gh pr checkout 123

# Check CI status for a PR
gh pr checks 123

# Add review (APPROVE, REQUEST_CHANGES, COMMENT)
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Fix the typo"

# Merge PR
gh pr merge 123 --squash  # Squash and merge
gh pr merge 123 --rebase  # Rebase and merge
gh pr merge 123 --delete-branch  # Auto-delete branch after merge

# Mark PR as ready for review
gh pr ready 123

# Update PR branch with base
gh pr update-branch 123
```

### List and Status

```bash
# List PRs (use --state, --label, --author filters)
gh pr list --state open --label "bug,needs-review"
gh pr list --author "@me"
gh pr list --base main

# Show status of relevant PRs
gh pr status

# Close a PR
gh pr close 123
```

---

## Issues (`gh issue`)

### Create and Manage Issues

```bash
# Create issue with title (opens editor for body)
gh issue create

# Create with labels and assignees
gh issue create --label bug --label "priority:high" --assignee "@me"

# Create with title and body in one command
gh issue create --title "Bug in login" --body "Steps to reproduce..."

# View issue in browser
gh issue view 123 --web

# Edit an issue
gh issue edit 123 --add-label "confirmed" --remove-label "needs-triage"
gh issue edit 123 --assignee "user1" --assignee "user2"

# Close/reopen issues
gh issue close 123
gh issue reopen 123
```

### List and Search

```bash
# List issues with filters
gh issue list --state open --label "bug"
gh issue list --assignee "@me"
gh issue list --author "username"
gh issue list --mention "username"  # Issues mentioning a user

# Pin/unpin issues
gh issue pin 123
gh issue unpin 123
```

### Development Workflow

```bash
# Create a linked branch for an issue (GitHub CLI creates branch automatically)
gh issue develop 123

# View issue with all associated data
gh issue view 123
```

---

## Repositories (`gh repo`)

### Clone, Create, Fork

```bash
# Clone a repository
gh repo clone owner/repo
gh repo clone https://github.com/owner/repo

# Create a new repository
gh repo create                        # Interactive
gh repo create my-project --public    # Public
gh repo create my-project --private   # Private
gh repo create my-project --clone     # Clone immediately

# Fork a repository
gh repo fork owner/repo
gh repo fork owner/repo --clone       # Fork and clone
```

### Manage Repos

```bash
# View repository info
gh repo view                          # Current directory repo
gh repo view owner/repo               # Specific repo
gh repo view --web                    # Open in browser

# Edit repository settings
gh repo edit --enable-issues=false
gh repo edit --description "New description"

# Sync repository (update from upstream)
gh repo sync owner/repo --source-branch main

# Archive/delete repository
gh repo archive owner/repo
gh repo delete owner/repo              # Requires confirmation

# Rename repository
gh repo rename new-name
```

### Repository List

```bash
# List repositories
gh repo list owner                    # By owner/organization
gh repo list --limit 50               # Limit results
```

---

## GitHub Actions (`gh run`, `gh workflow`, `gh cache`)

### Workflow Runs

```bash
# List recent runs
gh run list --workflow my-workflow.yml
gh run list --status failure          # Filter by status

# View run details
gh run view 12345
gh run view --jobid 67890            # View specific job

# Watch run until completion
gh run watch 12345

# Rerun a failed run
gh run rerun 12345

# Cancel a run
gh run cancel 12345

# Download artifacts
gh run download 12345               # Download all artifacts
gh run download 12345 --name "logs"  # Specific artifact
```

### Workflows

```bash
# List all workflows
gh workflow list

# View workflow summary
gh workflow view my-workflow.yml

# Enable/disable workflow
gh workflow enable my-workflow.yml
gh workflow disable my-workflow.yml

# Trigger workflow dispatch
gh workflow run my-workflow.yml --field environment=prod
gh workflow run my-workflow.yml -f name=value
```

### Cache Management

```bash
# List caches
gh cache list

# Delete a cache entry
gh cache delete <cache-id>
```

---

## Secrets and Variables

### Secrets (`gh secret`)

```bash
# List secrets
gh secret list

# Set a secret (value from stdin or argument)
echo "my-secret-value" | gh secret set MYSECRET
gh secret set API_KEY --body "value"

# Set for specific environment
gh secret set DEPLOY_KEY --env production

# Delete a secret
gh secret delete MYSECRET
```

### Variables (`gh variable`)

```bash
# List variables
gh variable list

# Set a variable
gh variable set MYVAR --body "my-value"

# Set for specific environment
gh variable set ENV_NAME --env staging --body "staging"

# Get variable value
gh variable get MYVAR

# Delete a variable
gh variable delete MYVAR
```

---

## Releases (`gh release`)

```bash
# Create a release
gh release create v1.0.0 --title "Version 1.0" --notes "Release notes"

# Create from tag
gh release create v1.0.0 --generate-notes

# Upload assets
gh release upload v1.0.0 ./binary-file

# List releases
gh release list

# View release
gh release view v1.0.0
gh release view v1.0.0 --json name,tagName,url

# Edit/delete releases
gh release edit v1.0.0 --title "New Title"
gh release delete v1.0.0
```

---

## Search (`gh search`)

```bash
# Search repositories
gh search repos "vue typescript starter" --limit 10

# Search issues
gh search issues "login bug is:issue state:open label:bug"

# Search PRs
gh search prs "feat: add authentication is:pr state:open"

# Search code
gh search code "useAuth hook" --repo owner/repo

# Search commits
gh search commits "fix: memory leak" --author "username"

# Exclude results (use -- before query on Unix)
gh search issues -- "exception -label:documentation"
```

---

## API (`gh api`)

```bash
# GET request (default)
gh api repos/owner/repo
gh api /repos/{owner}/{repo}/issues

# POST request with body
gh api repos/owner/repo/issues --field title="Bug" --field body="Description"

# Use GraphQL
gh api graphql --field query='{ viewer { login } }'

# Paginate through results
gh api repos/owner/repo/issues --paginate

# Custom headers
gh api -H "Accept: application/vnd.github+json" /rate_limit

# Output as JSON (jq compatible)
gh api repos/owner/repo --jq '.stargazers_count'
```

---

## Authentication (`gh auth`)

```bash
# Login interactively
gh auth login

# Login with token
gh auth login --with-token < my-token-file

# Check status
gh auth status

# Refresh credentials
gh auth refresh

# Setup git with GitHub
gh auth setup-git

# Switch accounts
gh auth switch

# Logout
gh auth logout
```

---

## Configuration (`gh config`)

```bash
# List all config
gh config list

# Get specific value
gh config get git_protocol
gh config get editor

# Set configuration
gh config set editor "vim"
gh config set git_protocol ssh
gh config set color_labels enabled

# Clear cache
gh config clear-cache
```

---

## Gists (`gh gist`)

```bash
# Create a gist
gh gist create file.txt
gh gist create "console.log('hello')" --filename app.js

# Create from file
gh gist create --filename app.js app.js
gh gist create file1.txt file2.txt

# List your gists
gh gist list

# View gist
gh gist view 5b0e0062eb8e9654adad7bb1d81cc75f

# Edit gist
gh gist edit 123 --add "new-content.txt"

# Clone gist locally
gh gist clone 5b0e0062eb8e9654adad7bb1d81cc75f
```

---

## Labels (`gh label`)

```bash
# List labels
gh label list

# Create label
gh label create bug --color "FF0000" --description "Bug report"
gh label create "priority:high" --color "FFCC00"

# Clone labels between repos
gh label clone owner/repo --source owner/other-repo

# Edit/delete labels
gh label edit bug --name "bug-report" --color "FF0000"
gh label delete bug
```

---

## Status Dashboard (`gh status`)

```bash
# Show your assigned work across repos
gh status

# Exclude specific repositories
gh status -e owner/repo

# Limit to organization
gh status -o my-org
```

---

## Best Practices

### Authentication

1. **Use `gh auth login`** for initial setup - it handles token storage securely
2. **Prefer HTTPS over SSH** for git operations unless you have SSH keys configured
3. **Use `gh auth setup-git`** after login to configure git credentials
4. **Check auth status** with `gh auth status` before running commands

### Output Formatting

1. **Use `--json`** for scriptable output: `gh pr list --json number,title,state`
2. **Use `--jq`** for filtering: `gh api /repos --jq '.[].full_name'`
3. **Use `--csv`** for spreadsheet compatibility: `gh issue list --csv`
4. **Use `--limit`** to control pagination: `gh repo list owner --limit 100`

### Working with PRs

1. **Use `--fill`** when creating PRs to auto-fill from commits
2. **Use `gh pr checkout <pr-number>`** to switch to PR branch - creates tracking branch
3. **Use `gh pr ready`** when PR is ready for review instead of adding comment
4. **Use `gh pr update-branch`** to sync PR with latest base before merging

### Working with Issues

1. **Use `gh issue create --label`** for quick creation with labels
2. **Use `gh issue develop`** to create linked branch without leaving terminal
3. **Use `--assignee "@me"`** to filter your assigned issues

### Scripting

1. **Always check exit code** - `gh` returns non-zero on errors
2. **Use `--quiet`** to suppress informational output in scripts
3. **Use `--jq`** with pagination for bulk operations
4. **Store token** securely - use environment variable or `gh auth login`

### Efficiency

1. **Use `-R/--repo`** flag to avoid context switching when outside repo
2. **Use aliases** for frequently used commands: `gh alias set prs "pr status"`
3. **Use `gh run watch`** instead of polling CI status
4. **Use `--web`** flag to open browser when visual inspection is needed

---

## Common Workflows

### Code Review Workflow

```bash
# Fetch and review a PR
gh pr checkout 123
gh pr diff 123
gh pr checks 123

# After review
gh pr review 123 --approve --body "LGTM"

# If changes needed
gh pr review 123 --request-changes --body "Please fix the typo"
```

### Bug Fix Workflow

```bash
# Create issue for bug
gh issue create --title "Bug in auth" --label bug

# Develop fix in linked branch
gh issue develop 123
git checkout -b fix/auth-bug

# Fix, commit, create PR
git commit -m "Fix auth bug"
gh pr create --fill

# After CI passes, merge
gh pr merge --squash
gh issue close 123
```

### Release Workflow

```bash
# Check status of main branch
gh run list --workflow "Release" --branch main

# Trigger release workflow
gh workflow run release.yml --field version=1.0.0

# Watch the run
gh run watch $(gh run list --json id --jq '.[0].id')

# Create GitHub release
gh release create v1.0.0 --generate-notes
```

---

## Anti-Patterns

1. **Do not** hardcode tokens in scripts - use `gh auth login` or environment variables
2. **Do not** use `git push --force` on branches with active PRs
3. **Do not** ignore exit codes in scripts - always check `$?` after `gh` commands
4. **Do not** use `gh api` for operations that have dedicated commands (pr, issue, repo) - the dedicated commands are more ergonomic
5. **Do not** forget `--repo` flag when running commands outside a git repository
6. **Do not** use `gh pr merge --admin` unless you have admin permissions - use `--squash` or `--rebase`
7. **Do not** create releases from local tags without matching GitHub tags - sync tags first with `gh repo sync`
8. **Do not** use `--force` with `gh repo sync` unless you understand it will overwrite local branches

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Misuse of command |
| 4 | Network error |
| 8 | Template error |
| 16 | Git protocol error |
| 32 | Bracket symbol error |
| 128 | Keyboard interrupt |

---

## Quick Reference

```bash
# Daily commands
gh auth status          # Check login
gh pr status            # Current PRs
gh issue list --assignee @me  # Your issues
gh run list --status failure  # Failed runs

# PR operations
gh pr checkout <num>     # Switch to PR
gh pr create --fill     # Create PR
gh pr merge <num>       # Merge PR
gh pr review <num> --approve  # Approve

# Issue operations
gh issue create         # New issue
gh issue list --label bug  # Bug issues
gh issue close <num>   # Close issue

# Repo operations
gh repo clone <repo>    # Clone
gh repo view --web      # Open in browser
gh repo sync           # Sync with upstream
```