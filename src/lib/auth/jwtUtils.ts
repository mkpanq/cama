/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import jwt from "jsonwebtoken";

export function generateToken(): string {
  // Example payload - I'm removing any auth mechanisms for now - only one credentials per instance
  return jwt.sign({ userId: "some-user-id" }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

export function isJWTTokenValid(token: string | undefined): any {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded) return true;

    return false;
  } catch (error) {
    console.error(`Error verifying token: ${error.message}`);

    return false;
  }
}
