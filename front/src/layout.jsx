import { useAuth, } from "./utils/AuthContext";

function Layout({ children }) {
  return (
    <div className="p-10 bg-white rounded-lg min-w-screen">
      {children}
    </div>
  );
}

export default Layout;