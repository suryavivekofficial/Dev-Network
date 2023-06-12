import { toast } from "react-hot-toast";

const Share = () => {
  const handleClick = () => {
    navigator.clipboard
      .writeText("some link into clipboard")
      .then(() => toast("link copied to clipboard"))
      .catch(() => toast("Failed to copy to clipboard"));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 rounded-md px-4 py-2 duration-300 hover:bg-accent-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
        />
      </svg>
      <span className="text-sm">Share</span>
      {/* {copied && toast("Link copied to clipboard.")} */}
    </button>
  );
};

export default Share;
