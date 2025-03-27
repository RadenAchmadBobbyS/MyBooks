import axios from "axios";

const http = axios.create({
  baseURL: 'https://mybooks.radendev.my.id/'
});

export default http
