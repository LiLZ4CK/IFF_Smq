

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

  const handleSearch = () => {
    let predicate = new Predicate('Subject', 'contains', selectedPross, true);
    if (selectedType) {
      predicate = predicate.and('Type', 'contains', selectedType, true);
    }
    if (selectedResponsable) {
      predicate = predicate.and('Description', 'contains', selectedResponsable, true);
    }

    const filteredEvents = new DataManager(eventss).executeLocal(new Query().where(predicate));
    scheduleRef.current.eventSettings.dataSource = filteredEvents;
  };

  const handleClearSearch = () => {
    setSelectedPross('');
    setSelectedType('');
    setSelectedResponsable('');
    scheduleRef.current.eventSettings.dataSource = eventss;
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className='backg'></div>
      <div className='Planning'>
        <div className='search-area'>
          <select
            name="selectProcessus"
            id="proce"
            value={selectedPross}
            onChange={(e) => setSelectedPross(e.target.value)}
            required
          >
            <option value="" disabled selected={selectedPross === ""}>
              Nom de processus
            </option>
            {processes.map((pros, index) => (
              <option key={index} value={pros.name}>
                {pros.name}
              </option>
            ))}
          </select>  
          <select
            name="selectResponsable"
            id="respo"
            value={selectedResponsable}
            onChange={(e) => setSelectedResponsable(e.target.value)}
            required
          >
            <option value="" disabled selected={selectedResponsable === ""}>
              Nom de responsable
            </option>
            {responsables.map((resp, index) => (
              <option key={index} value={resp.name}>
                {resp.name}
              </option>
            ))}
          </select>
          <ButtonComponent id='Hsearch' onClick={handleSearch}>Search</ButtonComponent>
          <ButtonComponent id='Csearch' onClick={handleClearSearch}>Clear</ButtonComponent>
        </div>
        <ScheduleComponent
          locale='fr-CH'
          currentView='Month'
          width={1400}
          height={850}
          allowKeyboardInteraction={true}
          eventSettings={eventSettings}
          actionComplete={Events}
          editorTemplate={editorWindow}
          ref={scheduleRef}
        >
          <ViewsDirective>
            <ViewDirective option="TimelineYear" />
            <ViewDirective option="Year" />
            <ViewDirective option="Month" />
            <ViewDirective option="Week" />
            <ViewDirective option="Day" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, Year, TimelineYear, DragAndDrop, Resize]} />
        </ScheduleComponent>

      </div>
    </main>
  );
};

export default PlanningDauit;
