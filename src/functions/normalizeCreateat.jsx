export const normalizeCreatedAt = (createdAt) => {
  if (createdAt?.toDate) {
    return createdAt.toDate().toISOString();
  }
  if (createdAt instanceof Date) {
    return createdAt.toISOString();
  }
  return createdAt || null;
};
