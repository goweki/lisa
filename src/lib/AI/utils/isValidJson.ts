export function isValidJson(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}