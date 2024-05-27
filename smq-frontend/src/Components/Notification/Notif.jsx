import { useEffect, useState } from 'react'; 
import "./Notif.css";

const Notif = () => {
  const [audits, setAudits] = useState([]);
  const [thereisnotif, setThereisnotif] = useState(false);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/notif/soon', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.num > 0){
            setAudits(data.soonAudits);
            setThereisnotif(true);
          } else {
            setThereisnotif(false);
          }
        } else {
          console.error("Failed to fetch audits:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAudits();
  }, []); // Empty dependency array to ensure this runs only once on component mount

  return (
    <div className="notification-container">
      <div className='Notifc'>
        {thereisnotif ? (
          <ul className="list">
            {audits.map(audit => (
              <div key={audit.id} className="audit">
                <p>{audit.processus}</p> 
              </div>
            ))}
          </ul>
        ) : (
          <div className='NoNotif'>There is no notification</div>
        )}
      </div>
    </div>
  );
};

export default Notif;
