import { NextPage } from "next";
import Head from "next/head";
import LoginButton from "../components/LoginButton";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bug tracker app</title>
        <meta name="description" content="A bug tracker built with NextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Homepage</h1>
        <div className="login">Log in or sign up</div>
        <LoginButton />
      </main>
    </>
  );
};

export default Home;
