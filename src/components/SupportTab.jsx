import React, { useState } from "react";

const SupportTab = () => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div className="col-md-9 right-column support">
      <div className="right-column-content">
        <h2>Support</h2>
        <p>
          Let us know your feedback queries or issues regarding the app or
          feature.
        </p>

        <textarea
          className="textarea-input"
          placeholder="Write Feedback Here..."
          value={feedback}
          onChange={handleFeedbackChange}
        />

        <div className="buttons-row">
          <button className="designBtn2">Back</button>
          <button className="designBtn2">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;