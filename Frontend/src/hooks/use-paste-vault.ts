"use client";

import { useState, useEffect, useCallback } from "react";

export interface VaultPaste {
  id: string;
  slug?: string;
  title: string | null;
  managementToken: string;
  createdAt: string;
}

const VAULT_STORAGE_KEY = "paste_anon_vault_v1";

export function usePasteVault() {
  const [vault, setVault] = useState<VaultPaste[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (stored) {
        setVault(JSON.parse(stored));
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  const savePaste = useCallback((item: VaultPaste) => {
    try {
      setVault((prev) => {
        const updated = [item, ...prev.filter((p) => p.id !== item.id)];
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // ignore storage errors
    }
  }, []);

  const removePaste = useCallback((id: string) => {
    try {
      setVault((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // ignore
    }
  }, []);

  const getManagementToken = useCallback((id: string): string | undefined => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(VAULT_STORAGE_KEY);
        if (stored) {
          const list: VaultPaste[] = JSON.parse(stored);
          const item = list.find((p) => p.id === id || p.slug === id);
          if (item?.managementToken) return item.managementToken;
        }
      } catch {
        // ignore
      }
    }
    return undefined;
  }, []);

  return {
    vault,
    savePaste,
    removePaste,
    getManagementToken,
    getToken: getManagementToken,
  };
}
