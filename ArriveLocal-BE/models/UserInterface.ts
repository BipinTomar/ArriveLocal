// models/UserInterface.ts

import { Request } from "express";

 export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}


export interface IUser {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
}

export interface IRegister {
  id?: string;
  name: string;
  email: string;
  password: string; // hashed password
  mobile: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshTokens?: string[]; // <-- add this
}

export interface ILogin {
  email: string;
  password: string;
}
