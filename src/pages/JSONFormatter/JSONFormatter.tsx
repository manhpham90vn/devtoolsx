import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./JSONFormatter.css";

export function JSONFormatter() {
  const { state, setJSONFormatterState } = useAppContext();
  const { inputText, outputText, error } = state.jsonFormatter;
  const [copied, setCopied] = useState(false);

  const setInputText = (text: string) =>
    setJSONFormatterState({ inputText: text });
  const setOutputText = (text: string) =>
    setJSONFormatterState({ outputText: text });
  const setError = (err: string) => setJSONFormatterState({ error: err });

  const handlePretty = () => {
    setError("");
    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputText(formatted);
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setOutputText("");
    }
  };

  const handleMinify = () => {
    setError("");
    try {
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setOutputText("");
    }
  };

  const handleCopy = async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  return (
    <div className="json-formatter-container">
      <div className="json-toolbar">
        <div className="toolbar-actions">
          <button
            className="btn-action btn-primary"
            onClick={handlePretty}
            disabled={!inputText}
            title="Format JSON with indentation"
          >
            ✨ Pretty
          </button>
          <button
            className="btn-action btn-primary"
            onClick={handleMinify}
            disabled={!inputText}
            title="Minify JSON to single line"
          >
            🗜 Minify
          </button>
          <button
            className="btn-action btn-danger"
            onClick={handleClear}
            title="Clear all"
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="json-panels">
        <div className="json-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
            <span className="panel-info">
              {inputText ? `${inputText.length} chars` : "Empty"}
            </span>
          </div>
          <textarea
            className="json-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Paste JSON here, e.g.: {"key": "value"}'
            spellCheck={false}
          />
        </div>

        <div className="json-panel">
          <div className="panel-header">
            <span className="panel-label">Output</span>
            <div className="panel-header-right">
              <span className="panel-info">
                {outputText ? `${outputText.length} chars` : "Empty"}
              </span>
              <button
                className={`btn-copy-output ${copied ? "copied" : ""}`}
                onClick={handleCopy}
                disabled={!outputText}
                title="Copy output to clipboard"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
          <div className="json-output">
            {outputText ? (
              <Highlight
                theme={themes.vsDark}
                code={outputText}
                language="json"
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="json-code">
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line })} key={i}>
                        <span className="line-number">{i + 1}</span>
                        <span className="line-content">
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token })} key={key} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            ) : (
              <div className="empty-state">
                Enter JSON and click Pretty or Minify
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
