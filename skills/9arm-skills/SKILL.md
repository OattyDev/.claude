---
name: 9arm-skills
description: Hub for 9arm engineering and productivity skills. Use /9arm-skills to see available skills and choose one to activate, or spawn parallel agents each running their own skill. Triggers when user says "9arm-skills", "use 9arm skills", "run 9arm", or wants to access debug-mantra, post-mortem, scrutinize, or management-talk skills.
---

# 9arm-skills Hub

Engineering and productivity skills for claude-brain sessions.

## Available Skills

### Engineering
| Skill | Description |
|-------|-------------|
| **debug-mantra** | Four-step debugging discipline: reproduce → trace fail path → falsify hypothesis → cross-reference breadcrumbs |
| **post-mortem** | Write the canonical engineering record of a fixed bug — root cause, mechanism, fix, validation |
| **scrutinize** | Outsider-perspective end-to-end review of a plan, PR, or code change |

### Productivity
| Skill | Description |
|-------|-------------|
| **management-talk** | Rewrite engineer-to-engineer content for engineering-org leadership (JIRA, Slack, email, standup) |

## How to Use

**Option 1 — Single skill:** Tell me which skill you want to use and I'll activate it.

**Option 2 — Parallel agents:** I can spawn multiple agents in parallel, each running a different skill from 9arm-skills. This is useful when you have independent tasks that map to different skills.

## Quick Access Commands

```
/debug-mantra   → Activate debug-mantra skill directly
/post-mortem    → Activate post-mortem skill directly
/scrutinize     → Activate scrutinize skill directly
/management-talk → Activate management-talk skill directly
```

## Spawn Parallel Agents

If you have multiple independent tasks, I can spawn agents in parallel:

1. **debug-mantra** — for debugging/bug investigation
2. **post-mortem** — for writing bug post-mortems
3. **scrutinize** — for reviewing plans/PRs/code
4. **management-talk** — for rewriting content for leadership

Tell me what tasks you have and which skills they map to, or say "spawn all" to run all four skills in parallel on your current context.