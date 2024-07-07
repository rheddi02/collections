import { ReloadIcon } from "@radix-ui/react-icons";

const PageLoader = () => {
  return (
    <div className="-m-2 flex h-screen items-center justify-center bg-gray-600/opacity-50">
      <div className="relative">
        <div className="center-fixed sm:h-64 h-32 sm:w-64 w-32 animate-pulse rounded-full bg-stone-500">
          {" "}
        </div>
        <div className="center-fixed flex sm:h-60 h-28 sm:w-60 w-28 flex-col items-center justify-center gap-2 rounded-full bg-white p-10">
          <ReloadIcon className="animate-spin" />
          Fetching data ...
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
