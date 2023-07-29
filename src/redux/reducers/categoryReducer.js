const initialState = {
    categories: [],
    loading: false,
    totalCategories: 0,
  };
  
  export const categoryReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case "CATEGORY_LOADING":
        return { ...state, loading: true };
      case "GET_CATEGORIES":
        return {
          loading: false,
          categories: payload.data.map((category) => ({
            ...category,
            key: category._id,
          })),
          totalCategories: payload.pagination.total,
        };
    }
    return state;
  };
  