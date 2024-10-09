import { useEffect, useState, useRef } from 'react';
import './PlanningDaudit.css';
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import {
  Day,
  DragAndDrop,
  Inject,
  Month,
  Year,
  TimelineYear,
  Resize,
  ViewDirective,
  ViewsDirective,
  Week,
} from '@syncfusion/ej2-react-schedule/src';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import { loadCldr, L10n } from "@syncfusion/ej2-base";
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';

const PlanningDauit = () => {
  const [audits, setAudits] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedResponsable, setSelectedResponsable] = useState('');
  const [selectedPross, setSelectedPross] = useState("");
  const scheduleRef = useRef();
  

  const localeData = require('../Assets/Cultur/local.json');

  loadCldr(
    require('../Assets/Cultur/numberingSystems.json'),
    require('../Assets/Cultur/ca-gregorian.json'),
    require('../Assets/Cultur/numbers.json'),
    require('../Assets/Cultur/timeZoneNames.json')
  );

  L10n.load({
    'fr-CH': {
      'All day': 'x',
      'schedule': {
        'saveButton': 'Sauvegarder',
        'cancelButton': 'Annuler',
        'deleteButton': 'Supprimer',
        'newEvent': 'Ajouter',
        'Week': 'Semana',
        'DAY': 'Jour'
      },
    }
  });

  L10n.load(localeData);

  const fieldsData = {
    id: 'Id',
    processus: { name: 'Processus', title: 'processus' },
    startTime: { name: 'StartTime', title: 'Start Duration' },
    endTime: { name: 'EndTime', title: 'End Duration' },
    location: { name: 'Location', title: 'Event Location' },
    type: { name: 'Type', title: 'Type d\'Audit' },
    responsable:{ name: 'Responsable', title: 'responsable'},
  };

  const fetchProcesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/proc/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProcesses(data.procs);
      } else {
        console.error('Error fetching processes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching processes:', error);
    }
  };
  
  const fetchResponsables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/nconf/resp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setResponsables(data.resp);
      } else {
        console.error('Error fetching responsables:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching responsables:', error);
    }
  };
  
  const fetchAudits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/audits/list', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setAudits(data.audits);
      } else {
        console.error("Failed to fetch audits:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
    
    useEffect(() => {
    fetchAudits();
    fetchProcesses();
    fetchResponsables();
  }, []);

  const eventss = audits.map((event) => {
    const startTime = new Date(event.planningDate);
    const endTime = new Date(event.realisationDate);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error("Invalid date found in event data!");}
    return {
      id: event.id,
      Subject: event.processus,
      StartTime: startTime,
      EndTime: endTime,
      IsAllDay: false,
      Status: event.status, // Make sure this field name matches your data
      Type: event.type,
    };
  });
  
  const EventTemplate = (props) => {
    const statusStyle = (status) => {
      switch(status) {
        case 0: return 'yellow-event';
        case 1: return 'orange-event';
        case 2: return 'green-event';
        default: return 'yellow-event';
      }
    };

    return (
      <div className={`template-wrap ${statusStyle(props.Status)}`}>
        {props.Subject}
      </div>
    );
  };

  const eventSettings = {
    dataSource: eventss,
    fields: fieldsData,
    template: EventTemplate,
    quickInfoTemplates: {
      header: (props) => {
        const headerStyle = (status) => {
          switch(status) {
            case 1: return 'green-event';
            case 2: return 'yellow-event';
            default: return 'orange-event';
          }
        };

        return (
          <div className={`e-quick-popup-header ${headerStyle(props.Status)}`}>
            <div className="e-header-icon-wrapper">
              <div className="e-header-icon e-icons e-close" title="Close"></div>
            </div>
            <div className="e-subject-wrap">
              <span className="e-subject">{props.Subject}</span>
            </div>
          </div>
        );
      }
    }
  };

  const Events = async (args) => {
    try {
      const token = localStorage.getItem('token');
      if (args.requestType === 'eventChanged') {
        console.log(1)
        const formData = new FormData();
        formData.append('id', args.data[0].id);
        formData.append('responsableId', document.querySelector('select[name="Responsable"]').value);
        formData.append('type', document.querySelector('input[name="Type"]').value);
        formData.append('processus', document.querySelector('select[name="Processus"]').value);
        formData.append('planningDate', document.querySelector('input[name="StartTime"]').value);
        formData.append('realisationDate', document.querySelector('input[name="EndTime"]').value);
        formData.append('lieu', 'IFF');
        try {
          const response = await fetch('http://localhost:3000/audits/edit', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          console.log(2)
          if (response.ok) {
            fetchAudits();
          }
        }
        catch (error) {
          console.error("Error:", error);
        }
      }

      else if (args.requestType === 'eventRemoved') {
        const idd = args.data[0].id;
        try {
          const response = await fetch('http://localhost:3000/audits/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idd }),
          });

          if (response.ok) {
            fetchAudits();
          } else {
            console.error("Failed to delete:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
      else if (args.requestType === 'eventCreated') {
        const formData = new FormData();
          formData.append('id', args.data[0].id);
          formData.append('responsableId', document.querySelector('select[name="Responsable"]').value);
          formData.append('type', document.querySelector('input[name="Type"]').value);
          formData.append('processus', document.querySelector('select[name="Processus"]').value);
          formData.append('planningDate', document.querySelector('input[name="StartTime"]').value);
          formData.append('realisationDate', document.querySelector('input[name="EndTime"]').value);
          formData.append('lieu', 'IFF');
        try {
          const response = await fetch('http://localhost:3000/audits/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          if (response.ok) {
            fetchAudits();
          }
        }
        catch (error) {
          console.error("Error:", error);
        }
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

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
            <td className="Responsable">Responsable</td>
              <td>
                <select 
                  name="Responsable" 
                  id="custom" 
                  defaultValue={props.Responsable} 
                  required
                >
                  <option value="" disabled>Nom de Responsable</option>
                  {responsables.map((pros, index) => (
                    <option key={index} value={pros.id}>{pros.name}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
            <td className="Processus">Processus</td>
              <td>
                <select 
                  name="Processus" 
                  id="custom" 
                  defaultValue={props.Processus} 
                  required
                >
                  <option value="" disabled>Nom de Processus</option>
                  {processes.map((pros, index) => (
                    <option key={index} value={pros.name}>{pros.name}</option>
                  ))}
                </select>
              </td>
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
              <td className="StartTime">Date de planification</td>
              <td><input id="customStartTime" name="StartTime" type="datetime-local" defaultValue={getDateString(props.StartTime)}/></td>
            </tr>
            <tr>
              <td className="EndTime">Date de réalisation</td>
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
      <div className='colors'>
      <div className="explanation">
        <div className="grn"></div>
        <span>Realiser</span>
      </div>
      <div className="explanation">
        <div className="ylw"></div>
        <span>Prevue</span>
      </div>
      <div className="explanation">
        <div className="org"></div>
        <span>En cours</span>
      </div>
    </div>
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
