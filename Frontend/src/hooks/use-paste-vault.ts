"use client";

import { useState, useEffect } from "react";

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

  const savePaste = (item: VaultPaste) => {
    try {
      const updated = [item, ...vault.filter((p) => p.id !== item.id)];
      setVault(updated);
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const removePaste = (id: string) => {
    try {
      const updated = vault.filter((p) => p.id !== id);
      setVault(updated);
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const getManagementToken = (id: string): string | undefined => {
    const found = vault.find((p) => p.id === id || p.slug === id);
    return found?.managementToken;
  };

  return {
    vault,
    savePaste,
    removePaste,
    getManagementToken,
  };
}
