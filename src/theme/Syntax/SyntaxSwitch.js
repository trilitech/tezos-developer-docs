import { useHistory, useLocation } from "@docusaurus/router";
import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

function SyntaxSwitch(props) {
  const [isNext, setIsNext] = useState(false);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    let hidePascaligo =
      !location.pathname?.startsWith("/docs/0.72.0") &&
      !location.pathname?.startsWith("/docs/0.73.0");

    setIsNext(hidePascaligo);
  }, [location]);

  const onSyntaxChange = useCallback(
    (value) => {
      console.log('syntaxchange')
      if (typeof window === "undefined") return;
      history.replace({
        search: `?lang=${value}`,
      });
      localStorage.setItem("syntax", value);
      props.onSyntaxChange(value);
    },
    [props.syntax]
  );

  return isNext ? (
    <form>
      <div className={clsx("switch__container")}>
        <label
          className={clsx("switch__options-jsligo")}
          onClick={() => onSyntaxChange("jsligo")}
        >
          JsLIGO
        </label>
        <button
          type="button"
          role="switch"
          className={clsx("switch__button")}
          aria-label={`prefer ${props.syntax}`}
          aria-checked={props.syntax === "cameligo"}
          onClick={() => onSyntaxChange(props.syntax === "jsligo" ? "cameligo" : "jsligo")}
        >
          <span className={clsx("switch__button-circle")}></span>
        </button>
        <label
          className={clsx("switch__options-cameligo")}
          onClick={() => onSyntaxChange("cameligo")}
        >
          CameLIGO
        </label>
      </div>
    </form>
  ) : (
    <select
      className={clsx("syntaxSwitch")}
      value={props.syntax}
      onChange={(e) => onSyntaxChange(e.target.value)}
    >
      <option value="cameligo">CameLIGO</option>
      <option value="jsligo">JsLIGO</option>
      <option value="pascaligo">PascaLIGO</option>
    </select>
  );
}

export default SyntaxSwitch;
