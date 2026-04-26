import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { TreeNode } from "../types";
/* eslint-disable react-refresh/only-export-components */

type TreeContextValue = {
  tree: TreeNode | null;
  setTree: Dispatch<SetStateAction<TreeNode | null>>;
};

export const TreeContext = createContext<TreeContextValue | null>(null);

const STORAGE_KEY = "tree-provider-data";

export function TreeProvider({ children }: { children: ReactNode }) {
  const [tree, setTree] = useState<TreeNode | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as TreeNode;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (tree) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [tree]);

  return (
    <TreeContext.Provider value={{ tree, setTree }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error("useTreeContext is outside of TreeProvider");
  }
  return ctx;
}
