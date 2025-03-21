import "./termsOfService.css";
import { Link } from "react-router-dom";

// Image
import bigLogo from "../../../src/assets/logo-big.png";

function TermsOfService() {
  return (
    <section className="terms-of-service">
      {/* Logo */}
      <Link to="/">
        <img src={bigLogo} alt="logo" />
      </Link>

      <div className="terms-content">
        <h1>Terms Of Service</h1>

        <ol>
          <li>
            <h2>Introduction</h2>
          </li>
          <p>
            Welcome to <Link to="/">ASK JESSBOT</Link>, an AI-powered chatbot
            application using Google Gemini AI Model. By using this application,
            you agree to comply with and be bound by these Terms of Service.
          </p>

          <li>
            <h2>Use of the Application</h2>
          </li>
          <ul>
            <li>
              You agree to use <Link to="/">ASK JESSBOT</Link> in accordance
              with all applicable laws and regulations, including GDPR.
            </li>
            <li>
              You agree not to use the application for any illegal, harmful, or
              fraudulent purposes.
            </li>
            <li>
              You are responsible for the accuracy and relevance of the
              information you provide to the application.
            </li>
            <li>
              You understand that the responses provided by the AI are
              automatically generated and may not always be accurate or
              appropriate.
            </li>
            <li>
              You agree that your chat conversations will be stored on a MongoDB
              Cloud Atlas database.
            </li>
            <li>
              You understand that by uploading images, those images will be
              stored by ImageKit.
            </li>
          </ul>

          <li>
            <h2>Data and Image Storage</h2>
          </li>
          <ul>
            <li>
              User account data is stored and managed by Clerk{" "}
              <Link
                to="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                (https://clerk.com)
              </Link>
              . Please refer to their Privacy Policy for more information.
            </li>
            <li>
              Uploaded images are stored and managed by ImageKit{" "}
              <Link
                to="https://imagekit.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                (https://imagekit.io)
              </Link>
              . Please refer to their privacy policy for more information.
            </li>
          </ul>

          <li>
            <h2>Intellectual Property</h2>
          </li>
          <ul>
            <li>
              Content generated by the AI, based on your interactions, may be
              considered a collaborative work.
            </li>
            <li>
              You retain rights to the information you provide to the
              application.
            </li>
            <li>
              You grant the application a non-exclusive license to use and
              display the generated content within the context of providing the
              services.
            </li>
            <li>
              Please be aware that AI generated content ownership is a legal
              grey area, and laws can change.
            </li>
          </ul>

          <li>
            <h2>Limitation of Liability</h2>
          </li>
          <ul>
            <li>
              The application is provided "as is" and without warranties of any
              kind.
            </li>
            <li>
              You agree that your use of the application is at your own risk.
            </li>
            <li>
              We shall not be liable for any direct, indirect, consequential, or
              incidental damages arising from your use of the application.
            </li>
          </ul>

          <li>
            <h2>Termination</h2>
          </li>
          <ul>
            <li>
              We reserve the right to suspend or terminate your account for any
              violation of these Terms of Service.
            </li>
          </ul>

          <li>
            <h2>Governing Law and Dispute Resolution</h2>
          </li>
          <ul>
            <li>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of France.
            </li>
            <li>
              Any disputes relating to the interpretation or enforcement of
              these Terms shall be subject to the exclusive jurisdiction of the
              French courts.
            </li>
          </ul>

          <li>
            <h2>Modifications to Terms of Service</h2>
          </li>
          <ul>
            <li>
              We reserve the right to modify these Terms of Service at any time.
            </li>
            <li>
              Changes will be posted within the application and will be
              effective upon posting.
            </li>
          </ul>

          <li>
            <h2>Connection via third party.</h2>
          </li>
          <ul>
            <li>
              The application allows users to log in via third party services
              such as Facebook and Google, via Clerk.
            </li>
            <li>
              By using these login options, you agree to the Terms of service
              and privacy policies of these third party services.
            </li>
            <li>
              We are not responsible for the privacy practices or content of
              these third party services.
            </li>
          </ul>
        </ol>
      </div>
    </section>
  );
}

export default TermsOfService;
