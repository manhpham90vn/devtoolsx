import { diffLines } from "diff";
import { Highlight, themes } from "prism-react-renderer";
import { useAppContext } from "../../context/AppContext";
import "./DiffViewer.css";

const LANGUAGES = [
  { value: "tsx", label: "TypeScript/JSX" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "plaintext", label: "Plain Text" },
];

interface DiffLine {
  lineNumber: number | null;
  content: string;
  type: "added" | "removed" | "unchanged" | "empty";
}

export function DiffViewer() {
  const { state, setDiffViewerState } = useAppContext();
  const { leftText, rightText, showDiff, language } = state.diffViewer;

  const setLeftText = (text: string) => setDiffViewerState({ leftText: text });
  const setRightText = (text: string) =>
    setDiffViewerState({ rightText: text });
  const setShowDiff = (show: boolean) => setDiffViewerState({ showDiff: show });
  const setLanguage = (lang: string) => setDiffViewerState({ language: lang });

  const computeDiff = (): { left: DiffLine[]; right: DiffLine[] } => {
    const changes = diffLines(leftText, rightText);
    const leftLines: DiffLine[] = [];
    const rightLines: DiffLine[] = [];

    let leftLineNum = 1;
    let rightLineNum = 1;

    changes.forEach((change) => {
      const lines = change.value
        .split("\n")
        .filter((_, i, arr) => i < arr.length - 1 || arr[i] !== "");

      if (change.added) {
        lines.forEach((line) => {
          leftLines.push({ lineNumber: null, content: "", type: "empty" });
          rightLines.push({
            lineNumber: rightLineNum++,
            content: line,
            type: "added",
          });
        });
      } else if (change.removed) {
        lines.forEach((line) => {
          leftLines.push({
            lineNumber: leftLineNum++,
            content: line,
            type: "removed",
          });
          rightLines.push({ lineNumber: null, content: "", type: "empty" });
        });
      } else {
        lines.forEach((line) => {
          leftLines.push({
            lineNumber: leftLineNum++,
            content: line,
            type: "unchanged",
          });
          rightLines.push({
            lineNumber: rightLineNum++,
            content: line,
            type: "unchanged",
          });
        });
      }
    });

    return { left: leftLines, right: rightLines };
  };

  const { left, right } = computeDiff();

  const handleClear = () => {
    setLeftText("");
    setRightText("");
    setShowDiff(false);
  };

  const handleSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
  };

  const handleShowDiff = () => {
    setShowDiff(true);
  };

  const handleBackToInput = () => {
    setShowDiff(false);
  };

  const renderHighlightedLine = (line: DiffLine, index: number) => {
    if (line.type === "empty") {
      return (
        <div className="diff-line empty" key={`${index}-empty`}>
          <span className="line-number"></span>
          <span className="line-content"></span>
        </div>
      );
    }

    return (
      <Highlight
        theme={themes.vsDark}
        code={line.content}
        language={
          language as
            | "tsx"
            | "javascript"
            | "json"
            | "python"
            | "css"
            | "html"
            | "bash"
            | "sql"
        }
        key={`${index}-${line.content}`}
      >
        {({ tokens, getTokenProps }) => (
          <div className={`diff-line ${line.type}`}>
            <span className="line-number">{line.lineNumber ?? ""}</span>
            <span className="line-content">
              {tokens[0]?.map((token, i) => (
                <span {...getTokenProps({ token })} key={i} />
              ))}
            </span>
          </div>
        )}
      </Highlight>
    );
  };

  // Show diff result view
  if (showDiff) {
    return (
      <div className="diff-viewer-container">
        <div className="diff-toolbar">
          <button className="btn-action btn-back" onClick={handleBackToInput}>
            ← Back to Input
          </button>
          <span className="diff-stats">
            <span className="stat-added">
              +{right.filter((l) => l.type === "added").length}
            </span>
            <span className="stat-removed">
              -{left.filter((l) => l.type === "removed").length}
            </span>
          </span>
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="diff-result-full">
          <div className="diff-panel-header">
            <span className="removed-label">Original</span>
          </div>
          <div className="diff-panel-header">
            <span className="added-label">Modified</span>
          </div>
          <div className="diff-panel">{left.map(renderHighlightedLine)}</div>
          <div className="diff-panel">{right.map(renderHighlightedLine)}</div>
        </div>
      </div>
    );
  }

  // Show input view
  return (
    <div className="diff-viewer-container">
      <div className="diff-toolbar">
        <div className="toolbar-actions">
          <button
            className="btn-action btn-primary"
            onClick={handleShowDiff}
            disabled={!leftText && !rightText}
          >
            🔍 Show Diff
          </button>
          <button
            className="btn-action"
            onClick={handleSwap}
            title="Swap left and right"
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

      <div className="input-section-full">
        <div className="input-panel-full">
          <div className="input-header">
            <span className="input-label removed-label">Original</span>
          </div>
          <textarea
            className="input-textarea"
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Paste original text here..."
            spellCheck={false}
          />
        </div>
        <div className="input-panel-full">
          <div className="input-header">
            <span className="input-label added-label">Modified</span>
          </div>
          <textarea
            className="input-textarea"
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Paste modified text here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
