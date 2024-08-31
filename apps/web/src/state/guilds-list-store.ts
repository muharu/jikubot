import type { PersistStorage, StorageValue } from "zustand/middleware";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Guilds } from "~/features/dashboard/types";

interface GuildsList {
  guilds: Guilds;
  setGuilds: (guilds: Guilds) => void;
}

const STORAGE_KEY = "guilds";

const sessionStoragePersist: PersistStorage<GuildsList> = {
  getItem: (name) => {
    const value = sessionStorage.getItem(name);
    return value ? (JSON.parse(value) as StorageValue<GuildsList>) : null;
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

export const useGuildsListStore = create<GuildsList>()(
  persist<GuildsList>(
    (set) => ({
      guilds: [],
      setGuilds: (guilds) => set({ guilds }),
    }),
    {
      name: STORAGE_KEY,
      storage: sessionStoragePersist,
    },
  ),
);
