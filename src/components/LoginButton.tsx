import { useSession, signIn, signOut } from "next-auth/react";

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full px-10 py-3 font-semibold transition"
        onClick={sessionData ? () => void signOut() : () => void handleSignIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default LoginButton;

const handleSignIn = async () => {
  const result = await signIn("credentials", {
    id: "123", // set the userId property here
  });

  console.log("test result: ", result);
};
