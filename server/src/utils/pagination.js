export const getHotelPagination = (query, maxLimit = 100) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
