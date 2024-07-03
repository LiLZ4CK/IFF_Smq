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
  const [loading, setLoading] = useState(true); // Loading state
  const scheduleRef = useRef(null);

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
    subject: { name: 'Subject', title: 'Processus' },
    startTime: { name: 'StartTime', title: 'Start Duration' },
    endTime: { name: 'EndTime', title: 'End Duration' },
    location: { name: 'Location', title: 'Event Location' },
    type: { name: 'type', title: 'Type d\'Audit' } 
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
        console.log("Processes:", processes); // Add this line
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
        console.log("Responsables:", responsables); // Add this line
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
        console.log("Audits:", audits); // Add this line
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

  useEffect(() => {
    if (audits.length > 0 && processes.length > 0 && responsables.length > 0) {
      setLoading(false);
    }
  }, [audits, processes, responsables]);

  const eventss = audits.map((event) => {
    return {
      id: event.id,
      Subject: event.processus,
      StartTime: new Date(event.planningDate),
      EndTime: new Date(event.realisationDate),
      IsAllDay: false,
      Status: event.status, // Make sure this field name matches your data
      Type: event.type,
    };
  });
  
  const EventTemplate = (props) => {
    const statusStyle = (status) => {
      switch(status) {
        case 1: return 'green-event';
        case 2: return 'yellow-event';
        default: return 'orange-event';
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
        const auda = {
          id: args.data[0].id,
          proce: document.querySelector('input[name="Subject"]').value,
          type: document.querySelector('input[name="Type"]').value,
          desc: document.querySelector('input[name="Description"]').value,
          start: document.querySelector('input[name="StartTime"]').value,
          end: document.querySelector('input[name="EndTime"]').value,
          mvstart: args.data[0].StartTime,
          mvend: args.data[0].EndTime
        };
        try {
          console.log('here!!');
          const response = await fetch('http://localhost:3000/audits/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ auda }),
          });
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
        console.log('check!');
        const aud = {
          proc: document.querySelector('input[name="Subject"]').value,
          type: document.querySelector('input[name="Type"]').value,
          desc: document.querySelector('input[name="Description"]').value,
          start: document.querySelector('input[name="StartTime"]').value,
          end: document.querySelector('input[name="EndTime"]').value,
        };
        console.log('check!2');
        try {
          const response = await fetch('http://localhost:3000/audits/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ aud }),
          });
          if (response.ok) {
            fetchAudits();
          }
        }
        catch (error) {
          console.error("Error:", error);
        }
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectType = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSelectResponsable = (event) => {
    setSelectedResponsable(event.target.value);
  };

  const handleSelectProcess = (event) => {
    setSelectedPross(event.target.value);
  };

  return (
    <div className='main'>
      <div className="form-container">
        <div>
          <label htmlFor="type">Type:</label>
          <select id="type" value={selectedType} onChange={handleSelectType}>
            <option value="">All</option>
            <option value="Interne">Interne</option>
            <option value="Externe">Externe</option>
            <option value="Qualité">Qualité</option>
          </select>
        </div>
        <div>
          <label htmlFor="responsable">Responsable:</label>
          <select id="responsable" value={selectedResponsable} onChange={handleSelectResponsable}>
            <option value="">All</option>
            {responsables.map((resp) => (
              <option key={resp.nom} value={resp.nom}>
                {resp.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="process">Processus:</label>
          <select id="process" value={selectedPross} onChange={handleSelectProcess}>
            <option value="">All</option>
            {processes.map((proc) => (
              <option key={proc.processus} value={proc.processus}>
                {proc.processus}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? ( // Show loading indicator while data is being fetched
        <div>Loading...</div>
      ) : (
        <div className="planning-table">
          <ScheduleComponent
            ref={scheduleRef}
            eventSettings={eventSettings}
            currentView="Month"
            locale='fr-CH'
            actionComplete={Events}
          >
            <ViewsDirective>
              <ViewDirective option="Day" />
              <ViewDirective option="Week" />
              <ViewDirective option="Month" />
              <ViewDirective option="Year" />
              <ViewDirective option="TimelineYear" />
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Year, TimelineYear, Resize, DragAndDrop]} />
          </ScheduleComponent>
        </div>
      )}
    </div>
  );
};

export default PlanningDauit;
