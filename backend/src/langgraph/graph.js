import resumeNode from "./nodes/resumeNode.js";

import hrNode from "./nodes/hrNode.js";

import reportNode from "./nodes/reportNode.js";

const runGraph = async (state) => {
  if (state.questionCount < 3) {
    return await resumeNode(state);
  }

  if (state.questionCount < 6) {
    return await hrNode(state);
  }

  return {
    ...state,

    completed: true,
  };
};

export default runGraph;
