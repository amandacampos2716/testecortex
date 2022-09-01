import axios, { Axios } from 'axios';

export default class HttpApi {
  private api;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL: baseURL,
    });
  }

  public getApi(): Axios {
    return this.api;
  }
}