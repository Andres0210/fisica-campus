import UserManager from "@/components/admin/UserManager";
import { requireTeacherSession } from "@/lib/auth";
import { getAdminUsers } from "@/lib/user-service";

export default async function AdminUsersPage() {
  await requireTeacherSession();

  const users = await getAdminUsers().catch(() => []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuarios</h1>
      <UserManager users={users} />
    </div>
  );
}
