    
    export function debounce<T extends (...args: any[]) => any>( func: T, delay: number = 300 ): 
    (...args: Parameters<T>) => void {

    let timer: ReturnType<typeof setTimeout> | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };

}