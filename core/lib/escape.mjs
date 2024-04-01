export function escape(s) {
    let ts = s.replaceAll("`<", "`{").replaceAll(">`", "}`")
    ts = ts.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    ts = ts.replaceAll("`{", "`<").replaceAll("}`", ">`")
    return ts
}
