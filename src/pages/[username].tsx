import { useRouter } from "next/router";
import Layout from "~/components/Layout";

const ProfilePage = () => {
  const { query } = useRouter();
  const { username } = query;
  return (
    <>
      <Layout>
        <div>{username}</div>
      </Layout>
    </>
  );
};

export default ProfilePage;
