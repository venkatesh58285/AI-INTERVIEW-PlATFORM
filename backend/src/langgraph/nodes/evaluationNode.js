import evaluateAnswer from "../../agents/evaluationAgent.js";

const evaluationNode = async (state) => {
  const evaluation = await evaluateAnswer(state.question, state.answer);

  return {
    ...state,

    evaluation,

    questionCount: state.questionCount + 1,
  };
};

export default evaluationNode;
