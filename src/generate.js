import { writeFile } from "fs/promises";
import { join } from "path";
import {
  createDirIfNotExists,
  readFile,
  readFilesFromDir,
} from "./lib/file.js";
import { indexTemplate, questionnaireTemplate } from "./lib/html.js";
import { parseQuestionnaireFile, parseIndexJson } from "./lib/parse.js";
import { read } from "fs";

const INPUT_DIR = "./data";
const OUTPUT_DIR = "./dist";

/**
 * Fall sem keyrir allt heilaklabbið:
 *
 * 1. Lesa upp skrár úr `INPUT_DATA`.
 * 2. Þátta og útbúa fylki með öllum leikdögum.
 * 3. Reikna stöðu.
 * 4. Útbúa HTML skrár og vista `OUTPUT_DIR`.
 */
async function main() {
  console.info("starting to generate");

  // Búum til möppuna sem geymir unnin gögn ef ekki til
  await createDirIfNotExists(OUTPUT_DIR);

  // Sækjum liðaheiti, ef gögn spillt mun þetta kasta villu og hætta keyrslu
  const indexFileData = await readFile(join(INPUT_DIR, "index.json"));
  const categories = parseIndexJson(indexFileData);

  if (!categories) {
    console.error("categories could not be parsed");
    return;
  }

  console.info("categories read, total", categories.length);

  // Búum til HTML skrár
  for (const questionnaire of categories) {
    const questionnaireJsonData = await readFile(
      join(INPUT_DIR, category.file)
    );
    const questionnaire = parseQuestionnaireFile(questionnaireJsonData);

    if (!questionnaire) {
      console.error(`error parsing data for ${category.title}`);
      continue;
    }

    const questionnaireHTML = questionnaireTemplate(questionnaire);
    const fileName = `${category.title.toLowerCase().replace(/\s/g, "-")}.html`;
    await writeFile(join(OUTPUT_DIR, fileName), categoryHTML);
    console.info(`Generated ${fileName}`);
  }

  const indexHTML = indexTemplate(categories);
  await writeFile(join(OUTPUT_DIR, "index.html"), indexHTML, "utf8");
  console.info("Generated index.html");

  console.info("finished generating");
}

main().catch((error) => {
  console.error("error generating", error);
});
