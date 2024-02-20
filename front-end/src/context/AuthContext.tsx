import { PropsWithChildren, createContext, useState } from "react";
import baseUrl from "../../utils/baseurl";
import { ResNotOk } from "../@types";

interface AuthContextType {
  user: User | null;
  player: Player | undefined;
  allUsers: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  updateUser: (values: {
    email: string;
    username: string | undefined;
    favPlayer?: string | undefined;
  }) => Promise<void>;
  // updatePlayer: (values: { name: string; value: string }) => Promise<void>;
  // asyncronised function always return a promise
  createPlayer: (values: {
    name: string;
    overall: string;
    position: string;
    pace: string;
    shooting: string;
    passing: string;
    dribbling: string;
    defense: string;
    physicality: string;
    playerOwner?: string;
  }) => Promise<void>;
  updateUserWithPlayer: (
    playerId: string,
    userId: string,
    name: string,
    overall: string,
    position: string,
    pace: string,
    shooting: string,
    passing: string,
    dribbling: string,
    defense: string,
    physicality: string
  ) => Promise<void>;

  loading: boolean;
}

const defaultValue: AuthContextType = {
  user: null,
  player: undefined,
  allUsers: () => {
    throw new Error("no provider");
  },
  login: () => {
    throw new Error("no provider");
  },
  logout: () => {
    throw new Error("no provider");
  },
  signup: () => {
    throw new Error("no provider");
  },
  updateUser: () => {
    throw new Error("no provider");
  },
  // updatePlayer: () => {
  //   throw new Error("no provider");
  // },
  createPlayer: () => {
    throw new Error("no provider");
  },
  updateUserWithPlayer: () => {
    throw new Error("no provider");
  },
  loading: false,
};

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const allUsers = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("email", "");

    const requestOptions = {
      method: "GET",
      headers,
      body,
    };

    fetch("http://localhost:5000/api/users/all", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const signup = async (email: string, password: string) => {
    if (!email || !password) return alert("ALL field must be included");
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = new URLSearchParams();
    body.append("email", email);
    body.append("password", password);
    const options = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(`${baseUrl}/api/users/signup`, options);
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email: string, password: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("email", email);
    body.append("password", password);

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users/login`,
        requestOptions
      );
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
        if (!user) return alert("Incorrect Email or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (values: {
    email: string;
    username: string | undefined;
    favPlayer?: string | undefined;
  }) => {
    if (!user) return;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify(values);
    var requestOptions = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/update/${user._id}`,
        requestOptions
      );
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createPlayer = async (values: {
    name: string;
    overall: string;
    position: string;
    pace: string;
    shooting: string;
    passing: string;
    dribbling: string;
    defense: string;
    physicality: string;
    playerOwner?: string;
  }) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify(values);

    const options = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/players/createPlayer`,
        options
      );
      if (response.ok) {
        const result = (await response.json()) as Player;
        console.log("the result :>> ", result);
        setPlayer(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserWithPlayer = async (
    playerId: string,
    userId: string,
    name: string,
    overall: string,
    position: string,
    pace: string,
    shooting: string,
    passing: string,
    dribbling: string,
    defense: string,
    physicality: string
  ) => {
    // if (!user && !player) return;

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = new URLSearchParams();
    body.append("playerId", playerId);
    body.append("userId", userId);
    body.append("name", name);
    body.append("overall", overall);
    body.append("position", position);
    body.append("pace", pace);
    body.append("shooting", shooting);
    body.append("passing", passing);
    body.append("dribbling", dribbling);
    body.append("defense", defense);
    body.append("physicality", physicality);

    var options = {
      method: "PATCH",
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/updateUserList`,
        options
      );
      if (response.ok) {
        const result = await response.json();
        console.log("result :>> ", result);
        // setPlayer(result);
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        player,
        loading,
        allUsers,
        login,
        logout,
        signup,
        updateUser,
        createPlayer,
        updateUserWithPlayer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
