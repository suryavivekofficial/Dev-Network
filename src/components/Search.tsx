import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import LoadingSpinner from "./icons/LoadingSpinner";

const Search = () => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <form className="flex items-center">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue-3 dark:text-accent-8">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type="text"
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            id="simple-search"
            className="block w-full rounded-lg border border-blue-2 bg-white p-2.5 pl-10 text-sm text-blue-2 outline-none placeholder:text-blue-2 placeholder:opacity-70 focus:ring-1 focus:ring-blue-2 dark:border-accent-6 dark:bg-black dark:text-accent-8 dark:ring-accent-8 dark:placeholder:text-accent-6"
            placeholder="Search"
            required
          />
        </div>
        <button type="submit">
          <span className="sr-only">Search</span>
        </button>
      </form>
      {input.trim().length !== 0 && isFocused && (
        <SearchResults searchTerm={input} />
      )}
    </div>
  );
};

const SearchResults = ({ searchTerm }: { searchTerm: string }) => {
  const { data, isLoading } = api.search.searchUser.useQuery({
    searchTerm: searchTerm,
  });

  if (isLoading)
    return (
      <div className="absolute left-0 right-0 z-10 mt-2 origin-top-left rounded-md border border-blue-2 bg-blue-1 p-4 text-center dark:border-accent-6 dark:bg-accent-1">
        <LoadingSpinner />
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="absolute left-0 right-0 z-10 mt-2 origin-top-left rounded-md border border-blue-2 bg-blue-1 p-4 text-center dark:border-accent-6 dark:bg-accent-1">
        No results for this search!
      </div>
    );

  return (
    <div className="absolute left-0 right-0 z-10 mt-2 origin-top-left rounded-md border border-blue-2 bg-blue-1 dark:border-accent-6 dark:bg-accent-1">
      {data.map((user) => {
        if (!user.username) return null;
        if (!user.image) {
          user.image = "/user.png";
        }
        return (
          <Link
            href={`/${user.username}`}
            key={user.username}
            className="duration-200 hover:text-blue-2"
          >
            <div className="flex items-center space-x-2 p-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={user.image} fill={true} alt="Author photo" />
              </div>
              <span>{user.username}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Search;
