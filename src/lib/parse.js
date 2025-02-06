/**
 * Category object.
 * @typedef {Object} Category
 * @property {string} title Title of the category.
 * @property {string} file Filename of the data.
 */

/**
 * Answer object in a question.
 * @typedef {Object} Answer
 * @property {string} text Text of the answer.
 * @property {boolean} correct True if correct answer.
 */

/**
 * Question object with array of answers.
 * @typedef {Object} Question
 * @property {string} text Text of the question.
 * @property {Answer[]} answers Array of answers to the question.
 */

/**
 * Questionnaire object.
 * @typedef {Object} Questionnaire
 * @property {string} title Team name.
 * @property {Question[]} questions Link to json file.
 */

/**
 * Parse answer data. Skips illegal data.
 * @param {unknown} data Potential answer data.
 * @returns {Answer | null} Answer object.
 */
export function parseAnswer(data) {
  if (typeof data !== "object" || !data) {
    console.warn("illegal team object", data);
    return null;
  }

  if (!("answer" in data) || typeof data.name !== "string") {
    console.warn("illegal answer data", data);
    return null;
  }

  if (!("correct" in data) || typeof data.correct !== "boolean") {
    console.warn("illegal correctness data", data);
    return null;
  }

  return {
    text: data.answer,
    correct: data.correct,
  };
}

/**
 * Parse question data. Skips illegal data.
 * @param {Array<unknown>} data Potential question data.
 * @returns {Question | null} Question object.
 */
export function parseQuestions(data) {
  if (typeof data !== "object" || !data) {
    console.warn("Illegal question object:", data);
    return null;
  }

  if (typeof data.question !== "string") {
    console.warn("Illegal question text:", data);
    return null;
  }

  if (!Array.isArray(data.answers)) {
    console.warn("Illegal answers array:", data);
    return null;
  }

  const answers = [];
  for (const answerData of data.answers) {
    const parsedAnswer = parseAnswer(answerData);
    if (parsedAnswer) {
      answers.push(parsedAnswer);
    }
  }

  return {
    text: data.question,
    answers: answers,
  };
}

/**
 * Parse questions data.
 * @param {Array<unknown>} data Potential questions data.
 * @returns {Array<Question>} Array of parsed Question objects.
 * @throws {Error} If question data is invalid.
 */
export function parseQuestions(data) {
  if (!Array.isArray(data)) {
    throw new Error("questions data is not an array");
  }

  const questions = [];

  for (const questionData of data) {
    if (typeof questionData !== "object" || !questionData) {
      console.warn("invalid question data:", questionData);
      return null;
    }

    if (
      !("question" in questionData) ||
      typeof questionData.question !== "string"
    ) {
      console.warn("invalid question text:", questionData);
      return null;
    }

    if (!Array.isArray(questionData.answers)) {
      console.warn("question data does not have answers array:", questionData);
      return null;
    }

    const answers = [];

    for (const answerData of questionData.answers) {
      const parsedAnswer = parseAnswer(answerData);
      if (parsedAnswer) {
        answers.push(parsedAnswer);
      }
    }

    questions.push({
      text: questionData.question,
      answers: answers,
    });
  }

  return questions;
}

/**
 * Parses index JSON data and returns an array of category objects.
 * @param {string} data JSON string from index file.
 * @returns {Array<Category>} Array of category objects, empty if no valid data.
 * @throws {Error} If unable to parse JSON.
 */
export function parseIndexJson(data) {
  let indexParsed;
  try {
    indexParsed = JSON.parse(data);
  } catch (e) {
    throw new Error("unable to parse index data");
  }

  const categories = [];

  if (Array.isArray(indexParsed)) {
    for (const item of indexParsed) {
      if (
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        typeof item.file === "string"
      ) {
        categories.push({
          title: item.title,
          file: item.file,
        });
      } else {
        console.warn("invalid category data:", item); // Log invalid data
      }
    }
  } else {
    throw new Error("index data is not an array");
  }

  return categories;
}

/**
 * Parse a JSON string and try and get an array of questionnaires.
 * @param {object} data Potential questionnaire data.
 * @returns {Questionnaire} Questionnaire object.
 * @throws If unable to parse JSON.
 */
export function parseQuestionnaireFile(data) {
  // Again, explicitly set type to `unknown` instead of the implicit `any`.
  /** @type unknown */
  let questionnaireParsed;

  try {
    questionnaireParsed = JSON.parse(data);
  } catch (e) {
    throw new Error("unable to parse questionnaire data");
  }

  if (typeof questionnaireParsed !== "object" || !questionnaireParsed) {
    throw new Error("questionnaire data is not an object");
  }

  if (
    !("title" in questionnaireParsed) ||
    typeof questionnaireParsed.title !== "string"
  ) {
    throw new Error("questionnaire data does not have a title");
  }

  if (
    !("questions" in questionnaireParsed) ||
    !Array.isArray(questionnaireParsed.questions)
  ) {
    throw new Error("questionnaire data does not have questions array");
  }

  return {
    title,
    questions: parseQuestions(questionnaireParsed.questions),
  };
}
