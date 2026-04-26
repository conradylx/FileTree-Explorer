import { describe, it, expect } from "vitest";
import {
  formatSize,
  getFolderSize,
  findNodeByPath,
  searchTree,
  parseTreeJson,
} from "../utils/treeUtils";
import type { TreeNode } from "../types";

const tree: TreeNode = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "index.ts", type: "file", size: 1024 },
        {
          name: "components",
          type: "folder",
          children: [{ name: "Button.tsx", type: "file", size: 512 }],
        },
      ],
    },
    { name: "package.json", type: "file", size: 300 },
  ],
};

describe("formatSize", () => {
  it("formats bytes", () => {
    expect(formatSize(300)).toBe("300 B");
  });

  it("formats kilobytes", () => {
    expect(formatSize(1024)).toBe("1.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatSize(1024 * 1024)).toBe("1.0 MB");
  });
});

describe("getFolderSize", () => {
  it("returns file size for a file node", () => {
    const file: TreeNode = { name: "a.ts", type: "file", size: 500 };
    expect(getFolderSize(file)).toBe(500);
  });

  it("sums all files in a nested folder", () => {
    // 1024 + 512 + 300 = 1836
    expect(getFolderSize(tree)).toBe(1836);
  });

  it("returns 0 for an empty folder", () => {
    const empty: TreeNode = { name: "empty", type: "folder", children: [] };
    expect(getFolderSize(empty)).toBe(0);
  });
});

describe("findNodeByPath", () => {
  it("returns root for empty path", () => {
    expect(findNodeByPath(tree, "")).toBe(tree);
  });

  it("finds a top-level file", () => {
    const node = findNodeByPath(tree, "package.json");
    expect(node?.name).toBe("package.json");
  });

  it("finds a nested file", () => {
    const node = findNodeByPath(tree, "src/components/Button.tsx");
    expect(node?.name).toBe("Button.tsx");
  });

  it("returns null for non-existent path", () => {
    expect(findNodeByPath(tree, "src/nonexistent.ts")).toBeNull();
  });
});

describe("searchTree", () => {
  it("returns empty array for empty query", () => {
    expect(searchTree(tree, "")).toHaveLength(0);
  });

  it("finds files by name", () => {
    const results = searchTree(tree, "button");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Button.tsx");
  });

  it("is case-insensitive", () => {
    const results = searchTree(tree, "PACKAGE");
    expect(results[0].name).toBe("package.json");
  });

  it("returns full path in results", () => {
    const results = searchTree(tree, "Button.tsx");
    expect(results[0].path).toBe("root/src/components/Button.tsx");
  });

  it("finds folders by name", () => {
    const results = searchTree(tree, "components");
    expect(results[0].type).toBe("folder");
  });
});

describe("parseTreeJson", () => {
  it("parses valid JSON", () => {
    const json = JSON.stringify(tree);
    expect(() => parseTreeJson(json)).not.toThrow();
  });

  it("throws on invalid JSON", () => {
    expect(() => parseTreeJson("not json")).toThrow();
  });

  it("throws on wrong structure", () => {
    expect(() => parseTreeJson('{"name": "x"}')).toThrow();
  });
});
