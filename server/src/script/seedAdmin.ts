import { UserRole } from "../enum/userRole";
import { prisma } from "../libs/prisma";

async function seedAdmin() {
  try {
    console.log(`=========Admin Seeding Started==========`);
    const adminData = {
      name: "Admin User",
      email: "admin@mail.com",
      role: UserRole.ADMIN,
      password: "Admin@12345",
    };
    console.log(`=========Check Admin Is Exist==========`);
    const isExist = await prisma.user.findUnique({
      where: { email: adminData.email },
    });
    console.log(isExist);
    if (isExist) {
      console.log(`Admin User Already Exist. Skipping Seeding.`);
      return;
    }
    console.log(`=========Creating Admin User==========`);
    const signUpAdmin = await fetch(
      `http://localhost:3000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    if (signUpAdmin.ok) {
      console.log(`========= Admin User created==========`);
      await prisma.user.update({
        where: { email: adminData.email },
        data: { emailVerified: true },
      });
      console.log(`============== Email Status Updated ==============`);
    }
    console.log(`=========Admin Seeding Completed==========`);
  } catch (error: any) {
    console.error("Error seeding admin user:", error.message);
  }
}
seedAdmin();
