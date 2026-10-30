# Telephony retry behaviour — 30 Oct 2026

## Summary
Documented how outbound and inbound calls behave when the SIP leg drops.

## Behaviour
- Outbound: one immediate retry, then a short backoff.
- Inbound: the agent resumes the session if the caller reconnects within the window.
- Failed dispatches are logged with the reason so the dashboard can surface them.

## Risks
- Retry storms if the carrier is down; backoff needs to be respected.
- Duplicate call records if the retry succeeds after a delayed failure.

## Follow-ups
- De-duplicate call analytics rows by call id.
- Add a clear error state in the dashboard.
