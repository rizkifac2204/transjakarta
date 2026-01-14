export const SkeletonList = ({ items, count }) => {
  items = items || Array.from({ length: count });
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {items.map((item, i) => (
        <div className="p-4 w-full mx-auto" key={i}>
          <div className="animate-pulse flex items-center space-x-4">
            <div className="flex-none flex space-x-2 items-center">
              <div className="rounded h-5 w-5 bg-[#C4C4C4] dark:bg-slate-500"></div>
              <div className="rounded h-5 w-5 bg-[#C4C4C4] dark:bg-slate-500"></div>
            </div>
            <div className="flex-1 h-5 bg-[#C4C4C4] dark:bg-slate-500"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Skeleton = ({ className }) => {
  return (
    <div className="divide-slate-100 dark:divide-slate-700">
      <div className="p-4 w-full mx-auto">
        <div className="animate-pulse items-center">
          <div
            className={`${
              className ? className : "h-40"
            } bg-[#C4C4C4] dark:bg-slate-500`}
          ></div>
        </div>
      </div>
    </div>
  );
};
