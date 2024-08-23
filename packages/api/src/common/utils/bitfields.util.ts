/*
 * Bitfields utility functions
 * https://discord.com/developers/docs/topics/permissions
 */

export function hasPermission(
  bitfield: number,
  permissionName: Permission,
): boolean {
  const permissionBitfield = PERMISSIONS[permissionName];
  return (bitfield & permissionBitfield) === permissionBitfield;
}

export function hasPermissions(
  bitfield: number,
  permissionNames: Permission[],
): boolean {
  return permissionNames.every((permissionName) => {
    const permissionBitfield = PERMISSIONS[permissionName];
    return (bitfield & permissionBitfield) === permissionBitfield;
  });
}

const PERMISSIONS = {
  CREATE_INSTANT_INVITE: 1 << 0, // 1
  KICK_MEMBERS: 1 << 1, // 2
  BAN_MEMBERS: 1 << 2, // 4
  ADMINISTRATOR: 1 << 3, // 8
  MANAGE_CHANNELS: 1 << 4, // 16
  MANAGE_GUILD: 1 << 5, // 32
  ADD_REACTIONS: 1 << 6, // 64
  VIEW_AUDIT_LOG: 1 << 7, // 128
  PRIORITY_SPEAKER: 1 << 8, // 256
  STREAM: 1 << 9, // 512
  VIEW_CHANNEL: 1 << 10, // 1024
  SEND_MESSAGES: 1 << 11, // 2048
  SEND_TTS_MESSAGES: 1 << 12, // 4096
  MANAGE_MESSAGES: 1 << 13, // 8192
  EMBED_LINKS: 1 << 14, // 16384
  ATTACH_FILES: 1 << 15, // 32768
  READ_MESSAGE_HISTORY: 1 << 16, // 65536
  MENTION_EVERYONE: 1 << 17, // 131072
  USE_EXTERNAL_EMOJIS: 1 << 18, // 262144
  VIEW_GUILD_INSIGHTS: 1 << 19, // 524288
  CONNECT: 1 << 20, // 1048576
  SPEAK: 1 << 21, // 2097152
  MUTE_MEMBERS: 1 << 22, // 4194304
  DEAFEN_MEMBERS: 1 << 23, // 8388608
  MOVE_MEMBERS: 1 << 24, // 16777216
  USE_VAD: 1 << 25, // 33554432
  CHANGE_NICKNAME: 1 << 26, // 67108864
  MANAGE_NICKNAMES: 1 << 27, // 134217728
  MANAGE_ROLES: 1 << 28, // 268435456
  MANAGE_WEBHOOKS: 1 << 29, // 536870912
  MANAGE_GUILD_EXPRESSIONS: 1 << 30, // 1073741824
  USE_APPLICATION_COMMANDS: 1 << 31, // 2147483648
  REQUEST_TO_SPEAK: 1 << 32, // 4294967296
  MANAGE_EVENTS: 1 << 33, // 8589934592
  MANAGE_THREADS: 1 << 34, // 17179869184
  CREATE_PUBLIC_THREADS: 1 << 35, // 34359738368
  CREATE_PRIVATE_THREADS: 1 << 36, // 68719476736
  USE_EXTERNAL_STICKERS: 1 << 37, // 137438953472
  SEND_MESSAGES_IN_THREADS: 1 << 38, // 274877906944
  USE_EMBEDDED_ACTIVITIES: 1 << 39, // 549755813888
  MODERATE_MEMBERS: 1 << 40, // 1099511627776
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 1 << 41, // 2199023255552
  USE_SOUNDBOARD: 1 << 42, // 4398046511104
  CREATE_GUILD_EXPRESSIONS: 1 << 43, // 8796093022208
  CREATE_EVENTS: 1 << 44, // 17592186044416
  USE_EXTERNAL_SOUNDS: 1 << 45, // 35184372088832
  SEND_VOICE_MESSAGES: 1 << 46, // 70368744177664
  SEND_POLLS: 1 << 49, // 562949953421312
  USE_EXTERNAL_APPS: 1 << 50, // 1125899906842624
} as const;

type Permission = keyof typeof PERMISSIONS;
