import AdminUsersTable from "./AdminUsersTable";

function Teachers() {
  return (
    <AdminUsersTable
      roleFilter="teacher"
      title="Teachers management"
      description="Manage teacher roles, access, and account status."
    />
  );
}

export default Teachers;
