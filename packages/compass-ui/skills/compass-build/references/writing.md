# Writing

Source: `/foundations/writing-style`. Pillars: **concise, clear, consistent.** Users read English as a second language.

## Rules

- Short words, short sentences. No fluff. If a sentence restates the label or title, delete it.
- Active voice, present tense. Passive is fine to avoid blaming the user ("The password is incorrect") or when the app is the actor ("The image is deleted").
- Don't blame the user. Say what happened, why, and what to do next.
- Imperatives for instructions. Give the reason: "Do not change the Hostname because sessions will end."
- Same term for the same thing everywhere. Use exact component and feature names.
- Complete sentences in system messages (translation-safe). No verbs/adjectives as variables, no `{var}s` plurals; qualify nouns: "The {channel_name} channel was created".
- Cut: "please", "simply", "just", "oops", "successfully", "in order to", exclamation marks. **[proposed]**
- Don't write helper text unless it adds information the label cannot. **[proposed]**

## Casing and punctuation

| Element           | Casing                                 | Punctuation                   |
| ----------------- | -------------------------------------- | ----------------------------- |
| Titles            | Sentence case                          | No period unless 2+ sentences |
| Buttons           | Sentence case, verb first, 4 words max | None                          |
| Input labels      | Sentence case, short                   | No period, no colon           |
| Navigation labels | Shortest possible                      | None                          |
| Bullets           | Sentence case                          | No period unless 2+ sentences |
| Paragraphs        | Normal                                 | Full punctuation              |

Proper nouns keep their capitals. Examples: "Log in", "Send invitation".

## Message types

- **Notification:** informs, no input needed. Sentence phrase or full sentence. "Member added to channel"
- **Confirmation:** blocks until answered. Full sentence, yes/no question. "Delete this channel?" with a destructive verb button, not "Yes".
- **Warning:** what happened, what could go wrong. Full sentences.
- **Error:** what went wrong (if not obvious, one sentence), plus a fix if not obvious.

## Empty states and buttons **[proposed]**

- Empty state: say what goes here in one short line. Add an action only when the user can do something about it, and then only one (`EmptyState` `action`; illustration and description are optional too). If the action navigates, `action` can't take `asChild`: use `actionSlot` with a link styled as a button (`<Button asChild><a href="…">…</a></Button>`).
  - **Full view** (nothing on the page): use `EmptyState`, with a title and optionally an illustration, description and action.
  - **Subtle, inside a section, list or panel that has other content**: a single line of secondary-style text (text alpha at least 0.72) with no illustration, no heading and no button. Don't use `EmptyState` for this; it is too heavy.
  - Don't invent an action just to fill the slot.
- Button labels name the outcome ("Create channel"), not the mechanism ("Submit", "OK").
- Destructive confirmations repeat the object being affected.
