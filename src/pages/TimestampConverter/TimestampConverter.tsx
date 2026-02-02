import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./TimestampConverter.css";

export function TimestampConverter() {
  const { state, setTimestampState } = useAppContext();
  const { tsInput, tsOutput, dateInput, dateOutput } = state.timestamp;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimestampToDate = () => {
    try {
      const ts = parseInt(tsInput, 10);
      if (isNaN(ts)) {
        setTimestampState({ tsOutput: "Error: Invalid timestamp" });
        return;
      }
      // Handle both seconds and milliseconds
      const date = new Date(ts > 9999999999 ? ts : ts * 1000);
      setTimestampState({ tsOutput: date.toISOString() });
    } catch {
      setTimestampState({ tsOutput: "Error: Invalid timestamp" });
    }
  };

  const handleDateToTimestamp = () => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setTimestampState({ dateOutput: "Error: Invalid date" });
        return;
      }
      setTimestampState({
        dateOutput: Math.floor(date.getTime() / 1000).toString(),
      });
    } catch {
      setTimestampState({ dateOutput: "Error: Invalid date" });
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setTimestampState({
      tsInput: "",
      tsOutput: "",
      dateInput: "",
      dateOutput: "",
    });
  };

  const formatCurrentTime = () => {
    const date = new Date(currentTime);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetStr = `${offset >= 0 ? "+" : "-"}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
    return {
      timestamp: Math.floor(currentTime / 1000),
      timestampMs: currentTime,
      iso: date.toISOString(),
      local: date.toLocaleString(),
      timezone: `${timezone} (UTC${offsetStr})`,
    };
  };

  const current = formatCurrentTime();

  return (
    <div className="timestamp-container">
      <div className="timestamp-toolbar">
        <div className="toolbar-actions">
          <button
            className="btn-action btn-danger"
            onClick={handleClear}
            title="Clear all"
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="current-time-section">
        <div className="current-time-header">Current Time</div>
        <div className="current-time-grid">
          <div className="time-item">
            <span className="time-label">Unix (seconds)</span>
            <div className="time-value-row">
              <span className="time-value">{current.timestamp}</span>
              <button
                className={`btn-copy-small ${copiedId === "ts" ? "copied" : ""}`}
                onClick={() => handleCopy(current.timestamp.toString(), "ts")}
                title="Copy"
              >
                {copiedId === "ts" ? "✓" : "📋"}
              </button>
            </div>
          </div>
          <div className="time-item">
            <span className="time-label">Unix (milliseconds)</span>
            <div className="time-value-row">
              <span className="time-value">{current.timestampMs}</span>
              <button
                className={`btn-copy-small ${copiedId === "ms" ? "copied" : ""}`}
                onClick={() => handleCopy(current.timestampMs.toString(), "ms")}
                title="Copy"
              >
                {copiedId === "ms" ? "✓" : "📋"}
              </button>
            </div>
          </div>
          <div className="time-item">
            <span className="time-label">ISO 8601</span>
            <div className="time-value-row">
              <span className="time-value">{current.iso}</span>
              <button
                className={`btn-copy-small ${copiedId === "iso" ? "copied" : ""}`}
                onClick={() => handleCopy(current.iso, "iso")}
                title="Copy"
              >
                {copiedId === "iso" ? "✓" : "📋"}
              </button>
            </div>
          </div>
          <div className="time-item">
            <span className="time-label">Local ({current.timezone})</span>
            <div className="time-value-row">
              <span className="time-value">{current.local}</span>
              <button
                className={`btn-copy-small ${copiedId === "local" ? "copied" : ""}`}
                onClick={() => handleCopy(current.local, "local")}
                title="Copy"
              >
                {copiedId === "local" ? "✓" : "📋"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="converter-panels">
        {/* Timestamp to Date */}
        <div className="converter-panel">
          <div className="panel-header">
            <span className="panel-label">Unix Timestamp → Date</span>
          </div>
          <div className="panel-content">
            <div className="input-group">
              <input
                type="text"
                className="converter-input"
                value={tsInput}
                onChange={(e) => setTimestampState({ tsInput: e.target.value })}
                placeholder="Enter Unix timestamp (seconds or ms)"
              />
              <button
                className="btn-convert"
                onClick={handleTimestampToDate}
                disabled={!tsInput}
              >
                Convert →
              </button>
            </div>
            <div className="output-group">
              <input
                type="text"
                className="converter-output"
                value={tsOutput}
                readOnly
                placeholder="Result will appear here..."
              />
              <button
                className={`btn-copy ${copiedId === "date" ? "copied" : ""}`}
                onClick={() => handleCopy(tsOutput, "date")}
                disabled={!tsOutput}
              >
                {copiedId === "date" ? "✓" : "📋"}
              </button>
            </div>
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="converter-panel">
          <div className="panel-header">
            <span className="panel-label">Date → Unix Timestamp</span>
          </div>
          <div className="panel-content">
            <div className="input-group">
              <input
                type="text"
                className="converter-input"
                value={dateInput}
                onChange={(e) =>
                  setTimestampState({ dateInput: e.target.value })
                }
                placeholder="Enter date (ISO 8601 or any format)"
              />
              <button
                className="btn-convert"
                onClick={handleDateToTimestamp}
                disabled={!dateInput}
              >
                Convert →
              </button>
            </div>
            <div className="output-group">
              <input
                type="text"
                className="converter-output"
                value={dateOutput}
                readOnly
                placeholder="Result will appear here..."
              />
              <button
                className={`btn-copy ${copiedId === "ts-out" ? "copied" : ""}`}
                onClick={() => handleCopy(dateOutput, "ts-out")}
                disabled={!dateOutput}
              >
                {copiedId === "ts-out" ? "✓" : "📋"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
