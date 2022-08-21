import React, {useEffect, useState, useCallback}  from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import moment from 'moment';

const MORNING = 'morning';
const EVENING = 'evening';

const DayJournal = ({day, isDayLoading}) => {
  const defaultNoteType = moment().hour() < 20 ? MORNING : EVENING;

  let [morningNote, setMorningNote] = useState('');
  let [eveningNote, setEveningNote] = useState('');
  let [error, setError] = useState('');
  let [noteType, setNoteType] = useState(defaultNoteType);
  let updateTimer;

  useEffect(() => {
    if (day) {
      setMorningNote(day.morningNote || '');
      setEveningNote(day.eveningNote || '');
    }
  }, [day]);

  const onNoteChange = (newMorningNote, newEveningNote) => {
    setMorningNote(newMorningNote);
    setEveningNote(newEveningNote);

    debouncedUpdateDay(day, newMorningNote, newEveningNote);
  }

  const updateDay = (day, newMorningNote, newEveningNote) => {
    Meteor.call('days.update', day._id, {morningNote: newMorningNote, eveningNote: newEveningNote}, (err, res) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
      }
    });
  }
  const debouncedUpdateDay = useCallback(_.debounce(updateDay, 1000, false), []);

  if (isDayLoading) {
    return null;
  }

  return (
    <div className="mb-5">
      <div className={noteType === MORNING ? 'notification is-warning is-light' : 'notification is-dark is-light'}>
        <div className="field has-addons">
          <p className="control is-expanded">
            <button className={noteType === MORNING ? 'button is-small is-warning is-fullwidth' : 'button is-small is-fullwidth'} onClick={() => setNoteType(MORNING)}>
              <span className="icon is-small"><i className="fas fa-sun" aria-hidden="true"></i></span>
              <span>Intention</span>
            </button>
          </p>
          <p className="control is-expanded">
            <button className={noteType === EVENING ? 'button is-small is-dark is-fullwidth' : 'button is-small is-fullwidth'} onClick={() => setNoteType(EVENING)}>
              <span className="icon is-small"><i className="fas fa-moon" aria-hidden="true"></i></span>
              <span>Reflection</span>
            </button>
          </p>
        </div>
        {error ? <p className="help is-danger has-text-centered">{error}</p> : null}
        {noteType === MORNING ? (
          <textarea className="textarea is-small is-warning" rows="2" placeholder="What good shall I do today?" value={morningNote} onChange={(e) => onNoteChange(e.target.value, eveningNote)}></textarea>
        )
        : (
          <textarea className="textarea is-small is-dark" rows="2" placeholder="What good have I done today?" value={eveningNote} onChange={(e) => onNoteChange(morningNote, e.target.value)}></textarea>
        )}
      </div>
    </div>
  );
};

export default DayJournal;
