import app from "./app";
import config from "./config";
import { prisma } from "./libs/prisma";
const PORT = config.port || 5000;





async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    await prisma.$disconnect();
    process.exit(1);
    console.error(err);
  }
}
main();
