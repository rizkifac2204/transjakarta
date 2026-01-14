function TablePagination({ table }) {
  const { getPageCount, setPageIndex, getState } = table;

  const pageCount = getPageCount();
  const pageIndex = getState().pagination.pageIndex;

  const maxPageButtons = 5;
  const startPage = Math.max(
    0,
    Math.min(
      pageIndex - Math.floor(maxPageButtons / 2),
      pageCount - maxPageButtons
    )
  );
  const endPage = Math.min(startPage + maxPageButtons, pageCount);
  const visiblePages = [...Array(endPage - startPage).keys()].map(
    (i) => i + startPage
  );

  return (
    <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="flex space-x-2 rtl:space-x-reverse items-center">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Go
          </span>
          <span>
            <input
              type="number"
              className="form-control py-1 px-2 w-12 text-xs"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                setPageIndex(pageNumber);
              }}
            />
          </span>
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Page{" "}
          <span>
            {pageIndex + 1} of {pageCount}
          </span>
        </span>
      </div>

      <ul className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap">
        {startPage > 0 && (
          <>
            <li>
              <button
                className="text-sm px-2 py-1 rounded"
                onClick={() => table.setPageIndex(0)}
              >
                1
              </button>
            </li>
            <li className="select-none">...</li>
          </>
        )}

        {/* tombol halaman visible */}
        {visiblePages.map((pageIdx) => (
          <li key={pageIdx}>
            <button
              className={`${
                pageIdx === pageIndex
                  ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium"
                  : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"
              } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
              onClick={() => table.setPageIndex(pageIdx)}
            >
              {pageIdx + 1}
            </button>
          </li>
        ))}

        {/* tombol last page */}
        {endPage < pageCount && (
          <>
            <li className="select-none">...</li>
            <li>
              <button
                className="text-sm px-2 py-1 rounded"
                onClick={() => table.setPageIndex(pageCount - 1)}
              >
                {pageCount}
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default TablePagination;
