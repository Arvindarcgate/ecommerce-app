export const db: any = jest.fn((table?: string) => db);

// For insert
db.insert = jest.fn().mockResolvedValue([1]); // resolves to [orderId]

// For query chaining
db.leftJoin = jest.fn(() => db);
db.select = jest.fn(() => db);
db.where = jest.fn(() => db);
db.orderBy = jest.fn(() => Promise.resolve([])); // resolves to empty array by default

// Optional: helper to reset mocks
export const resetDbMocks = () => {
  db.insert.mockClear();
  db.leftJoin.mockClear();
  db.select.mockClear();
  db.where.mockClear();
  db.orderBy.mockClear();
};
