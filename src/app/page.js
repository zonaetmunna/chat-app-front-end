import AppNavbar from "./_components/appNavbar";
import Login from "./_components/login";
import Signup from "./_components/signup";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div>
      {!loading && !user && (
        <>
          <Login />
          <Signup />
        </>
      )}
      {!loading && user && (
        <>
          <AppNavbar />
          {/* Render chat components here */}
        </>
      )}
    </div>
  );
}
