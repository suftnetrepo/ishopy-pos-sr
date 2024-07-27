/* eslint-disable prettier/prettier */
import React, { useState, ReactNode, useContext } from "react";

interface Actions {
    clear: () => Promise<void>;
    onValueChange: (value: number) => void;
}

interface State {
    selected: number;
}

interface FaqProviderProps {
    children: ReactNode;
}

export const FaqContext = React.createContext<Actions & State | undefined>(undefined);

const initialState: State = {
    selected: 0,
};

const FaqProvider = ({ children }: FaqProviderProps) => {
    const [state, setState] = useState<State>(initialState);

    const actions: Actions = {
        clear: async () => {
            setState(initialState);
        },

        onValueChange: (value) => {
            setState((prevState) => ({
                ...prevState,
                selected: value,
            }));
        }
    };

    return (
        <FaqContext.Provider value={{ ...state, ...actions }}>
            {children}
        </FaqContext.Provider>
    );
};

export default FaqProvider;

export const useFaqContext = (): Actions & State => {
    const context = useContext(FaqContext);
    if (!context) {
        throw new Error("useFaqContext must be used within an FaqProvider");
    }
    return context;
};
