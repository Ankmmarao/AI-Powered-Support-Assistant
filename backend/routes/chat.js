const express = require("express");
const router = express.Router();
const db = require("../db");
const { generateReply } = require("../services/llm");

router.post("/", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message required" });
  }

  db.run(`INSERT OR IGNORE INTO sessions (id) VALUES (?)`, [sessionId]);

  db.run(
    `INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`,
    [sessionId, "user", message]
  );

  db.all(
    `SELECT role, content FROM messages
     WHERE session_id = ?
     ORDER BY created_at DESC
     LIMIT 10`,
    [sessionId],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });

      const context = rows.reverse().map(r => `${r.role}: ${r.content}`).join("\n");

      try {
        const aiResponse = await generateReply(context, message);

        db.run(
          `INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`,
          [sessionId, "assistant", aiResponse.reply]
        );

        db.run(
          `UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [sessionId]
        );

        res.json(aiResponse);
      } catch (error) {
        res.status(500).json({ error: "LLM failure" });
      }
    }
  );
});

module.exports = router;
