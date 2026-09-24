import { useState } from "react";
import Button from "./Button";

const SignupPage = () => {
  const [activeRole, setActiveRole] = useState("signup");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");

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
            <strong>Student Signup</strong>
            <span>New Student Account</span>
          </button>
          <button
            className={
              activeRole === "Login" ? "role-card active" : "role-card"
            }
            onClick={() => setActiveRole("login")}
          >
            <strong>Student Login</strong>
            <span>Student Profile</span>
          </button>
        </div>

        <form className="auth-form">
          {activeRole === "signup" ? (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Student Email
                <input
                  type="email"
                  placeholder="aarav@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Roll Number
                <input
                  type="number"
                  placeholder="23JECS001"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
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
                Student Email
                <input
                  type="email"
                  placeholder="aarav@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Roll Number
                <input
                  type="number"
                  placeholder="23JECS001"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
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
