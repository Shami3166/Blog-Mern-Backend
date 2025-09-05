export const logger = (message: string, type: "info" | "error" = "info") => {
  const time = new Date().toISOString();
  if (type === "error") {
    console.error(`[ERROR] [${time}] ${message}`);
  } else {
    console.log(`[INFO] [${time}] ${message}`);
  }
};
