import { IKContext, IKUpload } from "imagekitio-react";

//* Configure ImageKit authentication
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

// Get authentication info
const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`);

    // If not authenticated, we receive an error message
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // If authenticated, we get our token
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (err) {
    throw new Error(`Authentication request failed: ${err.message}`);
  }
};

const Upload = ({ setImg }) => {
  const onError = (err) => {
    console.error("Error during upload", err);
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      error: err.message,
    }));
  };

  const onSuccess = (res) => {
    console.log("Success", res); // IK uploaded image data
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      dbData: res,
    }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0]; // Upload only 1 file
    console.log("File:", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          // inlineData = GoogleGenerativeAI.Part object
          inlineData: {
            data: reader.result.split(",")[1], // Image code version
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    // IKContext defines authentication context
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      {/* IKUpload renders an input type="file" tag  */}
      <IKUpload
        id="prompt-form-file" // To match label tag
        fileName="ik_upload"
        useUniqueFileName={true}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
      />
      {
        <label htmlFor="prompt-form-file">
          <img
            className="attachment-btn"
            src="/attachment.png"
            alt="attachment"
          />
        </label>
      }
    </IKContext>
  );
};

export default Upload;
