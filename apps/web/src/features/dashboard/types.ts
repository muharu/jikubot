import type { RouterOutputs } from "@giverve/api";

export interface GuildCardProps {
  id: string;
  name: string;
  icon?: string | null;
  isJoined: boolean;
}

export interface CardContentProps {
  id: string;
  name: string;
  isJoined: boolean;
}

export type Guilds = RouterOutputs["dashboard"]["guilds"]["getAll"];
export type User = RouterOutputs["dashboard"]["user"]["me"];
