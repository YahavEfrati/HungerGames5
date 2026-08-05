export const getEntityId = (entity) => entity?._id ?? null;

export const sameEntityId = (left, right) => String(left ?? '') === String(right ?? '');