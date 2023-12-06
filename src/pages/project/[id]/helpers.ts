const initialFilters = {
  status: {
    CLOSED: false,
    INPROGRESS: true,
    TESTING: true,
    TODO: true,
    UNASSIGNED: true,
  },
  priority: {
    CRITICAL: true,
    HIGH: true,
    MEDIUM: true,
    LOW: true,
  },
};

export { initialFilters }