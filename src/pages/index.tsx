import type { NextPage } from "next";

import Head from "next/head";
import Feed from "~/components/Feed";
import FollowingListCard from "~/components/FollowingListCard";
import Layout from "~/components/Layout";
import ProfileCard from "~/components/ProfileCard";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dev Network</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <>
          <Feed />
          <div className="w-1/3 flex-shrink-0 space-y-8">
            <ProfileCard />
            <FollowingListCard />
          </div>
        </>
      </Layout>
    </>
  );
};

export default Home;
