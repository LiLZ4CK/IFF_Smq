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

    return (
      <table className="custom-event-editor" lang='fr'>
        <tbody>
          <tr>
            <td className="Subject">Processus</td>
            <td><input id="custom" name="Subject" type="text" defaultValue={props.Subject}></input></td>
          </tr>
          <tr>
            <td className="Type">Type d'Audit</td>
            <td><input id="custom" name="Type" type="text" defaultValue={props.Type}></input></td>
          </tr>
          <tr>
            <td className="Description">Objectif d'audit</td>
            <td><input id="custom" name="Description" type="text" defaultValue={props.Description}></input></td>
          </tr>
          <tr>
            <td className="Description">Responsable</td>
            <td><input id="custom" name="Description" type="text" defaultValue={props.Description}></input></td>
          </tr>
          <tr>
            <td className="StartTime">Date de début</td>
            <td><input id="customStartTime" name="StartTime" type="datetime-local" defaultValue={getDateString(props.StartTime)}/></td>
          </tr>
          <tr>
            <td className="EndTime">Date de fin</td>
            <td><input id="customEndTime" name="EndTime" type="datetime-local" defaultValue={getDateString(props.EndTime)}/></td>
          </tr>
        </tbody>
      </table>
    );
  } catch (error) {
    console.log('error = ', error);
  }
};