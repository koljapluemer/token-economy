You see here vite+vue+ts boilerplate.
Please implement the following prototype:

User should be able to track personal productivity following the "token economy" strategy.
Meaning: We can do actions which give us tokens, and actions which cost token.

Data model (managed via dexie!!):
- Action: a name, and a whole-number positive or negative token cost (or reward)
- LoggedAction: logs the name of the action (as string, do not reference the `Action` itself) and the incurred tokens, and timestamp

How many tokens the user has is dynamically calculated based on `LoggedAction[]`

Set up the following routes:
- Main view: shows our available tokens, and below it a grid with buttons with all actions
- List view, where actions can be added, edited and deleted, shown as a dexie table with the last row being a form to add a new action
- Log view: Simple list with all logged actions, with timestamp. Delete-icon button that has to be held 3 seconds (switch button to simple animation) to delete an action

Keep the UI minimal.
Add some juice (animations, colors), so that interactions with the app are clear and somewhat satisfying, but KISS.

Do basic PWA setup.
Stick to `agents.md`