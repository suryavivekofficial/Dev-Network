import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import Layout from "~/components/Layout";
import { prisma } from "~/server/db";
import type { User } from "@prisma/client";
import ProfileCard from "~/components/ProfileCard";
import FollowingListCard from "~/components/FollowingListCard";
import Image from "next/image";
import { api } from "~/utils/api";
import PostComponent from "~/components/Post";
import { getSession } from "next-auth/react";
import { type FC } from "react";

export const getServerSideProps: GetServerSideProps<{
  user: User;
  isFollowed: boolean | "own";
}> = async (ctx: GetServerSidePropsContext) => {
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

  const session = await getSession(ctx);

  if (!session) {
    return {
      props: {
        user,
        isFollowed: false,
      },
    };
  }

  if (session.user.username === user.username) {
    return {
      props: {
        user,
        isFollowed: "own",
      },
    };
  }

  const follow = await prisma.follows.findUnique({
    where: {
      followerUsername_followingUsername: {
        followerUsername: session.user.username,
        followingUsername: user.username,
      },
    },
  });

  console.log({ follow });

  if (!follow) {
    console.log("returning false due to null");
    return {
      props: {
        user,
        isFollowed: false,
      },
    };
  }
  console.log("returning true due to follow");

  return {
    props: {
      user,
      isFollowed: true,
    },
  };
};

const ProfilePage = ({
  user,
  isFollowed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <>
        <div className="flex-grow rounded-md border border-accent-6 bg-black">
          <div className="relative h-36 w-full rounded-t-md bg-accent-2">
            <div className="absolute left-8 top-full -translate-y-1/2 rounded-full bg-black p-1">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-none bg-blue-2 outline-none">
                {user.image && (
                  <Image src={user?.image} fill={true} alt="Profile picture" />
                )}
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 pt-16">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold capitalize">{user.name}</h2>
                <p className="text-sm">@{user.username}</p>
              </div>
              <FollowBtn isFollowed={isFollowed} />
            </div>
            <p className="py-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, nihil?
            </p>
            <div className="space-x-4">
              <span>100k Followers</span>
              <span>219 Following</span>
            </div>
          </div>

          <UserPosts user={user} />
        </div>

        <div className="w-1/3 space-y-8">
          <ProfileCard />
          <FollowingListCard />
        </div>
      </>
    </Layout>
  );
};

type FollowBtnProps = {
  isFollowed: boolean | "own";
};

const FollowBtn: FC<FollowBtnProps> = ({ isFollowed }) => {
  if (isFollowed === "own") {
    return (
      <button className="rounded-md bg-accent-8 px-4 py-2 font-bold text-accent-2 hover:brightness-75">
        Edit profile
      </button>
    );
  }

  return (
    <button className="rounded-md bg-accent-8 px-4 py-2 font-bold text-accent-2 hover:brightness-75">
      {isFollowed ? "unfollow" : "follow"}
    </button>
  );
};

const UserPosts = ({ user }: { user: User }) => {
  if (!user.username) return null;

  const { data, isLoading, isError, error } = api.post.getPostsByUser.useQuery({
    username: user.username,
  });

  const postsWithUserDetails = data?.map((post) => ({
    ...post,
    author: {
      username: user.username,
      image: user.image,
      name: user.name,
    },
  }));
  console.log(postsWithUserDetails);
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (postsWithUserDetails?.length === 0) {
    return <div>no posts to show</div>;
  }

  return (
    <div>
      {postsWithUserDetails &&
        postsWithUserDetails.map((post) => {
          return (
            <div key={post.id} className="border-t border-accent-6">
              <PostComponent post={post} />
            </div>
          );
        })}
    </div>
  );
};

export default ProfilePage;
