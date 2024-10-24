import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRoles } from "../services/authService";
import { isAdmin } from "../utils/authUtils";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRoles = async () => {
      const roles = await getUserRoles();

      if (!isAdmin(roles)) {
        const message = "You are not authorized to access this page.";
        console.warn(message);

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
      }
    };

    checkRoles();
  }, [navigate]);

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
};

export default AdminPage;
