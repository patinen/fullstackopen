import axios from "axios";

const API_URL = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

const getByName = async (name) => {
  const response = await axios.get(`${API_URL}/name/${name}`);
  return response.data;
};

export default { getAll, getByName };