import { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

//* Configure ImageKit for client-side upload
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`);

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
    // res = uploaded image data
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      dbData: res, // res.url = image URL
    }));
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        //! 'aiData' is an object that represents the image file in a format that the Gemini API can understand and use for multimodal generation
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1], // Extract base64 data from file
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
        fileName="jessbot"
        useUniqueFileName={true}
        onError={onError}
        onSuccess={onSuccess}
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
