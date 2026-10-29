# Multilingual coverage — 29 Oct 2026

## Current languages
- Hindi
- English
- Kannada (partial)
- Tamil (partial)

## Observations
- Code-switching (Hinglish) is common; intent matching should not assume a single language.
- Numeric values (dosages, times) are the most error-prone part of translation.
- Greetings and symptom descriptions have the best coverage so far.

## Next
- Add a small evaluation set per language.
- Track fallback rate when confidence is low.
- Review whether to escalate to a human when the language is unsupported.
