import { NextPage } from "next";
import Head from "next/head";
import LoginButton from "../components/LoginButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Dashboard from "./dashboard";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Bug tracker app</title>
        <meta name="description" content="A bug tracker built with NextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{sessionData ? <Dashboard /> : <LoginButton />}</main>
    </>
  );
};

export default Home;
