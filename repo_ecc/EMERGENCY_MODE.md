# Emergency Mode

## Trigger Conditions
- **Memory usage critical** – when Long‑Term or Project memory exceeds 80 % of the allocated quota.
- **Context size critical** – when the current conversation context approaches the model’s maximum (e.g., > 85 % of `modelMaxContext`).
- **Latency critical** – average request latency > 1.5× target latency for the last 30 seconds.

## Actions
1. **Unload optional skills** – move `WARM` and `COLD` skills to `ARCHIVE` storage.
2. **Stop new agent creation** – block spawning of sub‑agents until the situation resolves.
3. **Force compaction** – invoke the `compact‑context` governor to shrink the conversation cache.
4. **Reduce retrieval depth** – limit semantic search depth to the top‑3 results and lower `k` for vector similarity.
5. **Raise alerts** – emit a high‑priority notification to the Performance Dashboard.

## Recovery Procedure
- After the metrics drop below safe thresholds, the governor automatically re‑enables normal operation and gradually warms previously archived skills back to `WARM`.

---

*This file is referenced by `THRESHOLD_INTELLIGENCE.md` for emergency handling.*
