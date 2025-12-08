export const db: any = jest.fn((table?: string) => db);

db.insert = jest.fn();
db.leftJoin = jest.fn(() => db);
db.select = jest.fn(() => db);
db.where = jest.fn(() => db);
db.orderBy = jest.fn(() => Promise.resolve([]));


