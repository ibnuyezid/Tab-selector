import React, { useState, useEffect, useRef } from "react";
import style from "./select.module.css";
interface selectoption {
  label: string;
  value: string | number;
}
type selectprops = {
  option: selectoption[];
} & (singleselectprop | multipleselectprop);
interface singleselectprop {
  multiple?: false;
  value?: selectoption;
  onChange: (value: selectoption | undefined) => void;
}
interface multipleselectprop {
  multiple: true;
  value: selectoption[];
  onChange: (value: selectoption[]) => void;
}
// {
//   option, value, onChange;
// }
const Select = ({ multiple, option, value, onChange }: selectprops) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isopen, setIsopen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const clearOptions = () => {
    multiple ? onChange([]) : onChange(undefined);
  };
  const handleOption = (selectedoption: selectoption) => {
    if (multiple) {
      if (value.includes(selectedoption)) {
        onChange(value.filter((o) => o !== selectedoption));
      } else {
        onChange([...value, selectedoption]);
      }
    } else {
      onChange(selectedoption);
    }
  };
  function isOptionSelected(option: selectoption) {
    return multiple ? value.includes(option) : option === value;
  }
  useEffect(() => {
    setHighlightedIndex(0);
  }, [isopen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsopen((prev) => !prev);
          if (isopen) handleOption(option[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (!isopen) {
            setIsopen(true);
            break;
          }
          const newval = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newval >= 0 && newval < option.length) {
            setHighlightedIndex(newval);
          }
      }
    };
    containerRef.current?.addEventListener("keydown", handler);
    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isopen, highlightedIndex, option]);
  return (
    <>
      <div
        ref={containerRef}
        onBlur={() => setIsopen(false)}
        onClick={() => setIsopen((prev) => !prev)}
        tabIndex={0}
        className={style.container}
      >
        {" "}
        <span className={style.value}>
          {" "}
          {multiple
            ? value.map((v) => (
                <button
                  className={style["option-badges"]}
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOption(v);
                  }}
                >
                  {v.label}
                  <span className={style["remove-btn"]}>&times;</span>
                </button>
              ))
            : value?.label}
        </span>
        <button
          className={style["clear-btn"]}
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
        >
          &times;
        </button>
        <div className={style.divider}></div>
        <div className={style.caret}></div>
        <ul className={`${style.options} ${isopen ? style.show : ""}`}>
          {option.map((item, index) => (
            <li
              onMouseEnter={() => setHighlightedIndex(index)}
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                handleOption(item);
                setIsopen(false);
              }}
              className={`${style.option} ${
                isOptionSelected(item) ? style.selected : ""
              } ${highlightedIndex === index ? style.highlighted : ""}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Select;
