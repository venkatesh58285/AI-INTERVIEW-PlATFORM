import generateResumeQuestion from "../../agents/resumeAgent.js";

const resumeNode = async (state) => {
  const previousQuestions = state.interactions.map((item) => item.question);

  const question = await generateResumeQuestion(
    state.userId,
    previousQuestions,
  );

  return {
    ...state,
    question,
  };
};

export default resumeNode;
