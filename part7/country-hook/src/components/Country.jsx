const Country = ({ country }) => {
    if (!country) return null
    if (!country.found) return <p>not found...</p>
  
    const { name, capital, population, flags } = country.data
  
    return (
      <div>
        <h3>{name.common}</h3>
        <div>capital {capital}</div>
        <div>population {population}</div>
        <img src={flags.png} alt={`flag of ${name.common}`} height="100" />
      </div>
    )
  }
  
  export default Country