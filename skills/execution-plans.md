---
name: executing-plans
description: Read an implementation plan, execute step-by-step with verification checkpoints, handle blockers by asking the user before continuing. Use when given a written spec or plan to implement.
---

# Executing Plans

Execute implementation plans faithfully — not blindly. A plan is a map, not a script. Follow it precisely, verify every step, and stop when the terrain diverges from the map rather than improvising through confusion.

## Design Thinking

Before touching code, establish your execution philosophy:

**The plan is a contract with the author.** When you deviate without asking, you break that contract. The plan author made decisions — about architecture, priorities, sequencing, constraints — that you may not have full context for. Deviating without consultation turns implementation into assumption-making.

**Verification is not optional.** Every step has outputs. If the plan says "create X and verify Y succeeds," you do both — not just create X and assume Y worked. Skipped verifications compound into late-stage failures that are expensive to diagnose.

**Confusion is a signal, not a obstacle.** When something doesn't make sense — a step is unclear, a dependency contradicts reality, an expected output doesn't appear — this is not a hurdle to overcome with guesswork. It is information. The correct response is to stop, articulate the confusion clearly, and get the plan corrected before proceeding.

**Blocking and succeeding both require judgment.** A blocker stops forward progress. But blind success — implementing something the plan describes that clearly conflicts with the actual codebase — is equally a failure mode. Neither should be automated past.

## Implementation Directive

Follow this sequence for every plan execution:

### Phase 1 — Load and Interrogate

1. **Read the entire plan before doing anything.** Get the full picture.
2. **Identify every checkpoint.** The plan may have explicit verification steps. If it doesn't, mark natural checkpoints yourself: "after step 3, verify X exists."
3. **Cross-reference against reality.** Before executing step 1, verify:
   - The files/directories the plan references actually exist
   - The stated dependencies (packages, tools, versions) match the environment
   - The plan's starting conditions match the current state
4. **Raise hidden conflicts.** If you find contradictions — the plan says to modify a file that doesn't exist, or assumes a library version that isn't installed — do not start. State the conflict explicitly and wait for the plan to be corrected.

**Announce at start:** "Executing plan: [plan name]. [N] steps, [M] checkpoints."

### Phase 2 — Execute with Verification

For each step:

1. **Read the step in full before acting.** Never skim.
2. **Execute exactly as written.** If you need to deviate to handle an edge case, stop and ask — do not silently substitute.
3. **Run the verification checkpoint immediately.** Do not batch verifications.
4. **On verification failure:** Do not retry indefinitely. Run it once more to confirm the failure is real. Then stop and report. "Step 4 verification failed: expected X, got Y. The plan does not account for this condition. Awaiting correction."
5. **On ambiguous output:** If the output exists but you cannot determine whether it meets the criteria, stop and show the output to the user. "Step 5 produced this output. I cannot determine whether it satisfies the verification criteria. Does this look correct to you?"

### Phase 3 — Handle Blockers

When you encounter a blocker — missing dependency, unclear instruction, contradiction, unexpected state — you have two choices and only two:

**Option A: Ask the user to correct the plan.** State the problem precisely. Show what you expected vs what you found. Ask for the plan to be updated before you continue.

**Option B: If the plan explicitly authorizes a fallback** (e.g., "if X unavailable, use Y"), apply the fallback and note it. "Per step 3 fallback: using Y instead of unavailable X. Continuing."

Do not:
- Invent workarounds not in the plan
- Skip a step because it's hard
- Assume the plan is flexible when it doesn't say so
- Continue past a blocker and hope it resolves itself

**When in doubt: stop and ask.**

### Phase 4 — Complete

After all steps complete and verified:

1. **Run the full verification suite** if the plan includes one, or if not, verify the final artifact matches the plan's success criteria.
2. **Report completion with evidence.** "All [N] steps completed, all [M] checkpoints passed. Output: [description]."
3. **Do not declare success if any checkpoint failed.** If a verification could not be run, say so explicitly: "Step 7 verification could not be completed — [reason]. Plan execution is incomplete."

## Detailed Guidelines

**Checkpoint mechanics:**
- Explicit checkpoints (plan says "verify X"): run exactly what the plan specifies
- Implicit checkpoints: after each significant action, confirm the expected output exists and has reasonable content
- Never skip verification because "it should have worked" — always check

**Sequencing:**
- Execute steps in order unless the plan explicitly allows parallel execution
- If later steps depend on earlier outputs, verify those outputs before proceeding to dependent steps
- If a step produces an output that later steps should consume, name it explicitly so it can be verified

**Confusion taxonomy:**
- **Unclear instruction**: the step doesn't make sense as written → ask before proceeding
- **Missing dependency**: something the step needs isn't there → ask before proceeding
- **Contradiction**: plan says X but reality shows Y → ask before proceeding
- **Unexpected state**: everything is clear but the world is wrong → ask before proceeding
- **Known fallback**: plan explicitly describes what to do → apply and note it

**Progress tracking:**
- Track which steps are complete with what outputs
- If you had to deviate or apply a fallback, note it in your progress summary
- If a step was attempted but verification failed, note it as blocked — not skipped

## Hard Constraints

**Never do these — they are anti-patterns that invert the skill's purpose:**

1. **Do not execute steps you do not understand.** If a step confuses you, stopping is correct. Guessing introduces risk the plan author never consented to.

2. **Do not skip verification checkpoints "if everything looks right."** Looks can deceive. The plan author put verification in for a reason — it catches failures before they compound.

3. **Do not improvise workarounds when blocked.** A workaround you invent may conflict with something later in the plan that depends on the original approach. Stop and ask.

4. **Do not continue past a blocker hoping it will resolve.** It won't. You'll be further from the plan's expected state with no way to reverse the divergence cleanly.

5. **Do not assume the plan is complete.** Plans have gaps. If you encounter a scenario the plan doesn't cover, that is a gap — not a cue to decide for yourself.

6. **Do not optimize the plan.** You are the executor, not the author. If the approach seems inefficient, note it and continue — or ask before changing course, but do not silently optimize.

7. **Do not claim completion if verification failed.** Saying "all done" when a checkpoint failed is撒谎. Report exactly what passed and what didn't.

8. **Do not start implementation in an uncontrolled workspace.** Before executing steps, verify you are in the correct environment — correct branch, correct directory, correct permissions. If the plan doesn't specify and you're not sure, ask.

## Anti-Patterns (What Unskilled Plan Execution Looks Like)

Agents without this skill fall into predictable failure modes:

**The Run-On Executor**: Reads the plan, starts at step 1, and hammers through every step without verifying anything. Produces a broken artifact and only discovers failure at the end — often too late to recover without redoing everything.

**The Autonomous Improviser**: Hits a blocker and immediately invents a solution without consulting the plan author. The solution may be reasonable or may quietly break assumptions later in the plan that the author will only discover when it matters.

**The Silent Skipper**: Skips a step that seems unnecessary or confusing, then continues as if the step had been completed. Later steps may depend on that output, and the failure surfaces as a cryptic error three steps later with no clear provenance.

**The Assumption Machine**: Fills gaps in the plan with assumptions, acts on them as if they were explicit instructions, and only discovers the mismatch when the verification (if it runs) catches something obviously wrong.

**The Completion Liar**: Marks everything complete even when verification could not run or failed. Reports success to avoid appearing blocked, leaving the user with a false state.

This skill exists to eliminate all five patterns. Execute the plan, verify every step, stop when blocked, and report honestly.