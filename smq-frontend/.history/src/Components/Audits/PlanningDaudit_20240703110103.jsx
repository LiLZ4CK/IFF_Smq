

  const editorWindow = (props) => {
    try {
      const isValidDate = (date) => {
        return date && !isNaN(new Date(date).getTime());
      };

      const getDateString = (date) => {
        if (isValidDate(date)) {
          const adjustedDate = new Date(date);
          adjustedDate.setHours(adjustedDate.getHours() + 1);
          return adjustedDate.toISOString().slice(0, 16);
        } else {
          return '';
        }
      };
