import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseTreeJson } from "../utils/treeUtils";
import { useTreeContext } from "../context/TreeProvider";

const sampleJson = `{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 },
        {
          "name": "components",
          "type": "folder",
          "children": [
            { "name": "Button.tsx", "type": "file", "size": 512 }
          ]
        }
      ]
    },
    { "name": "package.json", "type": "file", "size": 300 }
  ]
}`;

export default function HomePage() {
  const [input, setInput] = useState(sampleJson);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setTree } = useTreeContext();

  function handleSubmit() {
    try {
      const parsed = parseTreeJson(input);
      setTree(parsed);
      setError(null);
      navigate("/tree");
    } catch {
      setError("Please provide a valid tree JSON.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ""));
      setError(null);
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
              FileTree Explorer
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Visualize your directory
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Paste JSON or upload a{" "}
            <code className="bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded text-xs">
              .json
            </code>{" "}
            file with a directory tree structure.
          </p>
        </div>

        {/* Upload JSON Section */}
        <div className="mb-3">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload .json file
          </button>
        </div>

        {/* Textarea for JSON Input */}
        <textarea
          className="w-full min-h-[240px] rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y transition"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          placeholder="Paste JSON here..."
        />

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
          >
            Open tree
          </button>
        </div>
      </div>
    </main>
  );
}
