import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AdminDashboard = () => {
  const authData = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex">
      <div className="">
        <h1>Admin Dashboard</h1>
        <div>
          <h1>User Information</h1>
          <p>UserId: {authData.userId}</p>
          <p>UserName: {authData.userName}</p>
          <p>Email: {authData.email}</p>
          <p>Role: {authData.role}</p>

          <h2>Permissions:</h2>
          <ul>
            {authData.permissions.map((permission) => (
              <li key={permission.id}>
                {permission.permissionName} - {permission.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
