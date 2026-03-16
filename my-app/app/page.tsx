import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">Sign in to access your dashboard</p>
          <div className="space-y-3">
            <LoginButton provider="google" />
            <LoginButton provider="facebook" />
          </div>
        </div>
      </div>
    </div>
  );
}
