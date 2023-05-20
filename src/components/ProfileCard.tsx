import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfileCard = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-1/2 mr-8 mt-8 flex flex-col items-center space-y-4 rounded-md border border-accent-6 bg-black p-6">
      <div className="relative h-20 w-20 overflow-hidden rounded-full">
        {session.user.image && (
          <Image src={session.user.image} alt="profile photo" fill={true} />
        )}
      </div>
      <div className="py-2 text-center">
        <h3 className="text-xl font-bold capitalize">{session.user.name}</h3>
        <small>
          @{session.user.username || session.user.email?.split("@")[0]}
        </small>
        <p className="mt-2 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="flex space-x-8 text-center">
        <div>
          <h3 className="text-xl font-bold">100k</h3>
          <p>Followers</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">219</h3>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
