import React, { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Manage = () => {
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    fetch('https://book-site-express-server.vercel.app/all-books')
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  const handleDeleteBook = (bookId) => {
    fetch(`https://book-site-express-server.vercel.app/book/${bookId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        // Remove the deleted book from the state
        setAllBooks(allBooks.filter((book) => book._id !== bookId));
        alert('Book deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
      });
  };

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Manage Your Books</h2>

      {/* Table for displaying books */}
      <Table striped className='lg:w-[1180px]'>
        <Table.Head>
          <Table.HeadCell>No.</Table.HeadCell>
          <Table.HeadCell>Book Name</Table.HeadCell>
          <Table.HeadCell>Author Name</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit or Manage</span>
          </Table.HeadCell>
        </Table.Head>

        {allBooks.map((book, index) => (
          <Table.Body className='divide-y' key={book._id}>
            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                {book.bookTitle}
              </Table.Cell>
              <Table.Cell>{book.authorName}</Table.Cell>
              <Table.Cell>{book.category}</Table.Cell>
              <Table.Cell>$10</Table.Cell>
              <Table.Cell>
                <Link
                  className='font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5'
                  to={`/admin/dashboard/edit-book/${book._id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className='bg-red-600 px-4 py-1 font-semibold text-white rounded hover:bg-sky-600'
                >
                  Delete
                </button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </div>
  );
};

export default Manage;
