const BookManager = require("./bookManager");
const manager = new BookManager();

beforeEach(() => {
  manager.books = [];
});

// Model-Based Testing (MDTD)
describe("Book Manager Model-Based Testing", () => {
  test("addBook model", () => {
    manager.addBook("Dunia Sophie", "Jostein Gaarder");
    manager.addBook("Hujan", "Tere Liye");
    expect(manager.books.length).toBe(2);
    expect(manager.books[0]).toEqual({
      title: "Dunia Sophie",
      author: "Jostein Gaarder",
      rating: 0,
    });
    expect(manager.books[1]).toEqual({
      title: "Hujan",
      author: "Tere Liye",
      rating: 0,
    });
  });

  test("removeBook model", () => {
    manager.addBook("Hujan", "Tere Liye");
    manager.removeBook("Hujan");
    expect(manager.books.length).toBe(0);
  });

  test("removeBook non-existent", () => {
    manager.addBook("Dunia Sophie", "Jostein Gaarder");
    manager.removeBook("Hujan");
    expect(manager.books.length).toBe(1);
  });
});

// Test-Driven Development (TDD)
describe("Book Manager Test-Driven Development", () => {
  test("searchBooks", () => {
    manager.addBook("Dunia Sophie", "Jostein Gaarder");
    manager.addBook("Hujan", "Tere Liye");
    let result = manager.searchBooks("Hujan");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Hujan");

    result = manager.searchBooks("Tere");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Hujan");

    result = manager.searchBooks("Sophie");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Dunia Sophie");
  });

  test("rateBook", () => {
    manager.addBook("Hujan", "Tere Liye");
    manager.rateBook("Hujan", 4);
    expect(manager.books[0].rating).toBe(4);

    expect(() => manager.rateBook("Hujan", 6)).toThrow(
      "Rating must be between 0 and 5"
    );
    expect(() => manager.rateBook("Hujan", -1)).toThrow(
      "Rating must be between 0 and 5"
    );
  });

  test("rateBook non-existent", () => {
    expect(() => manager.rateBook("Non Existent", 3)).toThrow("Book not found");
  });

  test("getHighestRatedBook", () => {
    expect(manager.getHighestRatedBook()).toBe(null);

    manager.addBook("Dunia Sophie", "Jostein Gaarder");
    manager.addBook("Hujan", "Tere Liye");
    manager.rateBook("Dunia Sophie", 4);
    manager.rateBook("Hujan", 5);

    const highestRated = manager.getHighestRatedBook();
    expect(highestRated.title).toBe("Hujan");
    expect(highestRated.rating).toBe(5);
  });
});

// Data-Driven Testing (DDT)
describe("Book Manager Data-Driven Testing", () => {
  const books = [
    { title: "Dunia Sophie", author: "Jostein Gaarder" },
    { title: "Hujan", author: "Tere Liye" },
  ];

  test.each(books)("addBook(%s, %s)", ({ title, author }) => {
    manager.addBook(title, author);
    const book = manager.books.find((book) => book.title === title);
    expect(book).toBeDefined();
    expect(book.title).toBe(title);
    expect(book.author).toBe(author);
  });

  test.each([
    ["Dunia Sophie", "Jostein Gaarder"],
    ["Hujan", "Tere Liye"],
  ])("removeBook(%s)", (title) => {
    manager.addBook(title, "Unknown");
    manager.removeBook(title);
    const book = manager.books.find((book) => book.title === title);
    expect(book).toBeUndefined();
  });

  const rateCases = [
    { title: "Dunia Sophie", rating: 5, expected: 5 },
    { title: "Hujan", rating: 4, expected: 4 },
  ];

  rateCases.forEach(({ title, rating, expected }) => {
    test(`rateBook(${title}, ${rating})`, () => {
      manager.addBook(title, "Unknown");
      manager.rateBook(title, rating);
      const book = manager.books.find((book) => book.title === title);
      expect(book.rating).toBe(expected);
    });
  });
});

// Test Automation Concept
describe("Book Manager Test Automation Concept", () => {
  const dataPoints = [
    {
      method: "addBook",
      params: ["Dunia Sophie", "Jostein Gaarder"],
      expected: [
        { title: "Dunia Sophie", author: "Jostein Gaarder", rating: 0 },
      ],
    },
    {
      method: "addBook",
      params: ["Hujan", "Tere Liye"],
      expected: [{ title: "Hujan", author: "Tere Liye", rating: 0 }],
    },
    {
      method: "removeBook",
      params: ["Dunia Sophie"],
      setup: () => manager.addBook("Dunia Sophie", "Jostein Gaarder"),
      expected: [],
    },
    {
      method: "searchBooks",
      params: ["Hujan"],
      setup: () => manager.addBook("Hujan", "Tere Liye"),
      expected: [{ title: "Hujan", author: "Tere Liye", rating: 0 }],
    },
    {
      method: "rateBook",
      params: ["Hujan", 5],
      setup: () => manager.addBook("Hujan", "Tere Liye"),
      expected: [{ title: "Hujan", author: "Tere Liye", rating: 5 }],
    },
    {
      method: "getHighestRatedBook",
      params: [],
      setup: () => {
        manager.addBook("Hujan", "Tere Liye");
        manager.rateBook("Hujan", 5);
      },
      expected: { title: "Hujan", author: "Tere Liye", rating: 5 },
    },
  ];

  dataPoints.forEach(({ method, params, setup, expected }) => {
    test(`${method}(${params}) should return ${JSON.stringify(
      expected
    )}`, () => {
      manager.books = [];
      if (setup) setup();
      const result =
        method === "getHighestRatedBook"
          ? manager[method](...params)
          : (manager[method](...params), manager.books);
      expect(result).toEqual(expected);
    });
  });
});
