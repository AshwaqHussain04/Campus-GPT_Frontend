import { useState, useNavigate } from "react";
import Button from "./Button";

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState("signup");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength =
    password.length > 10 ? "Strong" : password.length > 6 ? "Medium" : "Weak";

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <div className="auth-role-switch">
          <button
            className={
              activeRole === "signup" ? "role-card active" : "role-card"
            }
            onClick={() => setActiveRole("signup")}
          >
            <strong>Admin Signup</strong>
            <span>New Admin Account</span>
          </button>
          <button
            className={
              activeRole === "Login" ? "role-card active" : "role-card"
            }
            onClick={() => setActiveRole("login")}
          >
            <strong>Admin Login</strong>
            <span>Admin Profile</span>
          </button>
        </div>

        <form className="auth-form">
          {activeRole === "signup" ? (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Dr. Monisha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Admin Email
                <input
                  type="email"
                  placeholder="aarav@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  required
                />
              </label>
              <div className="strength-meter">
                <span>Strength: {strength}</span>
                <div className="meter-bar">
                  <span className={`meter-fill ${strength.toLowerCase()}`} />
                </div>
              </div>
              <label>
                Confirm Password
                <input type="password" placeholder="Repeat password" />
              </label>
              <Button className="w-100">Create account</Button>
            </>
          ) : (
            <>
              <label>
                Admin Email
                <input
                  type="email"
                  placeholder="monisha@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  required
                />
              </label>
              <div className="strength-meter">
                <span>Strength: {strength}</span>
                <div className="meter-bar">
                  <span className={`meter-fill ${strength.toLowerCase()}`} />
                </div>
              </div>
              <label>
                Confirm Password
                <input type="password" placeholder="Repeat password" />
              </label>
              <Button className="w-100">Login</Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
