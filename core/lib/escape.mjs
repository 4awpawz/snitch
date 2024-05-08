export function escape(s) {
    return s.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}
