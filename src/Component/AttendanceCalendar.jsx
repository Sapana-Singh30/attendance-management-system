import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import './AttendanceCalendar.css';

const AttendanceCalendar  = () => {

  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/attendance')
      .then((response) => response.json())
      .then((data) => setAttendance(data))
      .catch((error) => console.error('Error loading attendance data:', error));
  }, []);

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleAttendanceChange = (status) => {
    const newAttendance = { ...attendance };
    newAttendance[date.toISOString()] = status;
    setAttendance(newAttendance);

    fetch('http://localhost:3001/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: date.toISOString(), status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error storing attendance data:', error);
      });

      setOpen(false);
  };

  const tileClassName = ({ date }) => {
    const dateKey = date.toISOString();
    if (attendance[dateKey] === 'present') {
      return 'present';
    } else if (attendance[dateKey] === 'absent') {
      return 'absent';
    }
    return '';
  };


  return (
    <div className='attendance_container'>   <h2>Attendance Calendar</h2>
    <Calendar
      onClickDay={handleDateClick}
      value={date}
      tileClassName={tileClassName}
    />
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      contentLabel="Attendance Modal"
    >
      <h3>Date: {date.toDateString()}</h3>
      <button
        className="modal-button present"
        onClick={() => handleAttendanceChange('present')}
      >
        Present
      </button>
      <button
        className="modal-button absent"
        onClick={() => handleAttendanceChange('absent')}
      >
        Absent
      </button>
    </Modal>
     </div>
  )
}

export default AttendanceCalendar 