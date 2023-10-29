import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: userData } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    const login = async () => {
      console.log("userData: ", userData);
      if (!userData) {
        await signIn(undefined, {
          callbackUrl: "/dashboard",
        });
      } else {
        push("/dashboard");
      }
    };

    login();
  }, [userData, push]);

  return <></>;
};

export default Home;
