import React from 'react';

export const Counter = () => {
    const [counter, setCounter] = React.useState(3);

    // Third Attempts
    React.useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return <div className="counter"> {counter}</div>
}