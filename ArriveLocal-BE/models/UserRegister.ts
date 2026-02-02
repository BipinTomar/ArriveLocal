import fs, { read } from 'fs';
const fsPromises = require('fs').promises;
import path from 'path';
import { IRegister, IUser} from './UserInterface';

// Path to the users.json file
const USERS_FILE_PATH = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE_PATH);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir,{ recursive: true })
};


// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE_PATH)) {
  fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2),(err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Initialized users.json');
  });
}

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public mobile: string;
  public role: string;
  public createdAt: Date;
  public updatedAt: Date;
  public refreshTokens : string [];

  constructor(userData: IRegister) {
    this.id = userData.id || this.generateId();
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.mobile = userData.mobile;
    this.role = userData.role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.refreshTokens = userData.refreshTokens || [];
  }

   generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static  async getAllUsers() : Promise<IRegister []> {
    let readFile: IRegister[] = [];
    try {
      const data = await fsPromises.readFile(USERS_FILE_PATH, 'utf8');
      readFile = JSON.parse(data);
    } catch (err) {
      console.log("error:", err);
      readFile = [];
    }
    return readFile;
  }
  async save(): Promise<IRegister> {
   
      const readFile = await User.getAllUsers();
      let emailCheck: IRegister | null = null;
      emailCheck = readFile.find((user: IRegister) =>  user.email.toLowerCase() === this.email.toLocaleLowerCase()) ?? null;

      if(!emailCheck){
        
        const now = new Date();
        readFile.push({
          id: this.id,
          name: this.name,
          email: this.email,
          password: this.password,
          mobile: this.mobile,
          role: this.role,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          refreshTokens: this.refreshTokens
        });
        await fsPromises.writeFile(USERS_FILE_PATH, JSON.stringify(readFile, null, 2), 'utf8');
        console.log("User Registered");
        return this;
      }
      else{
        throw new Error('User with this email already exists');
      }

    };
  
  static async findByEmail(email: string): Promise<IRegister>{

    const readFile = await User.getAllUsers();
      let emailCheck: IRegister | null = null;
      emailCheck = readFile.find((user: IRegister) =>  user.email.toLowerCase() === email.toLowerCase()) ?? null;
      if(emailCheck){
        return emailCheck;
      }
      else {
        throw new Error('User with this email does not exists');
      }
  }
  static async updateTokens(
    email : string , 
    tokens : string[]
  ): Promise<void>{
      const users = await User.getAllUsers();
      const idx = users.findIndex(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (idx !== -1) {
        users[idx].refreshTokens = tokens;
        await fsPromises.writeFile(
          USERS_FILE_PATH,
          JSON.stringify(users, null, 2)
        );
      }
  }

}

export default User;
