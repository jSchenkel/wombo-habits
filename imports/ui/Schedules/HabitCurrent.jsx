import React from 'react';

import { ALL_DAY_DURATION } from '../../constants/schedules.js';


const HabitCurrent = (props) => {
  const saveButton = props.isHabitLoading ? (
     <div className="field">
       <div className="control">
         <button className="button is-link is-small is-loading">Save</button>
       </div>
     </div>
    ) : (
    <div className="field">
      <div className="control">
        <button className="button is-link is-small" type="submit">Save</button>
      </div>
    </div>
  );

  const cancelButton = props.isHabitLoading ? (
     <div className="field">
       <div className="control">
         <button className="button is-light is-small" type="button" disabled>Cancel</button>
       </div>
     </div>
    ) : (
    <div className="field">
      <div className="control">
        <button className="button is-light is-small" type="button" onClick={props.reset}>Cancel</button>
      </div>
    </div>
  );

  const events = props.events.map((event, index) => {
    return (
      <div key={index} className="mb-2">
        <span className="is-size-7">Weekly on </span>
        <div className="select is-small ml-2 mr-2">
          <select onChange={(event) => props.handleEventInputChange(event, index)} name="day" value={event.day}>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>
        <span className="is-size-7">at</span>
        <div className="select is-small ml-2">
          <select onChange={(event) => props.handleEventInputChange(event, index)} name="startTimeHour" value={event.startTimeHour}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div className="select is-small">
          <select onChange={(event) => props.handleEventInputChange(event, index)} name="startTimeMinute" value={event.startTimeMinute}>
            <option value="00">00</option>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>
          </select>
        </div>
        <div className="select is-small mr-2">
          <select onChange={(event) => props.handleEventInputChange(event, index)} name="startTimePeriod" value={event.startTimePeriod}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <span className="is-size-7">for</span>
        <div className="select is-small ml-2 mr-2">
          <select onChange={(event) => props.handleEventInputChange(event, index)} name="duration" value={event.duration}>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="20">20 min</option>
            <option value="25">25 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 min</option>
            <option value="120">2 hour</option>
            <option value="150">2 hour 30 min</option>
            <option value="180">3 hour</option>
            <option value="240">4 hour</option>
            <option value="300">5 hour</option>
            <option value="360">6 hour</option>
            <option value="420">7 hour</option>
            <option value="480">8 hour</option>
            <option value="540">9 hour</option>
          </select>
        </div>
        <span className="icon has-pointer" title="Clone" onClick={() => props.handleEventCloned(index)}>
          <i className="fas fa-clone"></i>
        </span>
        <span className="icon has-pointer" title="Remove" onClick={() => props.handleEventRemoved(index)}>
          <i className="fas fa-trash"></i>
        </span>
      </div>
    );
  });
  return (
    <div className="box">
      <form onSubmit={props.handleHabitSave}>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label is-small">Title</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          <div className="control">
            <input className="input is-small" type="text" name="title" value={props.title} required maxLength="30" placeholder="" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label is-small">Description</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          <div className="control">
            <textarea className="textarea is-small" name="description" value={props.description} required rows="2" placeholder="" onChange={props.handleInputChange}></textarea>
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label is-small">Events</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
        </div>
        {events}
        <span className="button is-small" onClick={props.handleEventAdded}>
          <span className="icon has-pointer">
            <i className="fas fa-plus"></i>
          </span>
          <span>Event</span>
        </span>
        <hr />
        {props.habitError ? <label className="help is-danger">{props.habitError}</label> : null}
        {saveButton}
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              {cancelButton}
            </div>
          </div>
          <div className="level-right">
            {props.currentHabitId ? (
              <div className="field">
                <div className="control">
                  <button className="button is-small is-danger" type="button" onClick={() => props.deleteHabit(props.currentHabitId)}>Delete</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default HabitCurrent;
