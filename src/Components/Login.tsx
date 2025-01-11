// this file handles the login for the app using firebase google sign-in
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../FireBaseConfig";
import tasks from "../assets/task.svg";
import { createGlobalStyle } from "styled-components";
import google_icon from "../assets/google.svg";
import { useUser } from "../hooks/useUser";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Urbanist', sans-serif;
  }
`;

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const userCredential = await signInWithGoogle();
    if (userCredential) {
      const userData = {
        displayName: userCredential.displayName,
        photoURL: userCredential.photoURL,
        uid: userCredential.uid,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // Set the user state

      console.log("userData", userData);
      navigate("/home", {
        state: {
          username: userCredential.displayName,
          profilePhoto: userCredential.photoURL,
          userId: userCredential.uid,
        },
      });
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="flex flex-col justify-center min-h-screen bg-pink-50 relative overflow-hidden">
        <div className="z-10 max-w-md mx-12">
          <h1 className="text-4xl font-bold text-purple-900 flex items-center mb-4">
            <span className="mr-2">
              <img src={tasks} alt="" />
            </span>
            TaskBuddy
          </h1>
          <p className="text-gray-600 mb-6">
            Streamline your workflow and track progress effortlessly with our
            all-in-one task management app.
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center px-6 py-3 w-80 border border-gray-300 rounded-xl shadow-sm bg-black font-black text-white hover:bg-gray-800"
          >
            <img src={google_icon} alt="Google Logo" className="w-5 h-5 mr-3" />
            Continue with Google
          </button>
        </div>

        {/* Right Circles */}
        <div className="hidden sm:inline-block">
          <div className="absolute -right-10 top-4 w-[1000px] h-[920px] rounded-full border border-gray-400"></div>
          <div className="absolute right-24 top-20 w-[700px] h-[720px] rounded-full border border-gray-400"></div>
          <div className="absolute right-52 top-56 w-[450px] h-[470px] rounded-full border border-gray-500"></div>
        </div>
        <div className="hidden max-sm:inline-block">
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-40 w-40 border border-purple-200 rounded-full"></div>
            <div className="h-32 w-32 border border-purple-300 rounded-full absolute top-4 left-4"></div>
            <div className="h-24 w-24 border border-purple-400 rounded-full absolute top-8 left-8"></div>
          </div>

          <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
            <div className="h-40 w-40 border border-purple-200 rounded-full"></div>
            <div className="h-32 w-32 border border-purple-300 rounded-full absolute top-4 left-4"></div>
            <div className="h-24 w-24 border border-purple-400 rounded-full absolute top-8 left-8"></div>
          </div>
        </div>
      </div>
    </>
  );
}
