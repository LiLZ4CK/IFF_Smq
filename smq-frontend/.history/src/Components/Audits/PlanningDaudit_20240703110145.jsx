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
  const [events, setEvents] = useState([]);
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
        setProcesses(data.procs);
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

  useEffect(() => {
    const mappedEvents = audits.map((event) => {
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
    setEvents(mappedEvents);
    console.log('Mapped Events:', mappedEvents);
  }, [audits]);

  useEffect(() => {
    console.log('Processes:', processes);
  }, [processes]);

  useEffect(() => {
    console.log('Responsables:', responsables);
  }, [responsables]);

  useEffect(() => {
    console.log('Audits:', audits);
  }, [audits]);

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
    dataSource: events,
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
          const response = await fetch('http://localhost:3000/audits/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ aud }),
          });
          if (response.ok) {
            fetchAudits();
          } else {
            console.error("Failed to create:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onProcessChange = (event) => {
    setSelectedPross(event.target.value);
    filter();
  }

  const onResponsableChange = (event) => {
    setSelectedResponsable(event.target.value);
    filter();
  }

  const onTypeChange = (event) => {
    setSelectedType(event.target.value);
    filter();
  }

  const clearFilters = () => {
    setSelectedType('');
    setSelectedResponsable('');
    setSelectedPross('');
    filter();
  }

  const filter = () => {
    const filteredEvents = audits
    .filter(audit => {
      const typeMatch = !selectedType || audit.type === selectedType;
      const responsableMatch = !selectedResponsable || audit.responsable === selectedResponsable;
      const processMatch = !selectedPross || audit.process === selectedPross;
      return typeMatch && responsableMatch && processMatch;
    })
    .map((event) => ({
      id: event.id,
      Subject: event.processus,
      StartTime: new Date(event.planningDate),
      EndTime: new Date(event.realisationDate),
      IsAllDay: false,
      Status: event.status,
      Type: event.type,
    }));

    setEvents(filteredEvents);
  };

  return (
    <div className="planau-container">
      <h1 className="main-title">Plan d'audit</h1>
      <div className="filters">
        <select id="process-filter" onChange={onProcessChange}>
          <option value="">Tous les processus</option>
          {processes.map((process) => (
            <option key={process.id} value={process.nom}>
              {process.nom}
            </option>
          ))}
        </select>
        <select id="responsable-filter" onChange={onResponsableChange}>
          <option value="">Tous les responsables</option>
          {responsables.map((responsable) => (
            <option key={responsable.id} value={responsable.nom}>
              {responsable.nom}
            </option>
          ))}
        </select>
        <select id="type-filter" onChange={onTypeChange}>
          <option value="">Tous les types</option>
          <option value="1">Interne</option>
          <option value="2">Externe</option>
        </select>
        <button onClick={clearFilters}>Clear Filters</button>
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
  );
};

export default PlanningDauit;
