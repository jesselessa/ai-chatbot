import "./privacyPolicy.css";
import { Link } from "react-router-dom";

// Image
import bigLogo from "../../../src/assets/logo-big.png";

function PrivacyPolicy() {
  return (
    <section className="privacy-policy">
      {/* Logo */}
      <Link to="/">
        <img src={bigLogo} alt="logo" />
      </Link>

      <div className="privacy-content">
        <h1>Privacy Policy</h1>

        <ol>
          <li>
            <h2>Introduction</h2>
          </li>
          <p>
            We are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and protect your personal data in
            connection with the <Link to="/">ASK JESSBOT</Link> application.
          </p>

          <li>
            <h2>Data collection</h2>
          </li>
          <ul>
            <li>We do not directly collect personal data.</li>
            <li>
              The application uses Clerk{" "}
              <Link
                to="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                (https://clerk.com)
              </Link>{" "}
              for user account management. Clerk allows users to log in via
              email, as well as via Facebook and Google APIs. Please refer to
              Clerk's Privacy Policy for information on the data they collect
              and how they use it, as well as the Facebook and Google privacy
              policies if you use those log in methods.
            </li>
            <li>
              User chat conversations with the AI are stored in our MongoDB
              Cloud Atlas database.
            </li>
          </ul>

          <li>
            <h2>Use of Data</h2>
          </li>
          <ul>
            <li>
              Data collected by Clerk is used for the creation and management of
              your user account.
            </li>
            <li>
              Chat conversations are stored for the purpose of improving the
              app, and to allow the user to see prior conversations.
            </li>
            <li>
              Uploaded images are used to be displayed in the application.
            </li>
          </ul>

          <li>
            <h2>Data Sharing</h2>
          </li>
          <ul>
            <li>
              We do not share your personal data with third parties, except as
              necessary to provide the application services (e.g., with Clerk,
              ImageKit, and Google).
            </li>
            <li>
              The AI used to respond to users questions is Gemini, Google Gemini
              AI Model, therefore, the users questions must be shared with the
              Google API.
            </li>
          </ul>

          <li>
            <h2>Data Security</h2>
          </li>
          <ul>
            <li>
              We implement appropriate security measures to protect your
              personal data from unauthorized access, use, or disclosure.
            </li>
            <li>Data stored on our MongoDB Cloud Atlas database is secured.</li>
          </ul>

          <li>
            <h2>Your Rights</h2>
          </li>
          <ul>
            <li>
              You have the right to access, rectify, delete, and object to the
              processing of your personal data.
            </li>
            <li>To exercise these rights, contact Clerk directly.</li>
          </ul>

          <li>
            <h2>Modifications to Privacy Policy</h2>
          </li>
          <ul>
            <li>
              We reserve the right to modify this Privacy Policy at any time.
            </li>
            <li>
              Changes will be posted within the application and will be
              effective upon posting.
            </li>
          </ul>

          <li>
            <h2>Contact</h2>
          </li>
          <ul>
            <li>
              For any questions regarding this Privacy Policy, please contact us
              at <span>jessica.elessa@gmail.com</span>.
            </li>
          </ul>
        </ol>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
