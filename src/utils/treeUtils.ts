import type { TreeNode, SearchResult } from "../types";

export function parseTreeJson(input: string): TreeNode {
  const value: unknown = JSON.parse(input);
  if (!isTreeNode(value)) throw new Error("Invalid tree JSON format.");
  return value;
}

function isTreeNode(value: unknown): value is TreeNode {
  if (!value || typeof value !== "object") return false;
  const node = value as Record<string, unknown>;
  if (typeof node.name !== "string") return false;
  if (node.type === "file") return typeof node.size === "number";
  if (node.type === "folder")
    return Array.isArray(node.children) && node.children.every(isTreeNode);
  return false;
}

export function formatSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function findNodeByPath(tree: TreeNode, path: string): TreeNode | null {
  if (!path || path === "root") return tree;
  const parts = path.split("/").filter(Boolean);
  let current: TreeNode = tree;
  for (const part of parts) {
    if (current.type !== "folder") return null;
    const next = current.children.find((c) => c.name === part);
    if (!next) return null;
    current = next;
  }
  return current;
}

export function getFolderSize(node: TreeNode): number {
  if (node.type === "file") return node.size;
  return node.children.reduce((sum, child) => sum + getFolderSize(child), 0);
}

export function searchTree(
  node: TreeNode,
  query: string,
  path = "root",
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  if (node.name.toLowerCase().includes(q))
    results.push({ name: node.name, path, type: node.type });
  if (node.type === "folder") {
    for (const child of node.children) {
      results.push(...searchTree(child, query, `${path}/${child.name}`));
    }
  }
  return results;
}
