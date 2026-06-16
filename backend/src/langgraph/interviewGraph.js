import { StateGraph, START, END } from "@langchain/langgraph";
import { InterviewState } from "./state/interviewState.js";
import evaluationNode from "./nodes/evaluationNode.js";
import resumeNode from "./nodes/resumeNode.js";
import hrNode from "./nodes/hrNode.js";
import router from "./router.js";

const workflow = new StateGraph(InterviewState)
  .addNode("evaluate", evaluationNode)
  .addNode("resume", resumeNode)
  .addNode("hr", hrNode)
  .addEdge(START, "evaluate")
  .addConditionalEdges("evaluate", router, {
    resume: "resume",
    hr: "hr",
    report: "__end__",
  })
  .addEdge("resume", END)
  .addEdge("hr", END);

const interviewGraph = workflow.compile();

export default interviewGraph;
