import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const QuestionAnswer = ({question}) => {
  let askerMediaJSX = (
    <article className="media">
      <figure className="media-left">
        <span className="icon is-medium">
          <i className="fas fa-user-circle fa-2x"></i>
        </span>
      </figure>
      <div className="media-content">
        <div className="content">
          <p className="mb-2 has-text-grey-dark">
            <strong>{question.firstname}</strong> <small>{moment(question.created).fromNow()}</small>
          </p>
          <p>{question.displayableDescription}</p>
        </div>
      </div>
    </article>
  );

  if (question.asker) {
    askerMediaJSX = (
      <article className="media">
        <figure className="media-left">
          <Link to={`/${question.asker.username}`} className="image is-32x32">
            <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={question.asker.profilePictureImageUrl ? question.asker.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
          </Link>
        </figure>
        <div className="media-content">
          <div className="content">
            <Link to={`/${question.asker.username}`} className="mb-2 has-text-grey-dark">
              <strong>{question.asker.name}</strong> <small>@{question.asker.username}</small> <small>{moment(question.created).fromNow()}</small>
            </Link>
            <p>{question.displayableDescription}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div key={question._id} className="column is-full">
      <div className="box pt-1">
        <div className="level is-mobile mb-0">
          <div className="level-left">
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                  <button className="button is-small is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span className="icon is-small has-text-dark">
                      <i className="fas fa-ellipsis-h" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <Link to={`/q/${question._id}`} className="dropdown-item">
                      <p className="">Go to post</p>
                    </Link>
                    {/* TODO: support the following menu items */}
                    {/* <a className="dropdown-item">
                      <p className="">Share to...</p>
                    </a> */}
                    {/* <a className="dropdown-item">
                      <p className="">Copy Link</p>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {askerMediaJSX}
        <hr />
        <article className="media">
          <figure className="media-left">
            <Link to={`/${question.creator.username}`} className="image is-32x32">
              <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={question.creator.profilePictureImageUrl ? question.creator.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
            </Link>
          </figure>
          <div className="media-content">
            <div className="content">
              <Link to={`/${question.creator.username}`} className="has-text-grey-dark">
                <strong>{question.creator.name}</strong> <small>@{question.creator.username}</small> <small>{moment(question.submitted).fromNow()}</small>
              </Link>
              <br />
              <audio controls controlsList="nodownload" className="mt-2">
                <source src={question.answerAudioUrl} type="audio/m4a" />
                <source src={question.answerAudioUrl} type="audio/mp4" />
                <source src={question.answerAudioUrl} type="audio/mp3" />
                <source src={question.answerAudioUrl} type="audio/ogg" />
                <source src={question.answerAudioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default QuestionAnswer;
