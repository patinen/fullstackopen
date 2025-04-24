const Notify = ({ errorMessage }) => {
    if (!errorMessage) return null
  
    const style = {
      color: 'red',
      background: 'lightgray',
      padding: 10,
      borderRadius: 4,
      marginBottom: 10,
    }
  
    return <div style={style}>{errorMessage}</div>
  }
  
  export default Notify