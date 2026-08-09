"""
Persistent caller memory for Anaya (Day 4).

Stores a minimal, high-level caller profile in a local SQLite database so
that Anaya can recognize returning callers across agent restarts.

Design notes:
- Only Python's built-in sqlite3 is used; no new dependency is needed.
- Only high-level facts are stored:
  age_band, ongoing_conditions, last_triage_outcome.
- Never store detailed medical notes, prescriptions, or diagnoses.
- This module is the only place that touches the database.
- agent.py never writes raw SQL.
- Nothing here is automatically written into the LLM's system prompt.
"""

from __future__ import annotations

import json
import logging
import sqlite3
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from pathlib import Path

logger = logging.getLogger("agent.memory")


# backend/data/anaya_memory.db
DB_PATH = Path(__file__).resolve().parent.parent / "data" / "anaya_memory.db"


@dataclass
class UserMemory:
    """A minimal, high-level caller profile."""

    user_id: str
    name: str | None = None
    language_preference: str | None = None
    facts: dict = field(default_factory=dict)
    last_interaction: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


def _ensure_data_dir() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)


@contextmanager
def _connect():
    """Yield a SQLite connection, ensuring the data directory exists."""
    _ensure_data_dir()

    conn = sqlite3.connect(DB_PATH)

    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    """Create the users table if it does not already exist.

    Safe to call every time the agent starts.
    Existing data is never deleted.
    """

    try:
        with _connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    name TEXT,
                    language_preference TEXT,
                    facts TEXT,
                    last_interaction TEXT
                )
                """
            )

            conn.commit()

        logger.info("Memory database ready at %s", DB_PATH)

    except sqlite3.Error:
        logger.exception("Failed to initialize memory database")


def get_user(user_id: str) -> UserMemory | None:
    """Look up a caller's stored profile by stable user_id."""

    if not user_id:
        return None

    try:
        with _connect() as conn:
            row = conn.execute(
                """
                SELECT
                    user_id,
                    name,
                    language_preference,
                    facts,
                    last_interaction
                FROM users
                WHERE user_id = ?
                """,
                (user_id,),
            ).fetchone()

    except sqlite3.Error:
        logger.exception(
            "Database error while looking up user_id=%s",
            user_id,
        )
        return None

    if row is None:
        logger.info(
            "Lookup miss for user_id=%s",
            user_id,
        )
        return None

    (
        raw_user_id,
        name,
        language_preference,
        facts_json,
        last_interaction,
    ) = row

    try:
        facts = json.loads(facts_json) if facts_json else {}

        if not isinstance(facts, dict):
            facts = {}

    except (TypeError, ValueError):
        facts = {}

    logger.info(
        "Lookup hit for user_id=%s",
        user_id,
    )

    return UserMemory(
        user_id=raw_user_id,
        name=name,
        language_preference=language_preference,
        facts=facts,
        last_interaction=last_interaction,
    )


# Only these high-level facts may ever be stored.
_ALLOWED_FACT_KEYS = {
    "age_band",
    "ongoing_conditions",
    "last_triage_outcome",
}


def _sanitize_facts(facts: dict | None) -> dict:
    """Only allow approved high-level health facts."""

    if not facts:
        return {}

    return {
        key: value
        for key, value in facts.items()
        if key in _ALLOWED_FACT_KEYS and value
    }


def save_user(
    user_id: str,
    name: str | None = None,
    language_preference: str | None = None,
    facts: dict | None = None,
) -> bool:
    """Save or update a caller's profile.

    This function should only be called after explicit caller consent.
    """

    if not user_id:
        logger.warning(
            "save_user called without a user_id; refusing to save"
        )
        return False

    clean_facts = _sanitize_facts(facts)

    now = datetime.now(UTC).isoformat(timespec="seconds")

    try:
        with _connect() as conn:
            existing = conn.execute(
                """
                SELECT name, language_preference, facts
                FROM users
                WHERE user_id = ?
                """,
                (user_id,),
            ).fetchone()

            if existing:
                existing_name, existing_lang, existing_facts_json = existing

                try:
                    merged_facts = (
                        json.loads(existing_facts_json)
                        if existing_facts_json
                        else {}
                    )

                    if not isinstance(merged_facts, dict):
                        merged_facts = {}

                except (TypeError, ValueError):
                    merged_facts = {}

                merged_facts.update(clean_facts)

                conn.execute(
                    """
                    UPDATE users
                    SET
                        name = ?,
                        language_preference = ?,
                        facts = ?,
                        last_interaction = ?
                    WHERE user_id = ?
                    """,
                    (
                        name or existing_name,
                        language_preference or existing_lang,
                        json.dumps(merged_facts),
                        now,
                        user_id,
                    ),
                )

            else:
                conn.execute(
                    """
                    INSERT INTO users
                        (
                            user_id,
                            name,
                            language_preference,
                            facts,
                            last_interaction
                        )
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        user_id,
                        name,
                        language_preference,
                        json.dumps(clean_facts),
                        now,
                    ),
                )

            conn.commit()

        logger.info(
            "Saved memory for user_id=%s (last_interaction=%s)",
            user_id,
            now,
        )

        return True

    except sqlite3.Error:
        logger.exception(
            "Database error while saving user_id=%s",
            user_id,
        )
        return False


def delete_user(user_id: str) -> bool:
    """Permanently delete all stored memory for a caller."""

    if not user_id:
        logger.warning(
            "delete_user called without a user_id; refusing to delete"
        )
        return False

    try:
        with _connect() as conn:
            conn.execute(
                "DELETE FROM users WHERE user_id = ?",
                (user_id,),
            )
            conn.commit()

        logger.info("Deleted memory for user_id=%s", user_id)
        return True

    except sqlite3.Error:
        logger.exception(
            "Database error while deleting user_id=%s",
            user_id,
        )
        return False