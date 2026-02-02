import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./Base64Encoder.css";

export function Base64Encoder() {
  const { state, setBase64State } = useAppContext();
  const { inputText, outputText } = state.base64;
  const [copied, setCopied] = useState(false);

  const setInputText = (text: string) => setBase64State({ inputText: text });
  const setOutputText = (text: string) => setBase64State({ outputText: text });

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch {
      setOutputText("Error: Invalid input for encoding");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch {
      setOutputText("Error: Invalid Base64 string");
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
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText("");
  };

  return (
    <div className="encoder-container">
      <div className="encoder-toolbar">
        <div className="toolbar-actions">
          <button
            className="btn-action btn-primary"
            onClick={handleEncode}
            disabled={!inputText}
            title="Encode to Base64"
          >
            🔒 Encode
          </button>
          <button
            className="btn-action btn-primary"
            onClick={handleDecode}
            disabled={!inputText}
            title="Decode from Base64"
          >
            🔓 Decode
          </button>
          <button
            className="btn-action"
            onClick={handleSwap}
            disabled={!outputText}
            title="Use output as input"
          >
            ⇄ Swap
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

      <div className="encoder-panels">
        <div className="encoder-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
            <span className="panel-info">
              {inputText ? `${inputText.length} chars` : "Empty"}
            </span>
          </div>
          <textarea
            className="encoder-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to encode or Base64 string to decode..."
            spellCheck={false}
          />
        </div>

        <div className="encoder-panel">
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
          <textarea
            className="encoder-textarea output"
            value={outputText}
            readOnly
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
