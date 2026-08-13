import sqlite3
from pathlib import Path

from flask import Flask, jsonify, render_template

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "calls.db"

app = Flask(__name__)


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS calls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                call_id TEXT UNIQUE NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                started_at DATETIME,
                ended_at DATETIME,
                duration_seconds REAL,
                channel TEXT NOT NULL,
                success INTEGER NOT NULL,
                failure_reason TEXT
            )
            """
        )
        conn.commit()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/metrics")
def metrics():
    with get_db() as conn:
        total = conn.execute(
            "SELECT COUNT(*) AS count FROM calls"
        ).fetchone()["count"]

        successful = conn.execute(
            "SELECT COUNT(*) AS count FROM calls WHERE success = 1"
        ).fetchone()["count"]

        failed = conn.execute(
            "SELECT COUNT(*) AS count FROM calls WHERE success = 0"
        ).fetchone()["count"]

    success_rate = (successful / total * 100) if total else 0.0

    return jsonify(
        {
            "total": total,
            "success": successful,
            "failed": failed,
            "success_rate": round(success_rate, 1),
        }
    )


if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=True)