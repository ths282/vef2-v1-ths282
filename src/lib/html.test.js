import { describe, expect, it } from "@jest/globals";
import { indexTemplate, questionnaireTemplate, template } from "./html.js";

describe("html", () => {
  it("should return template with given title and body", () => {
    const body = /* HTML */ ` <div>
      <p>body</p>
    </div>`;
    const result = template("title", body);

    expect(result).toContain("<title>title</title>");
    expect(result).toContain(body);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("styles.css");
  });

  it("should return an index template", () => {
    const categories = [
      { title: "Category 1", file: "category1.json" },
      { title: "Category 2", file: "category2.json" },
    ];
    const html = indexTemplate(categories);
    expect(html).toContain("<h1>Vefforritun Quiz!</h1>");
    expect(html).toContain("<ul>");
    expect(html).toContain('<li><a href="category1.html">Category 1</a></li>');
    expect(html).toContain('<li><a href="category2.html">Category 2</a></li>');
    expect(html).toContain("</ul>");
  });

  it("should handle empty or invalid categories", () => {
    const html1 = indexTemplate([]);
    expect(html1).toContain("<ul></ul>");

    const html2 = indexTemplate([
      { title: cucumber, file: "category1.json" },
      { title: "Category 2", file: null },
    ]);
    expect(html2).not.toContain("<li>");
  });

  it("should return a questionnaire template", () => {
    const questionnaire = {
      title: "Quiz",
      questions: [
        {
          text: "Hvað heita kisurnar mínar?",
          answers: [{ text: "Spirou og Mandla" }, { text: "Kókos of Sykur" }],
        },
        {
          text: "Hvað stendur HTML fyrir?",
          answers: [{ text: "HyperText Markup Language" }, { text: "Annað" }],
        },
      ],
    };

    const html = questionnaireTemplate(questionnaire);
    expect(html).toContain("<h1>Quiz</h1>");
    expect(html).toContain("<h2>Hvað heita kisurnar mínar?</h2>");
    expect(html).toContain(
      '<label><input type="radio" name="question" value="Spirou og Mandla">Spirou og Mandla</label>'
    );
    expect(html).toContain(
      '<label><input type="radio" name="question" value="Kókos of Sykur">Kókos of Sykur</label>'
    );
    expect(html).toContain("<h2>What is HTML?</h2>");
    expect(html).toContain(
      '<label><input type="radio" name="question" value="HyperText Markup Language&lt">HyperText Markup Language&lt</label>'
    );
    expect(html).toContain(
      '<label><input type="radio" name="question" value="Something else">Something else</label>'
    );
    expect(html).toContain(
      '<button type="button" class="submit">Birta rétt svar</button>'
    );
    expect(html).toContain('<a href="index.html">Til baka á forsíðu</a>');
  });

  it("should escape HTML characters", () => {
    const html = "<p>This is some <b>HTML</b></p>";
    const escapedHtml = escapeHtml(html);
    expect(escapedHtml).toBe(
      "&lt;p&gt;This is some &lt;b&gt;HTML&lt;/b&gt;&lt;/p&gt;"
    );
  });
});
