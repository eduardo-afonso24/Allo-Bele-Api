// interfaces.ts
export interface RegisterInput {
    name: string;
    email: string;
    phone: number;
    password: string;
    address:string;
    DateBirth:Date;
    avatar:string;
  }

  export interface AdminRegisterInput {
    name: string;
    email: string;
    phone: number;
    password: string;
    address:string;
    DateBirth:Date;
    avatar:string;
    generateToken(): string;

  }

  export interface collaboratorRegisterInput {
    name: string;
    email: string;
    phone: number;
    password: string;
    address: string;
    dateOfBirth: Date;
    avatar: string;
    privileges: {
      createUsers: boolean;
      deleteUsers: boolean;
      editUsers: boolean;
      createPosts: boolean;
      deletePosts: boolean;
      editPosts: boolean;
      manageSettings: boolean;
      managePermissions: boolean;
    
    };
  }
  export interface LoginInput {
    email: string;
    password: string;
    role:string
  }

  export interface UserInterface {
    _id: Number;
    name: string;
    email: string;
    phone: number;
    password:string;
  }


export interface BaberRegisterInput{
    name: string;
    email: string;
    phone: number;
    password?: string;
    address:string;
    DateBirth:Date;
    avatar?: {
      public_id: string;
      url: string;
    };
    Baberservices: string[]
}


//// NOVAS INTERFACES


interface Avatar {
  public_id: string;
  url: string;
}

export interface AllUserInterface{
  name: string;
  email: string;
  phone: number;
  password: string;
  address: string;
  DateBirth: Date;
  avatar?: Avatar;
  role: "client" | "barber" | "company";
  ProfissionalServices: string[];
  nif?: string;

}





 
  




