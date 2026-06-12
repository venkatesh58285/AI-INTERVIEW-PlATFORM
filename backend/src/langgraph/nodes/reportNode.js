import generateReport from "../../agents/reportAgent.js";

const reportNode = async (state) => {
  const report = await generateReport(state.interactions);

  return {
    ...state,

    report,

    completed: true,
  };
};

export default reportNode;
