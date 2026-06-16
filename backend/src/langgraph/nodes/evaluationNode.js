import evaluateAnswer from "../../agents/evaluationAgent.js";

const evaluationNode = async (state) => {
  const evaluation = await evaluateAnswer(state.question, state.answer);

  // Update the interactions array with the user's answer and evaluation
  const updatedInteractions = [...state.interactions];
  if (updatedInteractions.length > 0) {
    const lastIdx = updatedInteractions.length - 1;
    updatedInteractions[lastIdx] = {
      ...updatedInteractions[lastIdx],
      answer: state.answer,
      evaluation,
    };
  }

  return {
    ...state,
    evaluation,
    interactions: updatedInteractions,
    questionCount: state.questionCount + 1,
  };
};

export default evaluationNode;
