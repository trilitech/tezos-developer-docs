import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function QuizQuestion({
  questionText, q0, q1, q2, q3, correctAnswerIndex,
}) {
  const [response, setResponse] = useState("");
  let answerTexts = [q0, q1, q2, q3];
  let answers = answerTexts.map((q, index) => ({
    text: q,
    isCorrect: index === Number(correctAnswerIndex),
  }));

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setResponse("Correct!");
    } else {
      setResponse("Try again");
    }
  }
  return (
    <div className={clsx(styles.quizquestion)}>
      <div className={clsx(styles.quizheading)}>Quiz</div>
      <div className="questiontext">{questionText}</div>
      <div className={clsx(styles.answersection)}>
        {answers.map(({ text, isCorrect }, index) => (
          <button key={index} onClick={() => handleAnswer(isCorrect)}>{text}</button>
        ))}
      </div>
      <div className="response">{response}</div>
    </div>
  );
}
