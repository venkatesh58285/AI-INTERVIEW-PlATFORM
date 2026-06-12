import generateHRQuestion from "../../agents/hrAgent.js";

const hrNode = async (state) => {
  const previousQuestions = state.interactions.map((item) => item.question);

  const question = await generateHRQuestion(previousQuestions);

  return {
    ...state,
    question,
  };
};

export default hrNode;
