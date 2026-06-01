import type { SessionUser } from "../types";
import { CAST_DISPLAY_NAME } from "./casts";

export const session: SessionUser = {
  id: "user-cast-a",
  name: CAST_DISPLAY_NAME,
  role: "cast",
  castId: "cast-a",
};
