import { type NextPage } from "next";
import Layout from "~/components/Layout";
import Search from "~/components/Search";

const SearchPage: NextPage = () => {
  return (
    <Layout>
      <div className="mr-8 h-[calc(100vh-10rem)] w-full overflow-hidden rounded-md border-blue-2 bg-white p-4 dark:border-accent-6 dark:bg-black md:border md:p-8">
        <Search />
      </div>
    </Layout>
  );
};

export default SearchPage;
