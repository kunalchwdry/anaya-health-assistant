# Voice latency audit — 29 Oct 2026

## Goal
Keep end-to-end turn latency under 1.2s for the common Hindi/English path.

## What we measured
- STT (Deepgram) first-partial: ~180ms
- LLM (Gemini) first token: ~420ms
- TTS (Murf) first byte: ~260ms

## Notes
- Telephony jitter dominates on mobile networks, not the model calls.
- Streaming TTS as soon as the first sentence is complete helps perceived latency.
- Keep an eye on long answers: cap response length for voice turns.

## Follow-ups
- Re-run the audit after the telephony retry change.
- Compare latency for Kannada and Tamil prompts.
