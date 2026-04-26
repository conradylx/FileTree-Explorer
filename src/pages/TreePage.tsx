import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTreeContext } from "../context/TreeProvider";
import { searchTree, formatSize } from "../utils/treeUtils";
import type { TreeNode } from "../types";

function FileIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748b"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TreeNode({
  node,
  path,
  level = 0,
}: {
  node: TreeNode;
  path: string;
  level?: number;
}) {
  const [open, setOpen] = useState(level === 0);
  const encoded = encodeURIComponent(path.replace(/^root\/?/, ""));
  const link = encoded ? `/tree/${encoded}` : "/tree";
  const pad = `${level * 16}px`;

  if (node.type === "file") {
    return (
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800 transition group"
        style={{ paddingLeft: `calc(${pad} + 0.5rem)` }}
      >
        <FileIcon />
        <Link
          to={link}
          className="text-sm text-slate-400 group-hover:text-sky-400 transition flex-1 truncate"
        >
          {node.name}
        </Link>
        <span className="text-xs text-slate-600 shrink-0 font-mono">
          {formatSize(node.size)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800 transition group"
        style={{ paddingLeft: `calc(${pad} + 0.5rem)` }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="shrink-0"
        >
          <FolderIcon />
        </button>
        <Link
          to={link}
          className="text-sm font-medium text-slate-200 group-hover:text-sky-400 transition flex-1 truncate"
        >
          {node.name}
        </Link>
        <span className="text-xs text-slate-600 shrink-0">
          {node.children.length} items
        </span>
      </div>
      {open && (
        <div className="border-l border-slate-800 ml-5">
          {node.children.map((child) => (
            <TreeNode
              key={child.name}
              node={child}
              path={`${path}/${child.name}`}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreePage() {
  const { tree } = useTreeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = tree ? searchTree(tree, query) : [];

  function handleSearch(value: string) {
    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
    }

    setSearchParams(next);
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl">
        {/* Header section */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">
            File Tree
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky-400 transition"
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
            Back
          </Link>
        </div>

        {/* Search Section */}
        <div className="relative mb-4">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        </div>

        {/* Search results */}
        {query && (
          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <p className="mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.length === 0 ? (
              <p className="text-sm text-slate-500">No results found.</p>
            ) : (
              <ul className="space-y-2">
                {results.map((r) => {
                  const rel = r.path.replace(/^root\/?/, "");
                  return (
                    <li key={r.path} className="flex items-start gap-2">
                      {r.type === "folder" ? <FolderIcon /> : <FileIcon />}
                      <div className="min-w-0">
                        <Link
                          to={`/tree/${encodeURIComponent(rel)}`}
                          className="text-sm text-sky-400 hover:underline"
                        >
                          {r.name}
                        </Link>
                        <p className="font-mono text-xs text-slate-600 truncate">
                          {r.path}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Tree */}
        {tree ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <TreeNode node={tree} path="root" />
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-8 text-center">
            <p className="text-sm text-slate-500 mb-2">No data loaded.</p>
            <Link to="/" className="text-sm text-sky-400 hover:underline">
              Load JSON on the home page
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
