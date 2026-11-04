# Deployment checklist — 4 Nov 2026

## Before shipping
- [ ] Environment variables set for LiveKit, Murf, Gemini and Deepgram
- [ ] Backend starts cleanly from a fresh environment
- [ ] Frontend build passes
- [ ] Analytics dashboard reads the expected database

## After shipping
- [ ] Place a test inbound call
- [ ] Place a test outbound call
- [ ] Confirm handoff message reaches the clinic channel
- [ ] Check latency on a mobile network

## Rollback
- Keep the previous deployment available.
- Database changes should be additive so rollback stays simple.
