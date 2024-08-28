import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { GuildMe } from "@giverve/validators";
import { db, eq, guilds, userGuilds } from "@giverve/db";
import {
  guildMeResponseValidator,
  guildsMeResponseValidator,
  joinGuildRequestValidator,
  leaveGuildRequestValidator,
} from "@giverve/validators";

import { common, services } from "../context";
import { botProcedure, createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardGuildsRouter = createTRPCRouter({
  getAll: dashboardProcedure
    .output(guildsMeResponseValidator)
    .query(async ({ ctx }) => {
      const guilds = await services.user.getManagedGuilds(
        BigInt(ctx.user.id),
        ctx.accessToken,
      );
      return guilds;
    }),

  getOne: dashboardProcedure
    .input(
      z.object({
        guildId: z.string(),
      }),
    )
    .output(guildMeResponseValidator)
    .query(async ({ input }) => {
      const cacheKey = `guild:${input.guildId}`;
      const cacheData =
        await common.utils.cache.inMemoryCache.get<GuildMe>(cacheKey);

      if (cacheData) {
        return cacheData;
      } else {
        const [data] = await db
          .select({
            id: guilds.id,
            name: guilds.name,
            permissions: userGuilds.permissions,
            icon: guilds.icon,
            isJoined: guilds.isActive,
          })
          .from(guilds)
          .leftJoin(userGuilds, eq(guilds.guildId, userGuilds.guildId));

        if (!data) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }

        if (!data.isJoined) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }

        const guild: GuildMe = {
          id: String(data.id),
          name: String(data.name),
          permissions: String(data.permissions),
          isJoined: data.isJoined,
          icon: data.icon,
        };

        await common.utils.cache.inMemoryCache.set(cacheKey, guild, 59_000);

        return guild;
      }
    }),
});

export const botGuildsRouter = createTRPCRouter({
  join: botProcedure
    .input(joinGuildRequestValidator)
    .mutation(async ({ input }) => {
      return await services.user.joinGuild({
        ...input,
        guildId: BigInt(input.guildId),
        ownerId: BigInt(input.ownerId),
      });
    }),

  leave: botProcedure
    .input(leaveGuildRequestValidator)
    .mutation(async ({ input }) => {
      return await services.user.leaveGuild(BigInt(input.guildId));
    }),
});
