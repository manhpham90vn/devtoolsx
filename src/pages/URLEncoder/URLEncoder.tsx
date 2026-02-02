import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./URLEncoder.css";

export function URLEncoder() {
  const { state, setURLEncoderState } = useAppContext();
  const { inputText, outputText } = state.urlEncoder;
  const [copied, setCopied] = useState(false);

  const setInputText = (text: string) =>
    setURLEncoderState({ inputText: text });
  const setOutputText = (text: string) =>
    setURLEncoderState({ outputText: text });

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch {
      setOutputText("Error: Invalid input for encoding");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch {
      setOutputText("Error: Invalid URL-encoded string");
    }
  };

  const handleEncodeAll = () => {
    try {
      const encoded = encodeURI(inputText);
      setOutputText(encoded);
    } catch {
      setOutputText("Error: Invalid input for encoding");
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
            title="Encode URL component"
          >
            🔒 Encode
          </button>
          <button
            className="btn-action btn-primary"
            onClick={handleDecode}
            disabled={!inputText}
            title="Decode URL component"
          >
            🔓 Decode
          </button>
          <button
            className="btn-action"
            onClick={handleEncodeAll}
            disabled={!inputText}
            title="Encode full URI (keeps special chars)"
          >
            🔗 Encode URI
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
            placeholder="Enter text or URL to encode/decode..."
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
