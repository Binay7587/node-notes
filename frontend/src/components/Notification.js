const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  if (notification.type === 'success') {
    return (
      <div className='success'>
        {notification.message}
      </div>
    )
  }else if (notification.type === 'error'){
    return (
      <div className='error'>
        {notification.message}
      </div>
    )
  }
}

export default Notification