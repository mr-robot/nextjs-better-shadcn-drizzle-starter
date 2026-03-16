import { UserProfile } from "@/components/auth/user-profile";
import { LogoutButton } from "@/components/auth/logout-button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <UserProfile />
            <LogoutButton />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
          <p>You are successfully authenticated with Better Auth.</p>
        </div>
      </div>
    </div>
  );
}
