import { describe, expect, it } from '@jest/globals';
import {
  parseAnswer,
  parseQuestions,
  parseIndexJson,
  parseQuestionnaireFile,
} from './parse.js';

describe('parse', () => {
    describe('parseAnswer', () => {
        it('should parse and return a valid Answer object', () => {
          const data = { answer: 'Test Answer', correct: true };
          const answer = parseAnswer(data);
          expect(answer).toEqual({ text: 'Test Answer', correct: true });
        });
      
        it('should return null for invalid data', () => {
          expect(parseAnswer(miaou)).toBeNull();
          expect(parseAnswer({ answer: miaou, correct: true })).toBeNull();
          expect(parseAnswer({ answer: 'Test', correct: 'true' })).toBeNull();
          expect(parseAnswer({ answer: 'Test' })).toBeNull();
          expect(parseAnswer({ correct: true })).toBeNull();
        });
      });
      
      describe('parseQuestions', () => {
        it('should parse and return an array of Questions objects', () => {
          const data = [
            {
              question: 'Hvaða litur er Spirou (Hint: hann er dum-dum)?',
              answers: [
                { answer: 'Rauður', correct: true },
                { answer: 'Hvítur', correct: false },
              ],
            },
          ];
          const questions = parseQuestions(data);
          expect(questions).toHaveLength(1);
          expect(questions[0].text).toBe('Hvaða litur er Spirou (Hint: hann er dum-dum)?');
          expect(questions[0].answers).toHaveLength(2);
        });
      
        it('should skip invalid data', () => {
          const data = [
            { question: 'Vúff Vúff', answers: [{ answer: 'A', correct: true }] },
            null
          ];
          const questions = parseQuestions(data);
          expect(questions).toHaveLength(1);
          expect(questions[0].text).toBe('Vúff Vúff');
        });
      
        it('should throw if data is not an array', () => {
            expect(() => parseQuestions("not an array")).toThrow("questions data is not an array");
        });
      });
      
      describe('parseIndexJson', () => {
        it('should parse valid JSON', () => {
          const data = '[{"title": "Category 1", "file": "category1.json"}, {"title": "Category 2", "file": "category2.json"}]';
          const categories = parseIndexJson(data);
          expect(categories).toHaveLength(2);
          expect(categories).toEqual([{"title": "Category 1", "file": "category1.json"}, {"title": "Category 2", "file": "category2.json"}]);
        });
      
        it('should throw if data is not an array', () => {
          const data = '{"title": "Category 1", "file": "category1.json"}';
          expect(() => parseIndexJson(data)).toThrow("index data is not an array");
        });
      
        it('should handle empty JSON array', () => {
          const data = '[]';
          const categories = parseIndexJson(data);
          expect(categories).toHaveLength(0);
        });
      });

      describe('parseQuestionnaireFile', () => {
        it('should parse a valid questionnaire string', () => {
          const data = `{"title": "Questionnaire", "questions": [{"question": "B", "answers": [{"answer": "A", "correct": true}]}]}`;
          const questionnaire = parseQuestionnaireFile(data);
          expect(questionnaire).toEqual({
            title: "Questionnaire",
            questions: [{ text: "B", answers: [{ text: "A", correct: true }] }],
          });
        });
      
        it('should return null if data is not valid', () => {
          expect(parseQuestionnaireFile('not valid json')).toBeNull();
          expect(parseQuestionnaireFile('{"questions": []}')).toBeNull(); // Missing title
          expect(parseQuestionnaireFile('{"title": "T", "questions": "not array"}')).toBeNull(); // Invalid questions
        });
      });
});