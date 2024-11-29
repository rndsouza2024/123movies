import Link from 'next/link';

const Pagination = ({ currentPage, totalPages, route }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <div className="pagination">
        <Link href={`/${route}`} passHref>
          <div className={`text-black text-xl mt-2 badge bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 rounded-md ${currentPage === 1 ? 'active' : ''}`}>
           Home
          </div>
        </Link>
        {pages.map((page) => (
          <Link key={page} href={`/${route}/page${page}`} passHref>
            <div className={`text-black text-xl mt-2 badge bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 rounded-md ${page === currentPage ? 'active' : ''}`}>
              Page {page}
            </div>
          </Link>
        ))}
      </div>
      <style jsx>{`
       .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }
        .pagination {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .pagination-button {
          text-decoration: none;
          color: black;
          font-size: 16px;
          padding: 10px 20px;
          border-radius: 5px;
          background: linear-gradient(to right, #ff0077, #ff4d4d);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .pagination-button.active {
          background: linear-gradient(to right, #ff4d4d, #ff0077);
          color: white;
        }

        @media screen and (max-width: 768px) {
          .pagination {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;

