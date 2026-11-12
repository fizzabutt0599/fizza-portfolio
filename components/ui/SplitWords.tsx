import { Fragment } from "react";

interface SplitWordsProps {
  text: string;
  /** Class applied to each inner word span (the animated element) */
  wordClassName?: string;
  /** Words (lower-cased, punctuation stripped) to highlight */
  highlight?: string[];
  highlightClassName?: string;
}

/**
 * Free alternative to GSAP SplitText: wraps each word in a mask + inner span.
 * The visible text stays in the DOM in order, so screen readers read it normally.
 */
export function SplitWords({ text, wordClassName = "split-word", highlight = [], highlightClassName }: SplitWordsProps) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => {
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        const isHi = highlight.includes(clean);
        return (
          <Fragment key={`${word}-${i}`}>
            <span className="mask">
              <span className={`${wordClassName} ${isHi ? highlightClassName ?? "" : ""}`}>{word}</span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        );
      })}
    </>
  );
}
