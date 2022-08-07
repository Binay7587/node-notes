import React from 'react'
import PropTypes from 'prop-types'

const Note = ({ note, toggleImportance  }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      {note.content}{'  '}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

Note.prototype = {
  note: PropTypes.shape({
    content: PropTypes.string.isRequired,
    important: PropTypes.bool.isRequired
  }).isRequired,
  toggleImportance: PropTypes.func.isRequired
}

export default Note