import getGroqModel from "../services/ai/groqModel.js";

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return cleaned.trim();
};

const generateDSAQuestion = async (previousQuestions = []) => {
  const prompt = `
You are a DSA (Data Structures & Algorithms) interview coach.

Previously Asked Problems:
${previousQuestions.join("\n")}

Generate ONE NEW coding problem for interview practice.

Pick from real common interview topics: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Binary Search, Stack/Queue, Recursion, Sorting, Hashing, Two Pointers, Sliding Window, Greedy.

Return ONLY valid JSON with no extra text, no markdown fences:

{
  "title": "Problem Title",
  "difficulty": "Easy or Medium or Hard",
  "topics": ["topic1", "topic2"],
  "description": "Clear problem statement with input/output examples",
  "leetcodeUrl": "https://leetcode.com/problems/similar-problem-slug/",
  "codeforcesUrl": "https://codeforces.com/problemset/problem/NUMBER/LETTER"
}

Make sure the URLs point to real, well-known problems that match the topic. Use actual LeetCode problem slugs like "two-sum", "best-time-to-buy-and-sell-stock", "merge-intervals", etc.
`;

  const groqModel = getGroqModel();
  const response = await groqModel.invoke(prompt);

  try {
    const parsed = JSON.parse(cleanJsonResponse(response.content));
    return parsed;
  } catch {
    return {
      title: "Two Sum",
      difficulty: "Easy",
      topics: ["arrays", "hashing"],
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
      leetcodeUrl: "https://leetcode.com/problems/two-sum/",
      codeforcesUrl: "https://codeforces.com/problemset/problem/1/A",
    };
  }
};

export default generateDSAQuestion;
