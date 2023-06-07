import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";

const ProfileCard = () => {
  const { data: session } = useSession();
  const { data } = api.user.getFollowAndFollowingCount.useQuery();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-1/2 mr-8 flex flex-col items-center space-y-4 rounded-md border border-accent-6 bg-black p-6">
      <div className="relative h-20 w-20 overflow-hidden rounded-full">
        {session.user.image && (
          <Image src={session.user.image} alt="profile photo" fill={true} />
        )}
      </div>
      <div className="py-2 text-center">
        <h3 className="text-xl font-bold capitalize">{session.user.name}</h3>
        <Link href={session.user.username} className="text-sm">
          @{session.user.username}
        </Link>
        <p className="mt-2 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="flex space-x-8 text-center">
        <div>
          <h3 className="text-xl font-bold">{data?._count.followedBy}</h3>
          <p>Followers</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">{data?._count.following}</h3>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
