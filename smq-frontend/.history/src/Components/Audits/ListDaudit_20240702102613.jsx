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
  }

  const [audits, setAudits] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [responsables, setResponsables] = useState([]);

  const fetchProcesses = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/proc/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setProcesses(data.procs);
        }
    } catch (error) {
        console.error('Error fetching processes:', error);
    }
  };

  const fetchResponsables = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/nconf/resp', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setResponsables(data.resp);
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
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
  }

  useEffect(() => {
    fetchAudits();
    fetchProcesses();
    fetchResponsables();
  }, []);

  const EventTemplate = (props) => {
    const data = props.data || {};
    console.log('Event data:', data);
    console.log('Status:', data.Status, 'Type:', typeof data.Status);

    let backgroundColor, borderColor, color;
    
    if (data.Status === '1' || data.Status === 1) {
      backgroundColor = 'green';
      borderColor = 'darkgreen';
      color = 'white';
    } else if (data.Status === '2' || data.Status === 2) {
      backgroundColor = 'yellow';
      borderColor = 'gold';
      color = 'black';
    } else {
      backgroundColor = 'orange';
      borderColor = 'darkorange';
      color = 'white';
    }

    console.log('Selected color:', backgroundColor);

    const styles = {
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      color: color,
      border: '1px solid',
      borderRadius: '2px',
      padding: '2px',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    };

    return (
      <div className="template-wrap" style={styles}>
        {props.Subject}
      </div>
    );
  };

  const eventss = audits.map((event) => {
    console.log('Audit event:', event); // Debug log
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
  console.log('Mapped events:', eventss); // Debug log

  const eventSettings = { dataSource: eventss, fields: fieldsData, template: EventTemplate };

  const Events = async (args) => {
    // ... (rest of the Events function remains unchanged)
  };

  const editorWindow = (props) => {
    // ... (rest of the editorWindow function remains unchanged)
  };

  const [selectedType, setSelectedType] = useState('');
  const [selectedResponsable, setSelectedResponsable] = useState('');
  const [selectedPross, setSelectedPross] = useState("");

  const scheduleRef = useRef(null);

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
            id="selectResponsable"
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