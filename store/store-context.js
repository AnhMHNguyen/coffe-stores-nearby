import { createContext, useReducer, useContext } from 'react'

const StoreContext = createContext();
export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return {
        ...state,
        latLong: action.payload.latLong
      }
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores
      }
    }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }
}

const initialState = {
  latLong: "",
  coffeeStores: []
};

export const StoreProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider
      value={{state, dispatch}}
    >
      {children}
    </StoreContext.Provider>
  )
};

export function useStoreContext() {
   return useContext(StoreContext);
}