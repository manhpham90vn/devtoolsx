import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./TimestampConverter.css";

// Helper function to calculate relative time
const getRelativeTime = (date: Date, now: Date): string => {
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs < 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: string;
  if (years > 0) {
    value = `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    value = `${months} month${months > 1 ? "s" : ""}`;
  } else if (days > 0) {
    value = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    value = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    value = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    value = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  return isPast ? `${value} ago` : `in ${value}`;
};

// Helper function to format date with timezone info
const formatDateWithTimezone = (date: Date) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetStr = `${offset >= 0 ? "+" : "-"}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

  return {
    gmt: date.toUTCString(),
    local: date.toLocaleString(),
    timezone: `${timezone} (UTC${offsetStr})`,
    iso: date.toISOString(),
  };
};

export function TimestampConverter() {
  const { state, setTimestampState } = useAppContext();
  const {
    tsInput,
    dateYear,
    dateMonth,
    dateDay,
    dateHour,
    dateMinute,
    dateSecond,
  } = state.timestamp;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Parsed dates for conversion results
  const [tsToDateResult, setTsToDateResult] = useState<Date | null>(null);
  const [dateToTsResult, setDateToTsResult] = useState<Date | null>(null);
  const [tsError, setTsError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");

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
        setTsError("Error: Invalid timestamp");
        setTsToDateResult(null);
        return;
      }
      // Handle both seconds and milliseconds
      const date = new Date(ts > 9999999999 ? ts : ts * 1000);
      if (isNaN(date.getTime())) {
        setTsError("Error: Invalid timestamp");
        setTsToDateResult(null);
        return;
      }
      setTsToDateResult(date);
      setTsError("");
    } catch {
      setTsError("Error: Invalid timestamp");
      setTsToDateResult(null);
    }
  };

  const handleDateToTimestamp = () => {
    try {
      const year = parseInt(dateYear, 10);
      const month = parseInt(dateMonth, 10);
      const day = parseInt(dateDay, 10);
      const hour = parseInt(dateHour, 10);
      const minute = parseInt(dateMinute, 10);
      const second = parseInt(dateSecond, 10);

      // Validate all fields are numbers
      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hour) ||
        isNaN(minute) ||
        isNaN(second)
      ) {
        setDateError("Error: All fields must be valid numbers");
        setDateToTsResult(null);
        return;
      }

      // Validate year range
      if (year < 1970 || year > 2099) {
        setDateError("Error: Year must be between 1970 and 2099");
        setDateToTsResult(null);
        return;
      }

      // Validate month range
      if (month < 1 || month > 12) {
        setDateError("Error: Month must be between 1 and 12");
        setDateToTsResult(null);
        return;
      }

      // Calculate days in month
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        setDateError(
          `Error: Day must be between 1 and ${daysInMonth} for this month`,
        );
        setDateToTsResult(null);
        return;
      }

      // Validate hour range
      if (hour < 0 || hour > 23) {
        setDateError("Error: Hour must be between 0 and 23");
        setDateToTsResult(null);
        return;
      }

      // Validate minute range
      if (minute < 0 || minute > 59) {
        setDateError("Error: Minute must be between 0 and 59");
        setDateToTsResult(null);
        return;
      }

      // Validate second range
      if (second < 0 || second > 59) {
        setDateError("Error: Second must be between 0 and 59");
        setDateToTsResult(null);
        return;
      }

      const date = new Date(year, month - 1, day, hour, minute, second);
      if (isNaN(date.getTime())) {
        setDateError("Error: Invalid date");
        setDateToTsResult(null);
        return;
      }
      setDateToTsResult(date);
      setDateError("");
    } catch {
      setDateError("Error: Invalid date");
      setDateToTsResult(null);
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
    const now = new Date();
    setTimestampState({
      tsInput: "",
      tsOutput: "",
      dateYear: now.getFullYear().toString(),
      dateMonth: (now.getMonth() + 1).toString().padStart(2, "0"),
      dateDay: now.getDate().toString().padStart(2, "0"),
      dateHour: now.getHours().toString().padStart(2, "0"),
      dateMinute: now.getMinutes().toString().padStart(2, "0"),
      dateSecond: now.getSeconds().toString().padStart(2, "0"),
      dateOutput: "",
    });
    setTsToDateResult(null);
    setDateToTsResult(null);
    setTsError("");
    setDateError("");
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
  const now = useMemo(() => new Date(currentTime), [currentTime]);

  // Format results for Timestamp → Date
  const tsToDateFormatted = useMemo(() => {
    if (!tsToDateResult) return null;
    return {
      ...formatDateWithTimezone(tsToDateResult),
      relative: getRelativeTime(tsToDateResult, now),
      timestamp: Math.floor(tsToDateResult.getTime() / 1000),
    };
  }, [tsToDateResult, now]);

  // Format results for Date → Timestamp
  const dateToTsFormatted = useMemo(() => {
    if (!dateToTsResult) return null;
    return {
      ...formatDateWithTimezone(dateToTsResult),
      relative: getRelativeTime(dateToTsResult, now),
      timestamp: Math.floor(dateToTsResult.getTime() / 1000),
      timestampMs: dateToTsResult.getTime(),
    };
  }, [dateToTsResult, now]);

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

            {tsError && <div className="error-message">{tsError}</div>}

            {tsToDateFormatted && (
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">GMT</span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {tsToDateFormatted.gmt}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "ts-gmt" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(tsToDateFormatted.gmt, "ts-gmt")
                      }
                      title="Copy"
                    >
                      {copiedId === "ts-gmt" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-label">
                    Local ({tsToDateFormatted.timezone})
                  </span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {tsToDateFormatted.local}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "ts-local" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(tsToDateFormatted.local, "ts-local")
                      }
                      title="Copy"
                    >
                      {copiedId === "ts-local" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-label">ISO 8601</span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {tsToDateFormatted.iso}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "ts-iso" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(tsToDateFormatted.iso, "ts-iso")
                      }
                      title="Copy"
                    >
                      {copiedId === "ts-iso" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item result-relative">
                  <span className="result-label">Relative</span>
                  <div className="result-value-row">
                    <span className="result-value result-value-relative">
                      {tsToDateFormatted.relative}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="converter-panel">
          <div className="panel-header">
            <span className="panel-label">Date → Unix Timestamp</span>
          </div>
          <div className="panel-content">
            <div className="date-picker-grid">
              <div className="date-field">
                <label className="date-field-label">Year</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateYear}
                  onChange={(e) =>
                    setTimestampState({ dateYear: e.target.value })
                  }
                  placeholder="YYYY"
                  min="1970"
                  max="2099"
                />
              </div>
              <div className="date-field">
                <label className="date-field-label">Month</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateMonth}
                  onChange={(e) =>
                    setTimestampState({
                      dateMonth: e.target.value.padStart(2, "0"),
                    })
                  }
                  placeholder="MM"
                  min="1"
                  max="12"
                />
              </div>
              <div className="date-field">
                <label className="date-field-label">Day</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateDay}
                  onChange={(e) =>
                    setTimestampState({
                      dateDay: e.target.value.padStart(2, "0"),
                    })
                  }
                  placeholder="DD"
                  min="1"
                  max="31"
                />
              </div>
              <div className="date-field">
                <label className="date-field-label">Hour</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateHour}
                  onChange={(e) =>
                    setTimestampState({
                      dateHour: e.target.value.padStart(2, "0"),
                    })
                  }
                  placeholder="HH"
                  min="0"
                  max="23"
                />
              </div>
              <div className="date-field">
                <label className="date-field-label">Minute</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateMinute}
                  onChange={(e) =>
                    setTimestampState({
                      dateMinute: e.target.value.padStart(2, "0"),
                    })
                  }
                  placeholder="MM"
                  min="0"
                  max="59"
                />
              </div>
              <div className="date-field">
                <label className="date-field-label">Second</label>
                <input
                  type="number"
                  className="date-field-input"
                  value={dateSecond}
                  onChange={(e) =>
                    setTimestampState({
                      dateSecond: e.target.value.padStart(2, "0"),
                    })
                  }
                  placeholder="SS"
                  min="0"
                  max="59"
                />
              </div>
            </div>
            <button
              className="btn-convert btn-convert-full"
              onClick={handleDateToTimestamp}
            >
              Convert →
            </button>

            {dateError && <div className="error-message">{dateError}</div>}

            {dateToTsFormatted && (
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Unix (seconds)</span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {dateToTsFormatted.timestamp}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "date-ts" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(
                          dateToTsFormatted.timestamp.toString(),
                          "date-ts",
                        )
                      }
                      title="Copy"
                    >
                      {copiedId === "date-ts" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-label">Unix (milliseconds)</span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {dateToTsFormatted.timestampMs}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "date-ms" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(
                          dateToTsFormatted.timestampMs.toString(),
                          "date-ms",
                        )
                      }
                      title="Copy"
                    >
                      {copiedId === "date-ms" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-label">GMT</span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {dateToTsFormatted.gmt}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "date-gmt" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(dateToTsFormatted.gmt, "date-gmt")
                      }
                      title="Copy"
                    >
                      {copiedId === "date-gmt" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <span className="result-label">
                    Local ({dateToTsFormatted.timezone})
                  </span>
                  <div className="result-value-row">
                    <span className="result-value">
                      {dateToTsFormatted.local}
                    </span>
                    <button
                      className={`btn-copy-small ${copiedId === "date-local" ? "copied" : ""}`}
                      onClick={() =>
                        handleCopy(dateToTsFormatted.local, "date-local")
                      }
                      title="Copy"
                    >
                      {copiedId === "date-local" ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
                <div className="result-item result-relative">
                  <span className="result-label">Relative</span>
                  <div className="result-value-row">
                    <span className="result-value result-value-relative">
                      {dateToTsFormatted.relative}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
