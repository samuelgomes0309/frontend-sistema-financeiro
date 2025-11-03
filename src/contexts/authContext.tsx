import { createContext, type ReactNode } from "react";

const AuthContext = createContext({});

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
