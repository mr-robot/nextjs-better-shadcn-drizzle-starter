import { auth } from "@/lib/auth"; // Note: Adjust import to relative if no alias: ../../../../lib/auth
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
