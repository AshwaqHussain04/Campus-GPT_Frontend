import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Campus-GPT</h3>
          <p>Helpful academic assistance, campus guidance, and administrative support in one calm experience.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/chat">AI Chat</Link></li>
            <li><Link to="/student/login">Student login</Link></li>
            <li><Link to="/admin/login">Admin login</Link></li>
          </ul>
        </div>

        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
