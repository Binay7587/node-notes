import PropTypes from 'prop-types'

const NoteForm = ({ onSubmit, handleChange, value}) => {
  
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

NoteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default NoteForm