import { useContext, useState, useEffect } from 'react';
import Context from './Context';

export const useGlobalStates = () => {
    const [state, dispatch] = useContext(Context);
    return [state, dispatch];
};

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timerId);
    }, [value]);

    return debouncedValue;
};
