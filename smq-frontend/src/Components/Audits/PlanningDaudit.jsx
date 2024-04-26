import { useEffect, useState } from 'react';
import './PlanningDaudit.css';
import { ScheduleComponent,  } from '@syncfusion/ej2-react-schedule';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Day, DragAndDrop, Inject, Month, Resize, ViewDirective, ViewsDirective, Week } from '@syncfusion/ej2-react-schedule/src';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import {  loadCldr, L10n } from "@syncfusion/ej2-base";
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { createElement } from '@syncfusion/ej2-base';


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
      'schedule': {
        'saveButton': 'Sauvegarder',
        'cancelButton': 'Annuler',
        'deleteButton': 'Supprimer',
        'newEvent': 'Ajouter',
        //to edit the editor https://ej2.syncfusion.com/react/documentation/schedule/editor-template
        //https://youtu.be/r24VBNlUmGg?si=qYYqEFIPXmoL7qib
      },
    }
  });
  L10n.load(localeData);

    const onPopupOpen = (args) => {
      if (args.type === 'Editor') {
          if (!args.element.querySelector('.custom-field-row')) {
              let row = createElement('div', { className: 'custom-field-row' });
              let formElement = args.element.querySelector('.e-schedule-form');
              formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
              let container = createElement('div', { className: 'custom-field-container' });
              let inputEle = createElement('input', {
                  className: 'e-field', attrs: { name: 'Statut' }
              });
              container.appendChild(inputEle);
              row.appendChild(container);
              let drowDownList = new DropDownList({
                  dataSource: [
                      { text: 'Audit à valider', value: 'Audits à valider' },
                      { text: 'Audit validés', value: 'Audits validés' },
                      { text: 'Audit terminé', value: 'Audits terminés' },
                  ],
                  fields: { text: 'text', value: 'value' },
                  value: args.data.EventType,
                  floatLabelType: 'Always', placeholder: 'Statut'
              });
              drowDownList.appendTo(inputEle);
              inputEle.setAttribute('name', 'Statut');
          }
      }
    } 

  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject', title: 'Processus' },
    startTime: { name: 'StartTime', title: 'Start Duration' },
    endTime: { name: 'EndTime', title: 'End Duration' },
    location: { name: 'Location', title: 'Event Location' },
  }

  const [audits, setAudits] = useState([]);

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
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    useEffect(() => {
    fetchAudits();
  }, []);


  const eventss = audits.map((event) => {
    return {
      id: event.id,
      Subject: event.processus,
      CategoryColor: "#FF0000", // Red color hex value
      StartTime: new Date(event.planningDate),
      EndTime: new Date(event.realisationDate),
      IsAllDay: true,
      Status: event.status
    }
  })
  const eventSettings = { dataSource: eventss, fields: fieldsData };
  const Events = async (args) => {
    console.log("Event :");
    const token = localStorage.getItem('token');
    if (args.requestType === 'eventChanged'){
      const idd = args.data[0].id;
      const aud ={
        iddd: idd, 
        proce: args.data[0].Subject,
        start: args.data[0].StartTime,
        end: args.data[0].EndTime
      }
      try{
        const response = await fetch('http://localhost:3000/audits/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
          body: JSON.stringify({aud}),
        });
        if (response.ok) {
          fetchAudits();
        }
      }
      catch(error){
        console.error("Error:", error);
      }
    }
    
    else if (args.requestType === 'eventRemoved'){
      const idd = args.data[0].id;
      try {
        const response = await fetch('http://localhost:3000/audits/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
          body: JSON.stringify({idd}),
        });
        
        if (response.ok) {
          fetchAudits();
        } else {
          console.error("Failed to delete:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className='backg'></div>
      <ButtonComponent ></ButtonComponent>
      <div className='Planning'>
        <ScheduleComponent locale='fr-CH'
          currentView='Month'
          width={1700}
          height={850}
          allowMultiRowSelection={false}
          allowMultiCellSelection={false}
          allowKeyboardInteraction={false}
          eventSettings={eventSettings}
          actionComplete={Events}
          popupOpen={onPopupOpen} >
            {/* use actionComplete for every event 
              drag and drop is : requestType: 'eventChanged' and it change both dates and where u put it this is the start time
              edit is the same : requestType: 'eventChanged', cancel: false, and it change the field changed
              delete is : requestType: 'eventRemoved', and it gives u the id of deleted event*/}
          {/* ViewsDirective and Inject components */}
          <ViewsDirective>
            <ViewDirective option="Month" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, DragAndDrop, Resize]} />
        </ScheduleComponent>
      </div>
    </main>
  );
}
export default PlanningDauit;
