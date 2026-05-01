import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error("Error:", err.message);

  return c.json(
    {
      success: false,
      message: err.message || "Internal server error",
    },
    500
  );
};
