import { useAuth } from "../contexts/AuthContext";

export default function LoginButton() {
  const { user, setShowAuth, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 hidden sm:inline truncate max-w-[100px]">{user.email}</span>
        <button onClick={signOut}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-0">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setShowAuth(true)}
      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0 whitespace-nowrap">
      Sign In
    </button>
  );
}
