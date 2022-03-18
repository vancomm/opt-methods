export function secant(df, eps, interval) {
    const [a, b] = interval;
    if (df(a) * df(b) < 0) {
        const x_k = a - (df(a) / (df(a) - df(b))) * (a - b);
        if (Math.abs(df(x_k)) <= eps)
            return x_k;
        if (df(x_k) > 0)
            return secant(df, eps, [a, x_k]);
        return secant(df, eps, [x_k, b]);
    }
    if (df(a) > 0 && df(b) > 0)
        return a;
    if (df(a) < 0 && df(b) < 0)
        return b;
    return df(a) === 0
        ? a
        : b;
}
