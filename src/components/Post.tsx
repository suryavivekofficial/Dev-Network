import type { Comment, Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
import Clock from "./icons/ClockIcon";
import CommentIcon from "./icons/CommentIcon";
import LikeIcon from "./icons/LikeIcon";
import LoadingSpinner from "./icons/LoadingSpinner";
import SendIcon from "./icons/SendIcon";
import ShareIcon from "./icons/ShareIcon";

dayjs.extend(relativeTime);

type TPostComponent = {
  post: Post & {
    _count: {
      likes: number;
    };
    likes: {
      userId: string;
    }[];
    author: {
      username: string | null;
      name: string | null;
      image: string | null;
    };
  };
};

const PostComponent: FC<TPostComponent> = ({ post }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  if (!post.author.username) return null;

  if (!post.author.image) {
    post.author.image = "/user.png";
  }

  return (
    <div className="space-y-4 rounded-md bg-white p-6 dark:bg-black">
      <div className="flex items-center justify-between">
        <Link
          href={`/${post.author.username}`}
          className="flex items-center space-x-4"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src={post.author.image} fill={true} alt="Author photo" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold capitalize">{post.author.name}</span>
            <span className="text-sm hover:text-blue-2">
              @{post.author.username}
            </span>
          </div>
        </Link>
        <span className="flex items-center space-x-2 text-sm opacity-80">
          <Clock size={4} />
          <span className="whitespace-nowrap text-xs font-thin">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </span>
      </div>
      <p className="text-sm md:text-base">{post.content}</p>
      <div className="flex items-center justify-between">
        <LikeIcon
          isLikedFromServer={post.likes.length === 0 ? false : true}
          postId={post.id}
          likeCountFromServer={post._count.likes}
        />
        <CommentIcon
          isCommentSectionOpen={isCommentSectionOpen}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
        />
        <ShareIcon />
      </div>
      {isCommentSectionOpen && <CommentSection postId={post.id} />}
    </div>
  );
};

const CommentSection = ({ postId }: { postId: string }) => {
  const { data, isLoading } = api.post.getCommentsForPost.useQuery({ postId });

  if (isLoading)
    return (
      <div className="flex h-16 w-full items-center justify-center border-t border-accent-4">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="w-full space-y-4 border-t border-blue-1 pt-4 dark:border-accent-4">
      <CommentInput postId={postId} />

      <div className="space-y-2">
        {data?.map((comment) => (
          <div
            className="rounded-md odd:bg-blue-1 dark:odd:bg-accent-1"
            key={comment.id}
          >
            <CommentItem comment={comment} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex justify-between space-x-2 p-4">
      <div className="flex">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image src={comment.commentorImage} fill={true} alt="Author photo" />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2 py-2">
          <Link
            href={`/${comment.commentorUsername}`}
            className="hover:text-blue-2"
          >
            <h6 className="text-xs">{comment.commentorUsername}</h6>
          </Link>
          <span className="h-1 w-1 rounded-full bg-black dark:bg-white" />
          <span className="text-xs">
            {dayjs(comment.commentedAt).fromNow()}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

const CommentInput = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading } = api.post.createComment.useMutation({
    onSuccess: async () => {
      await ctx.post.getCommentsForPost.invalidate();
    },
  });

  const handleSubmit = () => {
    mutate({ comment: newComment, postId });
    setNewComment("");
  };

  if (!session) return <div>You need to login to comment on a post.</div>;

  if (!session.user.image) {
    session.user.image = "/user.png";
  }

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full md:h-10 md:w-10">
        <Image src={session.user.image} fill={true} alt="Author photo" />
      </div>
      <input
        type="text"
        value={newComment}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="What's your thoughts on this?"
        className="flex-grow rounded-md border border-blue-2 bg-white px-2 outline-none placeholder:text-xs placeholder:text-blue-2 focus:ring-1 focus:ring-blue-2 dark:border-accent-6 dark:bg-black dark:text-accent-8 dark:placeholder:text-white dark:placeholder:text-opacity-50 dark:focus:ring-accent-8 md:px-4 md:placeholder:text-sm"
      />
      <button
        onClick={handleSubmit}
        className="group rounded-md border border-blue-2 bg-white px-2 text-blue-2 dark:border-accent-6 dark:bg-accent-2 dark:text-accent-8"
      >
        {isLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <SendIcon />
        )}
      </button>
    </div>
  );
};

export default PostComponent;
