import { auth, provider } from "../../firebase-config";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import Cookies from "universal-cookie";
const cookies = new Cookies();

type Props = {
  setAuthenticated: React.Dispatch<React.SetStateAction<string | null>>;
};

const Auth = ({ setAuthenticated }: Props) => {
  const signInWithGoogle = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setAuthenticated(result.user.refreshToken);
      // console.log(result);
      // console.log(cookies.get("auth-token"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] w-full flex justify-center">
      <div className="flex flex-col space-y-4">
        <p className="text-lg font-bold text-blue">Sign in with Google</p>
        <button
          className="w-[10rem] border-2 rounded before:border-black flex gap-2 justify-center items-center p-1"
          onClick={signInWithGoogle}
        >
          <span>Sign in with</span>
          <FcGoogle className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Auth;
