/**
 * Generate HTML for a page.
 * @param {string} title Title of the page.
 * @param {string} body HTML body of the page.
 * @returns Full HTML body for the page.
 */
export function template(title, body) {
  return /* HTML */ `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="stylesheet" href="styles.css" />
        <title>${title}</title>
      </head>
      <body>
        <main>${body}</main>
      </body>
    </html>`;
}

/**
 * Generate HTML for index.
 * @param {Array<import(./parse').Category>} categories Array of category objects from index.json.
 * @returns {string} HTML for index.
 */
export function indexTemplate(categories) {
  let categoryLinks = "";

  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (
        typeof category.title === "string" &&
        typeof category.file === "string"
      ) {
        categoryLinks += /* HTML */ `
          <li>
            <a href="${category.title.toLowerCase()}.html">${category.title}</a>
          </li>
        `;
      }
    }
  }

  const body = /* HTML */ `
    <h1>Vefforritun Quiz!</h1>
    <p>
      Hversu mikið veist þú um vefforritun? Hér getur þú reynt á þekkingu þína!
    </p>
    <ul>
      ${categoryLinks}
    </ul>
  `;

  return template("Vefforritun Quiz!", body);
}

/**
 * Generate HTML for a questionnaire.
 * @param {import('./parse').Questionnaire} questionnaire The questionnaire data (with title and questions).
 * @returns {string} HTML for the questionnaire page.
 */
export function questionnaireTemplate(questionnaire) {
    const questionHTML = questionnaire.questions.map(question => {
        const answersHTML = question.answers.map(answer => /* HTML */ `
          <label>
            <input type="radio" name="question" value="${escapeHtml(answer.text)}">
            ${escapeHtml(answer.text)}
          </label><br>
        `).join('');

        return /* HTML */ `
          <div>
            <h2>${question.text}</h2>
            <form>
                ${answersHTML}
                <button type="button" class="submit">Birta rétt svar</button>
                <div class="result"></div>
            </form>
          </div>
        `;
    }).join('');

    const body = /* HTML */ `
      <h1>${questionnaire.title}</h1>
      ${questionHTML}
      <p><a href="index.html">Til baka á forsíðu</a>.</p>
    `;

    return template(questionnaire.title, body);
}

/**
 * Function that writes an html phrase so it appears as normal text, doesn't get formatted.
 * 
 * This one was written by AI!
 * @param {*} unsafe 
 * @returns 
 */
export function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return m;
    }
  });
}

