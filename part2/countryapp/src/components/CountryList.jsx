const CountryList = ({ countries, onSelect }) => {
    if (countries.length > 10) {
      return <p>Too many matches, refine your search.</p>;
    }
    
    return (
      <div>
        {countries.map((c) => (
          <p key={c.cca3}>
            {c.name.common} <button onClick={() => onSelect(c)}>Show</button>
          </p>
        ))}
      </div>
    );
  };
  
  export default CountryList;