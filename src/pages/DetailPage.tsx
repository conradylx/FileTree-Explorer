import { Link, useParams } from "react-router-dom";
import { findNodeByPath, formatSize, getFolderSize } from "../utils/treeUtils";
import { useTreeContext } from "../context/TreeProvider";

export default function DetailPage() {
  const { nodePath = "" } = useParams();
  const decodedPath = decodeURIComponent(nodePath);
  const { tree } = useTreeContext();

  if (!tree) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-2">No loaded tree.</p>
          <Link to="/" className="text-sm text-sky-400 hover:underline">
            Return to home
          </Link>
        </div>
      </main>
    );
  }

  const node = findNodeByPath(tree, decodedPath);

  if (!node) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-400 mb-2">Node not found.</p>
          <Link to="/tree" className="text-sm text-sky-400 hover:underline">
            Return to tree
          </Link>
        </div>
      </main>
    );
  }

  const fullPath = decodedPath ? `root/${decodedPath}` : "root";
  const isFolder = node.type === "folder";

  return (
    <main className="min-h-screen bg-slate-900 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl">
        {/* Back Button */}
        <Link
          to="/tree"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky-400 transition mb-8"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Return to tree
        </Link>

        {/* Title Section */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${isFolder ? "bg-sky-500/10" : "bg-slate-700"}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isFolder ? "#38bdf8" : "#64748b"}
              strokeWidth="2"
            >
              {isFolder ? (
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              ) : (
                <>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </>
              )}
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{node.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFolder ? "Folder" : "File"}
            </p>
          </div>
        </div>

        {/* Info card Section */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 divide-y divide-slate-700/60 mb-6">
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Full path
            </p>
            <p className="font-mono text-sm text-slate-300 break-all">
              {fullPath}
            </p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {isFolder ? "Total size" : "Size"}
            </p>
            <span className="text-sm font-semibold text-white font-mono">
              {isFolder
                ? formatSize(getFolderSize(node))
                : formatSize(node.size)}
            </span>
          </div>
          {isFolder && (
            <div className="px-5 py-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Direct children
              </p>
              <span className="text-sm font-semibold text-white">
                {node.children.length}
              </span>
            </div>
          )}
        </div>

        {/* Children list */}
        {isFolder && node.children.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Contents
            </p>
            <ul className="rounded-xl border border-slate-700 bg-slate-800/60 divide-y divide-slate-700/60 overflow-hidden">
              {node.children.map((child) => {
                const childPath = decodedPath
                  ? `${decodedPath}/${child.name}`
                  : child.name;
                const isChildFolder = child.type === "folder";
                return (
                  <li key={child.name}>
                    <Link
                      to={`/tree/${encodeURIComponent(childPath)}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-700/50 transition group"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isChildFolder ? "#38bdf8" : "#64748b"}
                        strokeWidth="2"
                        className="shrink-0"
                      >
                        {isChildFolder ? (
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        ) : (
                          <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                          </>
                        )}
                      </svg>
                      <span className="text-sm text-slate-300 group-hover:text-sky-400 transition flex-1">
                        {child.name}
                      </span>
                      {child.type === "file" && (
                        <span className="text-xs text-slate-600 font-mono shrink-0">
                          {formatSize(child.size)}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
