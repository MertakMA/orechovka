import { Fragment } from "react";

// Nový řádek v textu z Notionu (Shift+Enter) → <br /> na webu.
export default function Radky({ text }: { text: string }) {
  const radky = text.split("\n");
  return (
    <>
      {radky.map((radek, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {radek}
        </Fragment>
      ))}
    </>
  );
}
