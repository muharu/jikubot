import type { z } from "zod";

import type { RESTGetAPIUserResult } from "../common/discord";
import type { authorizeResponse } from "../schemas/auth.schema";

type AuthUserDTO = z.infer<typeof authorizeResponse>;

export function convertToAuthUserDTO(data: RESTGetAPIUserResult): AuthUserDTO {
  return {
    id: parseInt(data.id),
    username: String(data.username),
    email: String(data.email),
    avatar: String(data.avatar),
    globalName: String(data.global_name),
  };
}

const authUserDTOMapper = {
  convertToAuthUserDTO,
};

export default authUserDTOMapper;
