import type { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import Clock from "./icons/ClockIcon";
import CommentIcon from "./icons/CommentIcon";
import LikeIcon from "./icons/LikeIcon";
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
  if (!post.author.username) return null;

  if (!post.author.image) {
    post.author.image = "/user.png";
  }

  return (
    <div className="space-y-4 rounded-md bg-black p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src={post.author.image} fill={true} alt="Author photo" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold capitalize">{post.author.name}</span>
            <Link href={`/${post.author.username}`} className="text-sm">
              @{post.author.username}
            </Link>
          </div>
        </div>
        <span className="flex items-center space-x-2 text-sm opacity-80">
          <Clock size={4} />
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </span>
      </div>
      <p>{post.content}</p>
      <div className="flex items-center justify-between">
        <LikeIcon
          isLikedFromServer={post.likes.length === 0 ? false : true}
          postId={post.id}
          likeCountFromServer={post._count.likes}
        />
        <CommentIcon />
        <ShareIcon />
      </div>
    </div>
  );
};

export default PostComponent;
