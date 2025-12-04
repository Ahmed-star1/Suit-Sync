import React, { useEffect, useState } from "react";

const SizeChartModal = ({ isOpen, onClose }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen && !closing) {
      document.body.style.overflow = "hidden";
    }
  }, [isOpen, closing]);

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      document.body.style.overflow = "auto";
      setClosing(false);
      onClose();
    }, 300); 
  };

  if (!isOpen && !closing) return null;

  return (
    <div className={`size-modal-overlay ${closing ? "fade-out" : "fade-in"}`}>
      <div className={`size-modal-container ${closing ? "scale-out" : "scale-in"}`}>
        <button className="modal-close-btn" onClick={handleClose}>
          ✕
        </button>

        <div className="modal-left col-md-5">
          <img src="/Images/suit1.png" alt="Size Chart" />
        </div>

        <div className="modal-right col-md-7">
          <h2 className="modal-title">Size Chart</h2>
          <p className="modal-description">
            This Size Chart Shows Product Measurements Taken When Products Are
            Laid Flat. Actual Product Measurements May Vary By Up To 1".
          </p>

          <div className="size-table">
            <table>
              <thead>
                <tr>
                  <th>Inch</th>
                  <th>S</th>
                  <th>M</th>
                  <th>L</th>
                  <th>XL</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Length</td><td>28</td><td>29.1</td><td>29.9</td><td>31.1</td></tr>
                <tr><td>Bust</td><td>36.2</td><td>40.2</td><td>44.1</td><td>48</td></tr>
                <tr><td>Shoulder</td><td>15.7</td><td>16.9</td><td>18.1</td><td>19.3</td></tr>
              </tbody>
            </table>
          </div>

          <div className="size-table">
            <table>
              <thead>
                <tr>
                  <th>Centimetre</th>
                  <th>S</th>
                  <th>M</th>
                  <th>L</th>
                  <th>XL</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Length</td><td>71</td><td>74</td><td>76</td><td>79</td></tr>
                <tr><td>Bust</td><td>92</td><td>102</td><td>112</td><td>122</td></tr>
                <tr><td>Shoulder</td><td>37</td><td>40</td><td>43</td><td>46</td></tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
