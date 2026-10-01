import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const cleanEmail = email.trim();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      console.log("USER CREATED:", userCredential.user);
      console.log("EMAIL:", userCredential.user.email);
      console.log("PROJECT ID:", auth.app.options.projectId);

      alert("Account created successfully!");

      // Optional: sign out so you can test Login separately
      await signOut(auth);

    } catch (error) {
      console.error("SIGNUP ERROR CODE:", error.code);
      console.error("SIGNUP ERROR MESSAGE:", error.message);

      alert(`${error.code}\n${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password (minimum 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">
        Sign Up
      </button>
    </form>
  );
}

export default Signup;