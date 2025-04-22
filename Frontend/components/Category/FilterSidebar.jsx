
import { useEffect, useRef } from 'react';
import '../../src/assets/Styles/FilterSidebar.css';

const FilterSidebar = ({ open, onClose }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (backdropRef.current && e.target === backdropRef.current) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="filter-popover-backdrop" ref={backdropRef}>
      <div className="filter-popover-panel">
        <div className="filter-popover-header">
          <h3>Filter by category</h3>
          <button className="filter-popover-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="filter-content">
          <div className="filter-section">
            <div className="filter-category">
              <h4>Clothing</h4>
              <span className="arrow">›</span>
            </div>
            <div className="filter-group">
              <h4>Special offers</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="free-shipping" />
                  <span className="checkmark"></span>
                  FREE shipping
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="on-sale" />
                  <span className="checkmark"></span>
                  On sale
                </label>
              </div>
            </div>
            <div className="filter-group">
              <h4>Shipping Duration</h4>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="shipping-duration" value="any" />
                  <span className="radio-mark"></span>
                  Any duration
                </label>
                <label className="radio-label">
                  <input type="radio" name="shipping-duration" value="1day" defaultChecked />
                  <span className="radio-mark"></span>
                  1 day
                </label>
                <label className="radio-label">
                  <input type="radio" name="shipping-duration" value="3days" />
                  <span className="radio-mark"></span>
                  3 days
                </label>
                <label className="radio-label">
                  <input type="radio" name="shipping-duration" value="custom" />
                  <span className="radio-mark"></span>
                  Custom
                </label>
                <input 
                  type="text" 
                  className="location-input" 
                  placeholder="Enter location" 
                />
              </div>
            </div>
            <div className="filter-group">
              <h4>Item format</h4>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="item-format" value="all" defaultChecked />
                  <span className="radio-mark"></span>
                  All
                </label>
                <label className="radio-label">
                  <input type="radio" name="item-format" value="physical" />
                  <span className="radio-mark"></span>
                  Physical items
                </label>
                <label className="radio-label">
                  <input type="radio" name="item-format" value="digital" />
                  <span className="radio-mark"></span>
                  Digital downloads
                </label>
              </div>
            </div>
            <div className="filter-group">
              <h4>Storage Park best</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="park-pick" />
                  <span className="checkmark"></span>
                  Storage Park Pick
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="star-partner" />
                  <span className="checkmark"></span>
                  Star Partner <span className="star-icon">★</span>
                </label>
                <p className="filter-description">
                  Consistently earned 5-star reviews, replied quickly to messages
                </p>
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-apply" onClick={onClose}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
