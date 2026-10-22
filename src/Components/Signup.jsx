import { useState } from "react";
import Button from "./Button";

const SignupPage = () => {
  const [activeRole, setActiveRole] = useState("student");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [student_password, set_Student_Password] = useState("");
  const [student_name, set_Student_Name] = useState("");
  const [student_email, set_Student_Email] = useState("");
  const [student_regNo, set_Student_regNo] = useState("");

  const strength =
    password.length > 10 ? "Strong" : password.length > 6 ? "Medium" : "Weak";

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <div className="auth-role-switch">
          <button
            className={
              activeRole === "student" ? "role-card active" : "role-card"
            }
            onClick={() => setActiveRole("student")}
          >
            <strong>Student Signup</strong>
            <span>New student account</span>
          </button>
          <button
            className={
              activeRole === "faculty" ? "role-card active" : "role-card"
            }
            onClick={() => setActiveRole("faculty")}
          >
            <strong>Faculty Signup</strong>
            <span>Professional profile</span>
          </button>
        </div>

        <form className="auth-form">
          {activeRole === "student" ? (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  value={student_name}
                  onChange={(e) => set_Student_Name(e.target.value)}
                />
              </label>
              <label>
                College Email
                <input
                  type="email"
                  placeholder="aarav@college.edu"
                  value={student_email}
                  onChange={(e) => set_Student_Email(e.target.value)}
                />
              </label>
              <label>
                Roll Number
                <input
                  type="text"
                  placeholder="CS2024001"
                  value={student_regNo}
                  onChange={(e) => set_Student_regNo(e.target.value)}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Dr. Meera Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                College Email
                <input
                  type="text"
                  placeholder="meera@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </>
          )}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) =>
                activeRole === "student"
                  ? set_Student_Password(e.target.value)
                  : setPassword(e.target.value)
              }
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
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
