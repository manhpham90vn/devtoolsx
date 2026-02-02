import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
}

const TOOLS: Tool[] = [
  { id: "diff", name: "Diff Viewer", path: "/diff", icon: "⇄" },
  { id: "json", name: "JSON Formatter", path: "/json-formatter", icon: "{ }" },
  // Add more tools here in the future
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <>
              <span className="logo">🛠️</span>
              <span className="app-name">DevToolsX</span>
            </>
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {TOOLS.map((tool) => (
            <NavLink
              key={tool.id}
              to={tool.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={tool.name}
            >
              <span className="nav-icon">{tool.icon}</span>
              {!collapsed && <span className="nav-label">{tool.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && <span className="version">v0.1.0</span>}
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
