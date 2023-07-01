import { useRouter } from "next/router";
import FollowingListCard from "~/components/FollowingListCard";
import Layout from "~/components/Layout";
import PostComponent from "~/components/Post";
import ProfileCard from "~/components/ProfileCard";
import LoadingSpinner from "~/components/icons/LoadingSpinner";
import { api } from "~/utils/api";

const PostPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  return (
    <Layout>
      <>
        <Post postId={postId} />
        <div className="hidden min-h-screen w-1/3 flex-shrink-0 space-y-8 md:block">
          <ProfileCard />
          <FollowingListCard />
        </div>
      </>
    </Layout>
  );
};

const Post = ({ postId }: { postId: string }) => {
  const { data, isLoading } = api.post.getSinglePost.useQuery({ postId });

  if (isLoading)
    return (
      <div className="mt-8 flex h-screen w-full items-start justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data) {
    return (
      <div className="h-screen w-full">
        <div className="flex h-36 items-center justify-center rounded-md border-blue-2 bg-white dark:border-accent-6 dark:bg-black md:border">
          This post does not exist!
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="rounded-md border-blue-2 dark:border-accent-6 md:border">
        <PostComponent post={data} isCommentSectionOpenByDefault={true} />
      </div>
    </div>
  );
};

export default PostPage;
