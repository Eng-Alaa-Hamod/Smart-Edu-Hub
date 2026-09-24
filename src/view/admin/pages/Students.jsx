
import AdminUsersTable from "./AdminUsersTable";

function Students() {
  return (
    <AdminUsersTable
      roleFilter="student"
      title="Students management"
      description="Manage student access, messaging permissions, and reports."
    />
  );
}

export default Students
