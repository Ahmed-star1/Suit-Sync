import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MeasurementForm from "../components/MeasurementForm";
import { AnimatePresence, motion } from "framer-motion";
import { 
  storeMeasurement, 
  getMeasurements, 
  getCategories, 
} from "../Redux/Reducers/productSlice";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const MeasurementTabsBar = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("shirt");
  const [measurements, setMeasurements] = useState({});
  const [originalMeasurements, setOriginalMeasurements] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
   const [saveTriggered, setSaveTriggered] = useState(false);

  const { 
    measurementLoading, 
    measurementSuccess,
    measurementError,
    measurements: savedMeasurements,
    categoriesLoading,
    measurementsLoading,
    categories,
  } = useSelector((state) => state.products || {});

  const isLoading = categoriesLoading || measurementsLoading;

  // Map tab names to category names from API
  const categoryMap = {
    shirt: "Shirts",
    suit: "Suits",
    shoes: "Shoes",
    belt: "Belts",
    tie: "Ties"
  };

  // Get category data for current tab
  const getCurrentCategoryData = () => {
    const categoryName = categoryMap[activeTab];
    return categories?.find(cat => cat.name === categoryName);
  };

  const currentCategoryData = getCurrentCategoryData();

  const measurementData = {
    shirt: {
      title: "Shirt Measurement",
      fields: ["shirt_size"],
    },
    suit: {
      title: "Suit Measurement",
      fields: ["coat_size", "coat_fit", "pant_size", "pant_fit"],
    },
    shoes: {
      title: "Shoes Measurement",
      fields: ["shoe_size"],
    },
    belt: {
      title: "Belt Measurement",
      fields: ["belt_size"],
    },
    tie: {
      title: "Tie Measurement",
      fields: ["tie_size"],
    },
  };

  const currentTabData = measurementData[activeTab];

  // Fetch categories on page load
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Fetch measurements on page load
  useEffect(() => {
    dispatch(getMeasurements());
  }, [dispatch]);

  // Show success message when measurement is saved
  useEffect(() => {
    if (measurementSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Measurements saved successfully',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#000',
      }).then(() => {
        setSaveTriggered(false);
        dispatch(getMeasurements());
      });
    }
  }, [measurementSuccess, saveTriggered, dispatch]);

  // Show error message if save fails
  useEffect(() => {
    if (measurementError) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: measurementError || 'Failed to save measurements',
        confirmButtonColor: '#000',
      }).then(() => {
        setSaveTriggered(false);
      });
    }
  }, [measurementError, saveTriggered, dispatch]);

  // Populate measurements from API response
  useEffect(() => {
    if (savedMeasurements && Object.keys(savedMeasurements).length > 0) {
      const transformedMeasurements = {
        shirt: {
          shirt_size: savedMeasurements.shirt_size
        },
        suit: {
          coat_size: savedMeasurements.coat_fit,
          coat_fit: savedMeasurements.coat_size,
          pant_size: savedMeasurements.pant_fit,
          pant_fit: savedMeasurements.pant_size
        },
        shoes: {
          shoe_size: savedMeasurements.shoe_size?.toString()
        },
        belt: {
          belt_size: savedMeasurements.belt_size
        },
        tie: {
          tie_size: savedMeasurements.tie_size
        }
      };
      
      setMeasurements(transformedMeasurements);
      setOriginalMeasurements(JSON.parse(JSON.stringify(transformedMeasurements)));
      setHasChanges(false);
    }
  }, [savedMeasurements]);

  // Handle measurement updates from MeasurementForm
  const handleMeasurementChange = (fieldName, value) => {
    setMeasurements(prev => {
      const newMeasurements = {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [fieldName]: value
        }
      };
      
      checkForChanges(newMeasurements);
      
      return newMeasurements;
    });
  };

  // Check if any changes were made to the current tab
  const checkForChanges = (newMeasurements) => {
    const currentOriginal = originalMeasurements[activeTab] || {};
    const currentNew = newMeasurements[activeTab] || {};
    
    let changed = false;
    
    measurementData[activeTab].fields.forEach(field => {
      if (currentOriginal[field] !== currentNew[field]) {
        changed = true;
      }
    });
    
    setHasChanges(changed);
  };

  // Reset changes when tab changes
  useEffect(() => {
    setHasChanges(false);
  }, [activeTab]);

  const handleSaveMeasurements = () => {
    const currentMeasurements = measurements[activeTab] || {};
    let apiMeasurements = {};
    
    if (activeTab === "suit") {
      apiMeasurements = {
        coat_size: currentMeasurements.coat_fit,  
        coat_fit: currentMeasurements.coat_size,    
        pant_size: currentMeasurements.pant_fit,   
        pant_fit: currentMeasurements.pant_size
      };
    } else {
      apiMeasurements = currentMeasurements;
    }
    
    const measurementPayload = {
      category: categoryMap[activeTab].toLowerCase(),
      measurements: apiMeasurements
    };
    setSaveTriggered(true);
    dispatch(storeMeasurement(measurementPayload)).then(() => {
      setOriginalMeasurements(prev => ({
        ...prev,
        [activeTab]: { ...measurements[activeTab] }
      }));
      setHasChanges(false);
    }).catch((error) => {
      console.error("Save error:", error);
    });
  };

  return (
    <div className="col-md-9 right-column measurement-right">
      <div className="right-column-content">
        <div className="header-row">
          <h2>Measurement</h2>
          {/* <button className="designBtn2">How To Measure</button> */}
        </div>

        <div className="main-tabs">
          {["shirt", "suit", "shoes", "belt", "tie"].map((item) => (
            <button
              key={item}
              className={`tab-btn ${activeTab === item ? "active" : ""}`}
              onClick={() => setActiveTab(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            width: '100%'
          }}>
            <Loader />
          </div>
        ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {currentCategoryData ? (
              <MeasurementForm
                title={currentTabData.title}
                fields={currentTabData.fields}
                categoryData={currentCategoryData}
                onMeasurementChange={handleMeasurementChange}
                selectedValues={measurements[activeTab] || {}}
              />
            ) : (
              <div className="error-message">
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        )}

        <div className="buttons-row">
          <button 
            className="designBtn2" 
            onClick={handleSaveMeasurements}
            disabled={measurementLoading || !hasChanges}
            style={{
              opacity: (measurementLoading || !hasChanges) ? 0.5 : 1,
              cursor: (measurementLoading || !hasChanges) ? "not-allowed" : "pointer",
              backgroundColor: !hasChanges ? "#757575" : ""
            }}
          >
            {measurementLoading ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementTabsBar;