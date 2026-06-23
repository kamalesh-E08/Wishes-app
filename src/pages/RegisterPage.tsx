import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import { useAuthStore } from "../store/authStore";
import { loginWithGoogle } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await registerUser(email, password);

      login({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });

      navigate("/");
    } catch {
      alert("Registration Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-4xl font-bold mb-8">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10"
        />

        <button
          type="submit"
          className="
          w-full
          py-3
          rounded-xl
          bg-cyan-500
          "
        >
          Register
        </button>
      </form>
      <button
        type="button"
        onClick={async () => {
          try {
            const user = await loginWithGoogle();

            login({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
            });

            navigate("/");
          } catch (error) {
            console.error(error);
          }
        }}
        className="
            w-full
            py-3
            rounded-xl
            bg-white
            text-black
            font-medium
          "
      >
        Continue with Google
      </button>

      <p className="mt-4">
        Already have an account?
        <Link to="/login" className="text-cyan-400 ml-2">
          Login
        </Link>
      </p>
    </div>
  );
}
