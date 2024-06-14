class BookManager {
  constructor() {
    this.books = [];
  }

  addBook(title, author) {
    this.books.push({ title, author, rating: 0 });
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  searchBooks(query) {
    return this.books.filter(
      (book) => book.title.includes(query) || book.author.includes(query)
    );
  }

  rateBook(title, rating) {
    const book = this.books.find((book) => book.title === title);
    if (book) {
      if (rating < 0 || rating > 5)
        throw new Error("Rating must be between 0 and 5");
      book.rating = rating;
    } else {
      throw new Error("Book not found");
    }
  }

  getHighestRatedBook() {
    if (this.books.length === 0) return null;
    return this.books.reduce(
      (max, book) => (book.rating > max.rating ? book : max),
      { rating: -1 }
    );
  }

  listAllBooks() {
    return this.books;
  }

  findBooksByAuthor(author) {
    const booksByAuthor = this.books.filter((book) => book.author === author);
    if (booksByAuthor.length === 0) {
      console.log("No books found by this author");
      return [];
    }
    return booksByAuthor;
  }
}

module.exports = BookManager;
