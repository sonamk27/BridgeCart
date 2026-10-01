import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login({
  onOwnerLogin,
  onCustomerLogin,
  onBack,
}) {
  const [role, setRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!role) {
      setError("Please select a role.");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let userCredential;

      if (isSignUp) {
        // Firebase Email/Password Sign Up
        userCredential = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );
        console.log("Successfully signed up:", userCredential.user);
      } else {
        // Firebase Email/Password Login
        userCredential = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );
        console.log("Successfully logged in:", userCredential.user);
      }

      // Navigate according to selected role
      if (role === "owner") {
        onOwnerLogin();
      } else if (role === "customer") {
        onCustomerLogin();
      }
    } catch (error) {
      console.error("Firebase auth error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password. If you haven't created an account yet, click 'Sign Up' below.");
          break;

        case "auth/email-already-in-use":
          setError("An account with this email already exists. Please switch to Sign In.");
          break;

        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;

        case "auth/user-not-found":
          setError("No account found with this email. Click 'Sign Up' below to create one.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
          setError("Invalid Firebase API key. Please update your API key in firebase.js.");
          break;

        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;

        default:
          setError(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--teal)] flex items-center justify-center text-lg">
            🛒
          </div>

          <span className="font-extrabold text-[18px] text-[var(--navy-deep)]">
            BridgeCart
          </span>
        </div>

        {/* ROLE SELECTION */}
        {!role ? (
          <div className="bg-white border border-[var(--border)] rounded-2xl p-7">

            <div className="text-center mb-6">
              <div className="text-[18px] font-extrabold mb-1">
                Sign in to continue
              </div>

              <div className="text-[13px] text-[var(--muted)]">
                Choose how you want to use BridgeCart
              </div>
            </div>

            <div className="space-y-3">

              {/* OWNER */}
              <button
                type="button"
                onClick={() => {
                  setRole("owner");
                  setError("");
                }}
                className="w-full flex items-center gap-4 border-2 border-[var(--border)] rounded-xl p-4 text-left hover:border-[var(--teal)] hover:bg-[#F3FBFA] transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[var(--navy-deep)] text-white flex items-center justify-center text-[20px] shrink-0">
                  🏬
                </div>

                <div>
                  <div className="font-bold text-[14.5px]">
                    I'm a Store Owner
                  </div>

                  <div className="text-[12px] text-[var(--muted)]">
                    Manage layout, products, stock & orders
                  </div>
                </div>
              </button>

              {/* CUSTOMER */}
              <button
                type="button"
                onClick={onCustomerLogin}
                className="w-full flex items-center gap-4 border-2 border-[var(--border)] rounded-xl p-4 text-left hover:border-[var(--teal)] hover:bg-[#F3FBFA] transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[var(--teal)] text-white flex items-center justify-center text-[20px] shrink-0">
                  🛍️
                </div>

                <div>
                  <div className="font-bold text-[14.5px]">
                    I'm a Customer
                  </div>

                  <div className="text-[12px] text-[var(--muted)]">
                    Find products and their exact shelf location
                  </div>
                </div>
              </button>

            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full text-center text-[12.5px] font-semibold text-[var(--muted)] mt-6 hover:text-[var(--text)]"
            >
              ← Back to home
            </button>

          </div>
        ) : (

          /* LOGIN FORM */
          <div className="bg-white border border-[var(--border)] rounded-2xl p-7">

            <button
              type="button"
              onClick={() => {
                setRole(null);
                setError("");
                setEmail("");
                setPassword("");
              }}
              className="text-[12.5px] font-semibold text-[var(--muted)] hover:text-[var(--text)] mb-4"
            >
              ← Choose a different role
            </button>

            {/* ROLE HEADER */}
            <div className="flex items-center gap-3 mb-6">

              <div
                className={`w-11 h-11 rounded-lg text-white flex items-center justify-center text-[20px] shrink-0 ${
                  role === "owner"
                    ? "bg-[var(--navy-deep)]"
                    : "bg-[var(--teal)]"
                }`}
              >
                {role === "owner" ? "🏬" : "🛍️"}
              </div>

              <div>
                <div className="font-extrabold text-[16px]">
                  {role === "owner"
                    ? "Owner Sign In"
                    : "Customer Sign In"}
                </div>

                <div className="text-[12px] text-[var(--muted)]">
                  {role === "owner"
                    ? "Lokmanya Super Market"
                    : "Find what you need, fast"}
                </div>
              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-[12px] text-red-600">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >

              {/* EMAIL */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "owner"
                      ? "ramesh@lokmanya.in"
                      : "you@example.com"
                  }
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]"
                  required
                  disabled={loading}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]"
                  required
                  disabled={loading}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold text-[13.5px] py-2.5 rounded-lg transition-colors cursor-pointer ${
                  role === "owner"
                    ? "bg-[var(--navy-deep)] hover:opacity-90"
                    : "bg-[var(--teal)] hover:bg-[var(--teal-dark)]"
                } ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                  ? `Sign up as ${role === "owner" ? "Owner" : "Customer"}`
                  : `Sign in as ${role === "owner" ? "Owner" : "Customer"}`}
              </button>

              {/* TOGGLE SIGN IN / SIGN UP */}
              <div className="pt-1 text-center text-[12.5px]">
                <span className="text-[var(--muted)]">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="font-bold text-[var(--navy-deep)] hover:underline ml-1 cursor-pointer"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              <div className="text-[11px] text-center text-[var(--muted)] pt-1">
                {isSignUp
                  ? "Create a new BridgeCart account."
                  : "Sign in securely with your BridgeCart account."}
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}