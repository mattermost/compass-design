# Evaluating prototype-to-production

A repeatable A/B test: the same task run twice from the same commit, once with the skills installed and once without. It measures what the skill changes, using a rubric fixed in advance.

This folder is outside `skills/prototype-to-production/` on purpose, so installing the skill doesn't copy the test files.

## Run it

1. Pick a **new** prototype (not one you have already walked through with an agent), a consumer repo (webapp or a plugin) and a surface. Prefer a prototype that has a UX spec, several variants and at least one overlay inside a modal.
2. Create the two worktrees:

   ```bash
   skills/evals/prototype-to-production/setup-ab.sh \
     --consumer /path/to/mattermost \
     --base origin/master \
     --compass-design /path/to/compass-design \
     --name working-hours
   ```

   The with-skill worktree gets the three skills copied into `.claude/skills`; the other gets nothing.

3. **Install dependencies in each worktree yourself** (the consumer's normal install). Don't symlink `node_modules` between worktrees or into the original checkout: a session that runs an install through the link modifies the original.
4. Fill in `prompt.template.md` once and paste the **identical** prompt into a fresh Claude Code session in each worktree. Don't name the skill in either prompt; the with-skill run has to trigger it from the description.
   If a session asks questions, the answers must come from the human. When you run the sessions through an orchestrator (another Claude session that starts them), the orchestrator relays every open question, or a rejected `AskUserQuestion`, to the human and passes the answers back before the run continues. It never lets the session proceed on assumptions, and it never answers for the human.
5. When both finish, score them with `rubric.md` before reading either report. Review the diffs with the branch labels hidden if a second person can.
6. Run the app from each worktree (different ports) and compare them side by side.

## Reading the result

- One run per side is anecdotal. Repeat each side at least twice before drawing conclusions, and try a plugin consumer as well as the webapp.
- First check the with-skill report: it must open with the 11-row status table from step 10, even though the shared prompt asks for a short report. Then record in the process log whether the skill triggered unprompted, which steps it skipped (compare its report with the report template in step 10), whether it ran `compass-review` through the Skill tool, and whether it asked its questions with `AskUserQuestion`.
- Use the `skill-creator` skill to test whether the description triggers reliably.

## Keep it honest

- Same base commit, same model, same prompt.
- Keep the consumer's own `CLAUDE.md` / `AGENTS.md` in both runs; it is part of the normal setup.
- Write down every skill change you make between runs.
