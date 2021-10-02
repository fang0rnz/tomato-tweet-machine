import React from "react";
import "./TextArea.css";

function TextArea({ minRows = 2, ...props }) {
  const [rows, setRows] = React.useState(minRows);

  const handleChange = (event) => {
    const textareaLineHeight = 18;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    setRows(currentRows);
    props.onChange(event);
  };

  return (
    <textarea
      {...props}
      rows={rows}
      value={props.value}
      placeholder={"Enter your text here..."}
      className="textarea"
      onChange={handleChange}
    />
  );
}

export default TextArea;
