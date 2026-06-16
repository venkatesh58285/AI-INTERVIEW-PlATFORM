import { Annotation } from "@langchain/langgraph";

export const InterviewState = Annotation.Root({
  userId: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  questionCount: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  interactions: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  question: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  answer: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  evaluation: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  completed: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  report: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});
