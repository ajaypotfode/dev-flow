import Link from "next/link";

interface PaginationProps {
    page: number;
    totalPages: number;
    // nextLink: string;
    // prevLink: string;
    pageLink: (pageNum: number) => string;
}

const Pagination = ({ page, totalPages, pageLink }: PaginationProps) => {

    return (

        <div className="flex items-center gap-5 mt-8">
            {page > 1 ? (

                <Link
                    href={`${pageLink(page - 1)}`}
                    className="text-lg hover:text-blue-500"
                >
                    Prev
                </Link>
            ) : (
                <span className="text-lg opacity-30">Prev</span>
            )}

            <span className="text-gray-400">
                Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
                <Link
                    href={`${pageLink(page + 1)}`}
                    className="text-lg hover:text-blue-500"
                >
                    Next
                </Link>
            ) : (
                <span className="text-lg opacity-30">Next</span>
            )}
        </div>
    )
}

export default Pagination