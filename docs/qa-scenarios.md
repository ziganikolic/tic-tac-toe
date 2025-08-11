# QA Scenarios (TODO)

- Send-to: move in (r,c) activates mini (r,c).
- Free move if target mini is closed.
- Mini win (3 in a row) sets `isClosed = true`.
- Mega win (3 won minis in a row) sets `over = true`.
- Out-of-order `moveIndex` results in error.
- Not-your-turn results in error.
