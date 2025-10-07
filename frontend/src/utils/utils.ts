import { internos } from "../constants/internos";

export function isInterno(type: string) {
    return internos.includes(type)
}