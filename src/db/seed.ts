import { isNotNull, isNull } from "drizzle-orm";
import { hash } from "bcryptjs";
import {
  db,
  pembimbings,
  instansis,
  jurusans,
  kkl_agts,
  kkl_klps,
  kkl_periodes,
  laporans,
  mahasiswas,
  menus,
  dosens,
  penilaians,
  role_permissions,
  roles,
  users,
} from "./index";

const roleSeedData = [
  { code: "ADMIN", name: "Administrator" },
  { code: "USER", name: "User" },
];

const menuSeedData = [
  {
    name: "Dashboard",
    path: "/dashboard",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Master Data",
    path: null,
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Web Management",
    path: null,
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "KKL Management",
    path: null,
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Role",
    path: "/master-data/roles",
    permissionPath: "/api/roles",
    icon: null,
    parentName: "Master Data",
  },
  {
    name: "User",
    path: "/master-data/users",
    permissionPath: "/api/users",
    icon: null,
    parentName: "Master Data",
  },
  {
    name: "Jurusan",
    path: "/master-data/jurusans",
    permissionPath: "/api/jurusans",
    icon: null,
    parentName: "Master Data",
  },
  {
    name: "Mahasiswa",
    path: "/master-data/mahasiswas",
    permissionPath: "/api/mahasiswas",
    icon: null,
    parentName: "Master Data",
  },
  {
    name: "Dosen",
    path: "/master-data/dosens",
    permissionPath: "/api/dosens",
    icon: null,
    parentName: "Master Data",
  },
  {
    name: "Instansi",
    path: "/kkl-management/instansis",
    permissionPath: "/api/instansis",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Periode KKL",
    path: "/kkl-management/kkl-periodes",
    permissionPath: "/api/kkl-periodes",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Kelompok KKL",
    path: "/kkl-management/kkl-klps",
    permissionPath: "/api/kkl-klps",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Anggota KKL",
    path: "/kkl-management/kkl-agts",
    permissionPath: "/api/kkl-agts",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Menu",
    path: "/web-management/menus",
    permissionPath: "/api/menus",
    icon: null,
    parentName: "Web Management",
  },
  {
    name: "Role Permission",
    path: "/web-management/role-permissions",
    permissionPath: "/api/role-permissions",
    icon: null,
    parentName: "Web Management",
  },
  {
    name: "Laporan",
    path: "/kkl-management/laporans",
    permissionPath: "/api/laporans",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Pembimbing Lapangan",
    path: "/kkl-management/pembimbing-lapangans",
    permissionPath: "/api/pembimbings",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Penilaian",
    path: "/kkl-management/penilaians",
    permissionPath: "/api/penilaians",
    icon: null,
    parentName: "KKL Management",
  },
  {
    name: "Anggota Kelompok",
    path: "/dosen/anggota-kelompok",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Penilaian",
    path: "/pembimbing-lapangan/anggota-kelompok",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Laporan",
    path: "/mahasiswa/laporan",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Penilaian",
    path: "/mahasiswa/penilaian",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
  {
    name: "Instansi",
    path: "/instansi",
    permissionPath: null,
    icon: null,
    parentName: null,
  },
];

async function clearAllTables() {
  await db.delete(penilaians);
  await db.delete(pembimbings);
  await db.delete(laporans);
  await db.delete(kkl_agts);
  await db.delete(kkl_klps);
  await db.delete(kkl_periodes);
  await db.delete(dosens);
  await db.delete(mahasiswas);
  await db.delete(instansis);
  await db.delete(jurusans);
  await db.delete(role_permissions);
  await db.delete(menus).where(isNotNull(menus.parent_id));
  await db.delete(menus).where(isNull(menus.parent_id));
  await db.delete(users);
  await db.delete(roles);
}

async function seed() {
  try {
    console.log("Starting database seeding...");

    await clearAllTables();

    console.log("Seeding roles...");
    const insertedRoles = await db
      .insert(roles)
      .values(roleSeedData)
      .$returningId();

    console.log("Seeding users...");
    const adminPassword = await hash("admin123", 10);
    const userPassword = await hash("user123", 10);

    await db.insert(users).values([
      {
        username: "admin",
        password: adminPassword,
        role_id: insertedRoles[0].id,
        is_active: true,
      },
      {
        username: "user",
        password: userPassword,
        role_id: insertedRoles[1].id,
        is_active: true,
      },
    ]);

    console.log("Seeding parent menus...");
    const parentMenus = menuSeedData.filter((menu) => menu.parentName === null);
    const insertedParentMenus = await db
      .insert(menus)
      .values(
        parentMenus.map((menu) => ({
          name: menu.name,
          path: menu.path,
          permission_path: menu.permissionPath,
          icon: menu.icon,
          parent_id: null,
        })),
      )
      .$returningId();

    const parentMenuIdByName = new Map<string, number>();
    parentMenus.forEach((menu, index) => {
      parentMenuIdByName.set(menu.name, insertedParentMenus[index].id);
    });

    console.log("Seeding child menus...");
    const childMenus = menuSeedData.filter((menu) => menu.parentName !== null);
    const insertedChildMenus = await db
      .insert(menus)
      .values(
        childMenus.map((menu) => ({
          name: menu.name,
          path: menu.path,
          permission_path: menu.permissionPath,
          icon: menu.icon,
          parent_id: parentMenuIdByName.get(menu.parentName as string) ?? null,
        })),
      )
      .$returningId();

    const allInsertedMenuIds = [
      ...insertedParentMenus,
      ...insertedChildMenus,
    ].map((menu) => menu.id);

    console.log("Seeding role permissions...");
    await db.insert(role_permissions).values(
      allInsertedMenuIds.map((menuId) => ({
        role_id: insertedRoles[0].id,
        menu_id: menuId,
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_report: true,
      })),
    );

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
