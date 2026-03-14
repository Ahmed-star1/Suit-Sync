import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {
  getEvents,
  setSelectedEvent,
  assignLookToEvent,
} from "../Redux/Reducers/eventSlice";

const AssignLookModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedEventName, setSelectedEventName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { events, eventsLoading, assignLookLoading } = useSelector(
    (state) =>
      state.events || {
        events: [],
        eventsLoading: false,
        assignLookLoading: false,
      },
  );

  const { selectedProductForLook } = useSelector((state) => state.products);

  useEffect(() => {
    if (isOpen) {
      dispatch(getEvents());
      console.log(
        "Selected product for look:",
        selectedProductForLook?.product_id,
      );
    }
  }, [isOpen, dispatch, selectedProductForLook]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedEventName("");
      setSelectedEventId("");
      setSelectedEventType("");
      setActiveDropdown(null);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatEventType = (type) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get product image from order/item
  const getProductImage = (item) => {
    if (!item) return "/Images/suit1.png";

    if (item.image) {
      return item.image;
    }

    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const featuredImage = item.images.find((img) => img.is_featured === true);
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.images[0].image_url;
    }

    if (item.product?.images && Array.isArray(item.product.images)) {
      const featuredImage = item.product.images.find(
        (img) => img.is_featured === true,
      );
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.product.images[0]?.image_url;
    }

    return "/Images/suit1.png";
  };

  // Get item title
  const getItemTitle = (item) => {
    if (!item) return "Product";
    return item.product_name || item.title || item.name || "Product";
  };

  const handleEventSelect = (event) => {
    setSelectedEventId(event.id);
    setSelectedEventName(event.name || event.title);
    setSelectedEventType(event.type);
    setActiveDropdown(null);

    dispatch(
      setSelectedEvent({
        id: event.id,
        name: event.name || event.title,
        type: event.type,
        image_url: event.image_url,
      }),
    );
  };

  const handleDropdownClick = (dropdownName, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleAssign = async () => {
    if (!selectedEventId || !selectedProductForLook?.product_id) {
      console.error("Missing event ID or product ID");
      return;
    }

    setIsAssigning(true);

    try {
      const result = await dispatch(
        assignLookToEvent({
          eventId: selectedEventId,
          productId: selectedProductForLook.product_id,
        }),
      ).unwrap();
      onClose();

      navigate(`/event/${selectedEventId}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const isAssignDisabled =
    !selectedEventId ||
    !selectedProductForLook?.product_id ||
    isAssigning ||
    assignLookLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="assign-modal-wrapper" onClick={onClose}>
          <motion.div
            className="assign-modal"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="row">
              <div className="modal-left col-md-5">
                <img
                  src={getProductImage(order)}
                  alt={getItemTitle(order)}
                  onError={(e) => {
                    e.target.src = "/Images/suit1.png";
                  }}
                />
              </div>
              <div className="modal-right col-md-7">
                <h2>Assign Look</h2>
                <p>
                  Choose an event from the dropdown below to assign this look.
                </p>

                <label>Select Event</label>
                <div className="select-field product-detail-page">
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={(e) => handleDropdownClick("event", e)}
                    >
                      {selectedEventId ? (
                        <div className="selected-event-display">
                          <div className="selected-event-info">
                            <span className="selected-event-name">
                              {selectedEventName}
                            </span>
                            <span
                              className="selected-event-type"
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginLeft: "8px",
                              }}
                            >
                              ({formatEventType(selectedEventType)})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="selected-value">Select Event</span>
                      )}
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeDropdown === "event" && (
                      <ul className="custom-select-dropdown event-dropdown">
                        {eventsLoading ? (
                          <li className="dropdown-loader">
                            <Loader size="small" />
                          </li>
                        ) : events && events.length > 0 ? (
                          events.map((event) => (
                            <li
                              key={event.id}
                              className={
                                selectedEventId === event.id ? "active" : ""
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventSelect(event);
                              }}
                            >
                              <div className="event-option-with-image">
                                <img
                                  src={
                                    event.image_url ||
                                    "/Images/default-event.png"
                                  }
                                  alt={event.name || event.title}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                <div>
                                  <h5 className="event-option-name">
                                    {event.name || event.title}
                                  </h5>
                                  <p className="event-option-type">
                                    {formatEventType(event.type)}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="no-events">No events found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="modal-buttons">
                  <button
                    className="designBtn2"
                    onClick={onClose}
                    disabled={isAssigning}
                    style={{
                      opacity: isAssigning ? 0.5 : 1,
                      cursor: isAssigning ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="designBtn2"
                    onClick={handleAssign}
                    disabled={isAssignDisabled}
                    style={{
                      opacity: isAssignDisabled ? 0.5 : 1,
                      cursor: isAssignDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {isAssigning || assignLookLoading ? (
                      <span>
                        <i
                          className="fa fa-spinner fa-spin"
                          style={{ marginRight: "8px" }}
                        ></i>
                        Assigning...
                      </span>
                    ) : (
                      "Assign"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssignLookModal;
