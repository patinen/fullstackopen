const Notification = ({ message }) => {
    if (!message) return null
  
    const style = {
      padding: '1rem',
      marginBottom: '1rem',
      border: '2px solid black',
      backgroundColor: '#f0f0f0'
    }
  
    return <div style={style}>{message}</div>
  }
  
  export default Notification