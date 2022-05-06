import React from 'react';
import { Link } from 'react-router-dom';

const SimpleChatWidget = (props) => {

  const buttonText = props.buttonText || 'Feedback';
  const subject = props.subject || 'feedback';

  
  const subjectIconMap = {
    'question': (
      <span className="icon">
        <i className="fas fa-question-circle"></i>
      </span>
    )
  }

  return (
    <Link to={`/contact?subject=${subject}`} className="button is-link is-small" style={{position: 'fixed', bottom: '23px', right: '13px'}}>
      {subjectIconMap[subject]}
      <span>{buttonText}</span>
    </Link>
  );
}

export default SimpleChatWidget;
