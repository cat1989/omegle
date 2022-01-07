type DecoratedFunction = (...args: any) => void;

export function debounce(func: DecoratedFunction, ms = 1000): DecoratedFunction {
    let timeout = 0
    return function(this: ThisParameterType<DecoratedFunction>, ...args: any) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, ms)
    }
}

export function throttle(func: DecoratedFunction, ms = 1000): DecoratedFunction {
    let savedThis: any = null
    let savedArgs: any = null
    let isThrottled = false
    function wrapper(this: ThisParameterType<DecoratedFunction>, ...args: any) {
        if (isThrottled) {
            savedThis = this
            savedArgs = args
            return
        }
        isThrottled = true
        func.apply(this, args)
        setTimeout(() => {
            isThrottled = false
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs)
                savedThis = null
                savedArgs = null
            }
        }, ms)
    }
    return wrapper
}
