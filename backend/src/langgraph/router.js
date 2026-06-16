const router = (state) => {
  if (state.questionCount < 3) {
    return "resume";
  } else if (state.questionCount < 6) {
    return "hr";
  } else {
    return "report";
  }
};

export default router;
