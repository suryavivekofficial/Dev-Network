import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import Layout from "~/components/Layout";
import { prisma } from "~/server/db";
import type { User } from "@prisma/client";

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (
  ctx: GetServerSidePropsContext
) => {
  const username = ctx.params?.username as string;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

const ProfilePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(user);

  return (
    <>
      <Layout>
        <div>{user.name}</div>
      </Layout>
    </>
  );
};

export default ProfilePage;
