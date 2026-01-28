import { getAuthUser } from "@/lib/auth";
import User, { UserDocument } from "@/lib/userModel";

export type CurrentUserPayload = {
  authToken: { userId: string; email: string };
  user: UserDocument;
};

export const getCurrentUser = async (): Promise<CurrentUserPayload | null> => {
  const authToken = await getAuthUser();
  if (!authToken) {
    return null;
  }

  const user = await User.findById(authToken.userId);
  if (!user) {
    return null;
  }

  return { authToken, user };
};

export const requireCurrentUser = async (): Promise<CurrentUserPayload> => {
  const current = await getCurrentUser();
  if (!current) {
    throw new Error("UNAUTHORIZED");
  }
  return current;
};
