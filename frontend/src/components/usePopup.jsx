import { useState } from 'react';
import Popup from './Popup';

const usePopup = () => {
  const [popupContent, setPopupContent] = useState(null);

  const showPopup = (content) => {
    setPopupContent(content);
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const PopupWrapper = () => (
    popupContent && (
      <Popup onClose={closePopup}>
        {popupContent}
      </Popup>
    )
  );

  return {
    popupContent,
    showPopup,
    closePopup,
    PopupWrapper
  };
};

export default usePopup;