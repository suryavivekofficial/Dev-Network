import { signIn } from "next-auth/react";
import Image from "next/image";

const SignIn = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h4>Sign in with</h4>
      <button
        onClick={() => void signIn("google")}
        className="flex space-x-4 rounded-md border border-accent-4 p-4 text-right hover:brightness-150"
      >
        <Image
          alt="google"
          loading="lazy"
          height="20"
          width="20"
          src="https://authjs.dev/img/providers/google.svg"
        />
        <span>Google</span>
      </button>
      <button
        onClick={() => void signIn("discord")}
        className="flex space-x-4 rounded-md border border-accent-4 p-4 text-right hover:brightness-150"
      >
        <Image
          alt="google"
          loading="lazy"
          height="20"
          width="20"
          src="https://authjs.dev/img/providers/discord.svg"
        />
        <span>Discord</span>
      </button>
    </div>
  );
};

export default SignIn;
