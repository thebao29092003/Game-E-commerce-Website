import { Outlet } from "react-router-dom";
import SidebarComponent from "./pages/userProfile/sidebar/SidebarComponent";

function UserLayout() {
  return (
    <div>
      <SidebarComponent/>
      <div>
        <Outlet /> {/* Hiện các trang con */}
      </div>
    </div>
  );
}

export default UserLayout;
